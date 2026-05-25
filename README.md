# NitiAI — Indian Government Policy Intelligence

<p align="center">
  <strong>AI-powered assistant that helps Indian citizens understand, compare, and navigate government schemes in their own language.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Gemini-AI-blue?logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## What is NitiAI?

NitiAI is a full-stack RAG (Retrieval-Augmented Generation) policy intelligence platform. Citizens can ask questions in natural language — in English, Hindi, Kannada, Tamil, Telugu, or Marathi — and receive grounded, structured answers backed by a curated knowledge base of 13 major Indian Government schemes. The AI never fabricates information; every response is sourced from the knowledge base with a confidence score.

---

## Features

| Feature | Description |
|---|---|
| 🤖 **Policy Consultation** | Multi-turn AI chat with conversational memory. Ask follow-up questions; the AI keeps full context. |
| 📋 **Browse Schemes** | Explore all 13 government schemes with keyword search and sector filters. |
| ⚖️ **Policy Comparison** | Compare 2–3 schemes side-by-side across eligibility, benefits, and application process. |
| 💡 **Personalised Recommendations** | Describe your profile and get ranked, AI-matched scheme suggestions. |
| ✅ **Fact Check / Claim Verify** | Paste any policy claim and verify it against the knowledge base (TRUE / FALSE / PARTIALLY_TRUE). |
| ⚡ **Impact Simulator** | Enter your details and simulate the financial impact of applicable schemes. |
| 🔖 **My Policies** | Save and export consultations as text files (persisted in browser localStorage). |
| 📊 **Analytics Dashboard** | Usage statistics, trending queries, sector distribution charts. |
| 🔍 **System Audit** | Real-time transparency view of RAG pipeline health and confidence scoring. |
| 🌐 **Multilingual** | Supports English, Hindi, Kannada, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, shadcn/ui, wouter, React Query |
| **Backend** | Express 5, TypeScript, Node.js 24 |
| **AI** | Google Gemini (`gemini-flash-lite-latest`) via `@google/genai` |
| **RAG Engine** | In-memory keyword scoring over 13 scheme knowledge chunks |
| **Database** | PostgreSQL + Drizzle ORM |
| **Monorepo** | pnpm workspaces |
| **Deployment** | Vercel (static frontend + serverless API function) |

---

## Project Structure

```
nitiai/
├── api/
│   └── index.ts                  # Vercel serverless function entry point
├── artifacts/
│   ├── api-server/               # Express 5 backend
│   │   └── src/
│   │       ├── app.ts            # Express app (CORS, security headers, routing)
│   │       ├── routes/           # /api/policy/* endpoints
│   │       └── data/policies.ts  # 13-scheme knowledge base
│   └── policybot/                # React + Vite frontend
│       └── src/
│           ├── pages/            # Consultation, Schemes, Compare, Verify…
│           └── components/       # Layout, UI components (shadcn)
├── lib/
│   ├── integrations-gemini-ai/   # Gemini AI client with retry logic
│   ├── api-spec/                 # OpenAPI 3.1 spec
│   ├── api-zod/                  # Generated Zod schemas
│   ├── api-client-react/         # Generated React Query hooks
│   └── db/                       # Drizzle ORM schema & migrations
├── vercel.json                   # Vercel deployment configuration
├── pnpm-workspace.yaml           # pnpm workspace + security settings
└── .env.example                  # Required environment variables
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/policy/query` | RAG consultation with Gemini (supports multi-turn `history`) |
| `POST` | `/api/policy/compare` | Side-by-side scheme comparison |
| `POST` | `/api/policy/recommend` | Personalised scheme recommendations |
| `POST` | `/api/policy/verify` | Claim fact-checking |
| `POST` | `/api/policy/impact` | Policy impact simulation |
| `GET` | `/api/policy/schemes` | Browse all schemes (with sector/ministry filters) |
| `GET` | `/api/policy/stats` | Knowledge base statistics |
| `GET` | `/api/policy/analytics` | Usage analytics |

---

## Government Schemes Knowledge Base

| Scheme | Sector | Ministry |
|---|---|---|
| PM-KISAN | Agriculture | Ministry of Agriculture & Farmers Welfare |
| PM Fasal Bima Yojana (PMFBY) | Agriculture | Ministry of Agriculture |
| Kisan Credit Card | Agriculture / Finance | Multiple |
| Ayushman Bharat PM-JAY | Health | Ministry of Health |
| PM Awas Yojana – Urban | Housing | Ministry of Housing |
| PM Awas Yojana – Rural (PMAY-G) | Housing | Ministry of Rural Development |
| National Scholarship Portal | Education | Ministry of Education |
| PM MUDRA Yojana | Entrepreneurship | Ministry of Finance |
| Startup India | Entrepreneurship | DPIIT |
| Atal Pension Yojana | Social Security | Ministry of Finance |
| PM Suraksha Bima Yojana | Insurance | Ministry of Finance |
| Beti Bachao Beti Padhao | Women & Child | Ministry of WCD |
| Mahatma Gandhi NREGS | Rural Employment | Ministry of Rural Development |

---

## Local Development

### Prerequisites

- Node.js 24+
- pnpm 9+
- PostgreSQL database (or a free cloud one — see below)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/nitiai.git
cd nitiai

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your values (see Environment Variables section)

# 4. Push database schema
pnpm --filter @workspace/db run push

# 5. Start the API server (port 8080)
pnpm --filter @workspace/api-server run dev

# 6. Start the frontend (port 5173, proxies /api to 8080)
pnpm --filter @workspace/policybot run dev
```

Open **http://localhost:8080** to use the app (API + built frontend served together).

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description | Where to get it |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres) |
| `GEMINI_API_KEY` | Google Generative AI key | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `SESSION_SECRET` | Random 32-char string | Run: `openssl rand -hex 32` |

---

## Deploy to Vercel

### One-click setup

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects `vercel.json` — no extra framework settings needed.
4. Add the three environment variables in **Project → Settings → Environment Variables**.
5. Click **Deploy**.

### How Vercel wires it together

```
vercel.json
├── buildCommand  →  pnpm --filter @workspace/policybot run build
├── outputDirectory → artifacts/policybot/dist/public  (static frontend)
├── api/index.ts  →  Vercel Serverless Function (wraps Express app)
└── rewrites
    ├── /api/*  →  /api/index  (all API routes)
    └── /*      →  /index.html (SPA client-side routing)
```

### After first deploy — run DB migration

```bash
DATABASE_URL="your-prod-db-url" pnpm --filter @workspace/db run push
```

---

## Conversational Memory

Each `/api/policy/query` call accepts an optional `history` array for multi-turn dialogue:

```json
{
  "query": "What is the application deadline?",
  "language": "en",
  "persona": "Farmer",
  "history": [
    { "role": "user", "content": "Tell me about PM-KISAN" },
    { "role": "assistant", "content": "PM-KISAN provides ₹6,000 per year..." }
  ]
}
```

The frontend maintains the full conversation state and sends it with each request. The backend passes it as multi-turn `contents` to Gemini.

---

## Security

- CORS restricted to known origins only
- All inputs validated with Zod before processing
- JSON body size limited to 50 KB (DoS protection)
- Query length capped at 1,000 characters
- Security headers on every response (`X-Frame-Options`, `X-Content-Type-Options`, etc.)
- `pnpm` supply-chain protection: packages must be 24 h old before install
- `.env` is git-ignored — secrets never committed

---

## License

MIT
