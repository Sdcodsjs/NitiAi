const { GoogleGenAI } = require("./node_modules/.pnpm/@google+genai@1.51.0/node_modules/@google/genai/dist/index.cjs");

const KEY = "AIzaSyC-sxYezCwDJxlLKJprgZSC3RsjpRI-X5I";
const ai = new GoogleGenAI({ apiKey: KEY });

const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash-8b"];

(async () => {
  for (const model of models) {
    try {
      const r = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: 'Reply ONLY with JSON: {"ok": true}' }] }],
        config: { responseMimeType: "application/json", maxOutputTokens: 20 },
      });
      console.log(`✅ ${model}: ${r.text?.trim()}`);
      break;
    } catch (e) {
      const code = e.message?.match(/"code":(\d+)/)?.[1] ?? "?";
      console.log(`❌ ${model}: error ${code}`);
    }
  }
})();
