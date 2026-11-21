// check-models.js
(async () => {
  const fs = await import("node:fs");
  const { GoogleGenAI } = await import("@google/genai");

  // .env.local ya .env se GEMINI_API_KEY automatically read karega
  let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    for (const file of [".env.local", ".env"]) {
      if (fs.existsSync(file)) {
        const match = fs
          .readFileSync(file, "utf8")
          .match(/^(?:GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*["']?([^"'\r\n]+)["']?/m);
        if (match) {
          apiKey = match[1].trim();
          break;
        }
      }
    }
  }

  if (!apiKey) {
    console.error("Error: .env.local ya .env me GEMINI_API_KEY nahi mili.");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  const pager = await ai.models.list();

  console.log("Aapki API key par active Gemini models:\n");
  for await (const model of pager) {
    const cleanName = model.name?.replace(/^models\//, "");
    if (cleanName?.includes("gemini")) {
      console.log(`- ${cleanName}`);
    }
  }
})();