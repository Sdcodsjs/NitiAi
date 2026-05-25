import { Router, type Request, type Response } from "express";
import { POLICY_KNOWLEDGE_BASE, SECTORS } from "../../data/policies";

const router = Router();

router.get("/", (_req: Request, res: Response): void => {
  const sectorBreakdown = SECTORS.map((sector) => ({
    sector: sector.charAt(0).toUpperCase() + sector.slice(1),
    count: POLICY_KNOWLEDGE_BASE.filter((p) => p.sector === sector).length,
  })).sort((a, b) => b.count - a.count);

  const trendingQueries = [
    { query: "PM-Kisan eligibility", count: 142 },
    { query: "Ayushman Bharat coverage", count: 118 },
    { query: "Housing scheme rural", count: 97 },
    { query: "Student scholarships", count: 84 },
    { query: "MUDRA loan for business", count: 76 },
    { query: "Crop insurance farmer", count: 63 },
    { query: "Pension scheme unorganised", count: 58 },
  ];

  const latencyMetrics = [
    { stage: "Retrieval", ms: 12 },
    { stage: "Embedding", ms: 45 },
    { stage: "LLM Gen", ms: 980 },
    { stage: "Post-proc", ms: 8 },
    { stage: "Network", ms: 22 },
  ];

  const retrieval = [
    { name: "Context Relevance", value: 87, description: "Retrieved chunks match user query intent" },
    { name: "Grounding Score", value: 94, description: "Answers based on retrieved context only" },
    { name: "Citation Accuracy", value: 91, description: "Cited text exists verbatim in source docs" },
  ];

  res.json({
    totalQueries: 1247,
    avgResponseMs: 1067,
    sectorBreakdown,
    trendingQueries,
    latencyMetrics,
    retrieval,
  });
});

export default router;
