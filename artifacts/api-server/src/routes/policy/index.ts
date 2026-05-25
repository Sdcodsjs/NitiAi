import verifyRouter from "./verify";
import impactRouter from "./impact";
import analyticsRouter from "./analytics";
import { Router, type Request, type Response } from "express";
import { ai, withRetry } from "@workspace/integrations-gemini-ai";
import {
  QueryPolicyBody,
  ComparePoliciesBody,
  RecommendPoliciesBody,
  ListSchemesQueryParams,
} from "@workspace/api-zod";
import {
  POLICY_KNOWLEDGE_BASE,
  SECTORS,
  MINISTRIES,
  searchPolicies,
  type PolicyChunk,
} from "../../data/policies";

const router = Router();

const SYSTEM_PROMPT = `You are NitiAI, an expert AI assistant specializing in Indian Government Policy.
You answer questions STRICTLY based on the provided policy context.
You NEVER hallucinate or fabricate information not present in the context.
If no relevant information is found in the context, respond with noDataFound: true and a helpful message.
IMPORTANT: Always respond in the language specified by the RESPOND_IN_LANGUAGE field — regardless of what language the question was asked in.
Structure responses with clear sections.`;

function buildPolicyContext(chunks: PolicyChunk[]): string {
  if (chunks.length === 0) return "No relevant policy information found.";
  return chunks
    .map(
      (c) =>
        `SCHEME: ${c.schemeName}\nSECTOR: ${c.sector}\nMINISTRY: ${c.ministry}\n` +
        `DESCRIPTION: ${c.description}\nELIGIBILITY: ${c.eligibility}\n` +
        `BENEFITS: ${c.benefits}\nAPPLICATION PROCESS: ${c.applicationProcess}\n` +
        `SOURCE: ${c.source}`
    )
    .join("\n\n---\n\n");
}

router.post("/query", async (req: Request, res: Response): Promise<void> => {
  const parsed = QueryPolicyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  type HistoryEntry = { role: "user" | "assistant"; content: string };
  const data = parsed.data as typeof parsed.data & { history?: HistoryEntry[] };
  const { query, language = "en", persona } = data;

  // Guard against oversized inputs that could inflate API costs or cause issues
  if (query.length > 1000) {
    res.status(400).json({ error: "validation_error", message: "Query must not exceed 1000 characters" });
    return;
  }

  const history: HistoryEntry[] = (data.history ?? []).slice(-10); // cap history to last 10 turns


  // For non-English queries, translate to English first for accurate keyword retrieval
  let searchQuery = query;
  if (language !== "en") {
    try {
      const translateResp = await withRetry(() => ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: [{ role: "user", parts: [{ text: `You are a translator. Translate the following query to English. Output ONLY the English translation with no extra words, quotes, or punctuation:\n${query}` }] }],
        config: { maxOutputTokens: 100 },
      }));
      // Strip surrounding quotes, trim whitespace, then use lowercase for matching
      const raw = (translateResp.text ?? "").trim().replace(/^["']|["']$/g, "");
      if (raw.length > 3) searchQuery = raw;
    } catch {
      // fall back to original query
    }
  }

  let retrievedChunks = searchPolicies(searchQuery, 4);
  // Fallback for non-English queries: if retrieval fails, use all policies so LLM can answer
  if (retrievedChunks.length === 0 && language !== "en") {
    retrievedChunks = POLICY_KNOWLEDGE_BASE.slice(0, 6);
  }
  const noDataFound = retrievedChunks.length === 0;
  const context = buildPolicyContext(retrievedChunks);

  const languageNames: Record<string, string> = {
    en: "English",
    hi: "Hindi (हिंदी)",
    kn: "Kannada (ಕನ್ನಡ)",
    ta: "Tamil (தமிழ்)",
    te: "Telugu (తెలుగు)",
    mr: "Marathi (मराठी)",
  };
  const respondInLanguage = languageNames[language] ?? "English";

  const prompt = `${SYSTEM_PROMPT}

USER QUERY: "${query}"
${persona ? `USER PERSONA: ${persona}` : ""}
RESPOND_IN_LANGUAGE: ${respondInLanguage}

POLICY CONTEXT:
${context}

Based ONLY on the above context, provide a structured response in JSON with these fields:
- summary: Brief answer to the query (2-3 sentences) written entirely in ${respondInLanguage}. If no data found, say so in ${respondInLanguage}.
- eligibility: Who is eligible (from context only) in ${respondInLanguage}. Empty string if not applicable.
- benefits: Key benefits listed (from context only) in ${respondInLanguage}. Empty string if not applicable.
- applicationProcess: How to apply (from context only) in ${respondInLanguage}. Empty string if not applicable.
- confidenceScore: Number 0-1 reflecting how well the context answers the query. 0 if noDataFound.
- noDataFound: Boolean. True if context is empty or query is completely out of scope.
- language: "${language}"

Respond ONLY with valid JSON, no markdown.`;

  // Build multi-turn conversation contents (prior history + current prompt)
  const historyContents = history.map((h) => ({
    role: h.role === "assistant" ? "model" : "user",
    parts: [{ text: h.content }],
  }));

  try {
    req.log.info({ query, language, persona, retrievedCount: retrievedChunks.length }, "Processing policy query");
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [
        ...historyContents,
        { role: "user", parts: [{ text: prompt }] },
      ],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    }));

    const text = response.text ?? "{}";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { summary: text, noDataFound: false, confidenceScore: 0.5 };
    }

    const sources = retrievedChunks.map((c) => ({
      text: c.description.slice(0, 200) + "...",
      scheme: c.schemeName,
      source: c.source,
      relevanceScore: 0.8,
    }));

    res.json({
      summary: parsed.summary ?? "",
      eligibility: parsed.eligibility ?? "",
      benefits: parsed.benefits ?? "",
      applicationProcess: parsed.applicationProcess ?? "",
      sources,
      confidenceScore: parsed.confidenceScore ?? (noDataFound ? 0 : 0.7),
      language: language,
      noDataFound: parsed.noDataFound ?? noDataFound,
    });
  } catch (err) {
    req.log.error({ err }, "Policy query error");
    res.status(500).json({ error: "server_error", message: "Failed to process query" });
  }
});

router.post("/compare", async (req: Request, res: Response): Promise<void> => {
  const parsed = ComparePoliciesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { schemes, query } = parsed.data;

  const matchedSchemes = schemes.map((name) => {
    const results = searchPolicies(name, 1);
    return results[0] ?? null;
  }).filter(Boolean) as PolicyChunk[];

  const context = buildPolicyContext(matchedSchemes);

  const prompt = `${SYSTEM_PROMPT}

TASK: Compare the following government schemes: ${schemes.join(", ")}
${query ? `SPECIFIC FOCUS: ${query}` : ""}

POLICY CONTEXT:
${context}

Provide a JSON response with:
- schemes: array of scheme names being compared
- comparisonRows: array of objects with {aspect: string, values: {schemeName: value}} for aspects like: Eligibility, Benefits, Amount, Application Process, Target Beneficiaries, Sector, Ministry
- summary: 2-3 sentence comparison summary
- confidenceScore: 0-1

Respond ONLY with valid JSON.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json", maxOutputTokens: 8192 },
    }));

    const text = response.text ?? "{}";
    let result: Record<string, unknown>;
    try {
      result = JSON.parse(text);
    } catch {
      result = { schemes, comparisonRows: [], summary: text, confidenceScore: 0.5 };
    }

    const sources = matchedSchemes.map((c) => ({
      text: c.description.slice(0, 150) + "...",
      scheme: c.schemeName,
      source: c.source,
      relevanceScore: 0.9,
    }));

    res.json({
      schemes: result.schemes ?? schemes,
      comparisonRows: result.comparisonRows ?? [],
      summary: result.summary ?? "",
      sources,
      confidenceScore: result.confidenceScore ?? 0.7,
    });
  } catch (err) {
    req.log.error({ err }, "Policy compare error");
    res.status(500).json({ error: "server_error", message: "Failed to compare policies" });
  }
});

router.post("/recommend", async (req: Request, res: Response): Promise<void> => {
  const parsed = RecommendPoliciesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { persona, interests } = parsed.data;

  const searchQuery = [persona, ...(interests ?? [])].join(" ");
  const topPolicies = searchPolicies(searchQuery, 5);
  const context = buildPolicyContext(topPolicies);

  const prompt = `${SYSTEM_PROMPT}

USER PERSONA: "${persona}"
${interests?.length ? `INTERESTS: ${interests.join(", ")}` : ""}

POLICY CONTEXT:
${context}

Based on this persona and ONLY the policies in the context, recommend the most relevant government schemes.

Respond with JSON:
{
  "persona": "${persona}",
  "recommendations": [
    {
      "name": "scheme name",
      "sector": "sector",
      "summary": "1-sentence why this is relevant for the persona",
      "matchReason": "specific reason this persona qualifies",
      "eligibilityHighlight": "key eligibility criteria",
      "benefitHighlight": "most important benefit"
    }
  ],
  "confidenceScore": 0-1
}

Respond ONLY with valid JSON.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json", maxOutputTokens: 8192 },
    }));

    const text = response.text ?? "{}";
    let result: Record<string, unknown>;
    try {
      result = JSON.parse(text);
    } catch {
      result = { persona, recommendations: [], confidenceScore: 0.5 };
    }

    res.json({
      persona: result.persona ?? persona,
      recommendations: result.recommendations ?? [],
      confidenceScore: result.confidenceScore ?? 0.7,
    });
  } catch (err) {
    req.log.error({ err }, "Policy recommend error");
    res.status(500).json({ error: "server_error", message: "Failed to generate recommendations" });
  }
});

router.get("/schemes", (req: Request, res: Response): void => {
  const params = ListSchemesQueryParams.safeParse(req.query);
  let schemes = [...POLICY_KNOWLEDGE_BASE];

  if (params.success) {
    if (params.data.sector) {
      schemes = schemes.filter((s) =>
        s.sector.toLowerCase().includes(params.data.sector!.toLowerCase())
      );
    }
    if (params.data.ministry) {
      schemes = schemes.filter((s) =>
        s.ministry.toLowerCase().includes(params.data.ministry!.toLowerCase())
      );
    }
  }

  res.json({
    schemes: schemes.map((s) => ({
      id: s.id,
      name: s.schemeName,
      sector: s.sector,
      ministry: s.ministry,
      description: s.description.slice(0, 180) + "...",
      tags: s.tags,
    })),
    total: schemes.length,
  });
});

router.get("/stats", (_req: Request, res: Response): void => {
  res.json({
    totalSchemes: POLICY_KNOWLEDGE_BASE.length,
    sectors: SECTORS,
    ministries: MINISTRIES,
    totalChunks: POLICY_KNOWLEDGE_BASE.length,
    lastUpdated: new Date().toISOString(),
  });
});

router.use("/verify", verifyRouter);
router.use("/impact", impactRouter);
router.use("/analytics", analyticsRouter);

export default router;
