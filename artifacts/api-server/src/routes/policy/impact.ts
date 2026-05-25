import { Router, type Request, type Response } from "express";
import { ai, withRetry } from "@workspace/integrations-gemini-ai";
import { POLICY_KNOWLEDGE_BASE, searchPolicies } from "../../data/policies";
import { z } from "@workspace/api-zod";

const router = Router();

// ── Input validation schema ──────────────────────────────────────────────────
const ImpactBody = z.object({
  annualIncome: z.string().min(1).max(20),
  landHolding:  z.string().max(20).optional(),
  category:     z.string().min(1).max(50),
  state:        z.string().max(50).optional(),
  occupation:   z.string().min(1).max(100),
  age:          z.string().max(10).optional(),
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = ImpactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.errors[0]?.message ?? "Invalid input" });
    return;
  }

  const { annualIncome, landHolding, category, state, occupation, age } = parsed.data;

  const profileQuery = [occupation, category, state ?? ""].join(" ").trim();
  const relevantPolicies = searchPolicies(profileQuery, 8);
  void relevantPolicies; // used for context enrichment; full list sent to LLM below

  const allSchemes = POLICY_KNOWLEDGE_BASE.map(p => ({
    name: p.schemeName,
    sector: p.sector,
    eligibility: p.eligibility,
    benefits: p.benefits,
    source: p.source,
  }));

  const prompt = `You are a government policy eligibility analyst. Based on this user profile, determine which schemes they qualify for and estimate their financial benefit.

USER PROFILE:
- Annual Income: Rs. ${annualIncome}
- Land Holding: ${landHolding || "0"} acres
- Social Category: ${category}
- State: ${state || "Not specified"}
- Occupation: ${occupation}
- Age: ${age || "Not specified"}

AVAILABLE SCHEMES (check each carefully):
${allSchemes.map(s => `${s.name} (${s.sector}): ${s.eligibility} | Benefits: ${s.benefits}`).join("\n\n")}

Respond with JSON:
{
  "eligibleSchemes": [
    {
      "name": "scheme name",
      "sector": "sector",
      "reason": "why this person qualifies based on their profile",
      "estimatedBenefit": "e.g. Rs. 6,000/year or Rs. 5 lakh coverage",
      "matchScore": 0-1,
      "actionRequired": "what they need to do to apply"
    }
  ],
  "totalEstimatedBenefit": "sum or range of all estimated annual benefits e.g. Rs. 12,000 - 18,000/year",
  "confidenceScore": 0-1
}

Only include schemes the user genuinely qualifies for. Sort by matchScore descending.
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
      result = { eligibleSchemes: [], confidenceScore: 0.5 };
    }

    res.json({
      eligibleSchemes: result.eligibleSchemes ?? [],
      totalEstimatedBenefit: result.totalEstimatedBenefit ?? null,
      confidenceScore: result.confidenceScore ?? 0.7,
    });
  } catch (err) {
    req.log.error({ err }, "Impact simulation error");
    res.status(500).json({ error: "server_error", message: "Impact simulation failed" });
  }
});

export default router;
