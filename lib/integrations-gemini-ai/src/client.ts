import { GoogleGenAI } from "@google/genai";

// Uses Google Gemini API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not configured. AI features will fail until added.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "DUMMY_KEY" });

/**
 * Executes a Gemini AI call with automatic retries on rate limit (429) errors.
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: any;
  for (let i = 0; i < 5; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error.status || error.response?.status;
      if (status === 429 || status === 500 || status === 503) {
        const delay = Math.pow(3, i) * 2000 + Math.random() * 2000;
        console.warn(`Gemini AI call failed (attempt ${i + 1}), retrying in ${Math.round(delay)}ms: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

