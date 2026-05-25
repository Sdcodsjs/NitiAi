import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";

const app: Express = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ── CORS: allow local dev + any Vercel deployment ───────────────────────────
const allowedOrigins: (string | RegExp)[] = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  // Vercel production & preview deployments
  /\.vercel\.app$/,
];
// Also allow the specific VERCEL_URL if set (e.g. custom domain via env var)
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, same-origin on Vercel)
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );
      callback(allowed ? null : new Error("CORS: origin not allowed"), allowed);
    },
    credentials: true,
  })
);

// ── Body parsing with size limits (prevent DoS) ──────────────────────────────
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use("/api", router);

const frontendDist = path.join(__dirname, "../../../dist");
app.use(express.static(frontendDist));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
