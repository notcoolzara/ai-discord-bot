// src/llm.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const LLM_API_URL = process.env.LLM_API_URL;
const LLM_MODEL = process.env.LLM_MODEL || "local-model";

if (!LLM_API_URL) {
  console.warn("[LLM] Warning: LLM_API_URL is not set. Configure it in .env.");
}

async function callLLM({ systemPrompt, history, userMessage }) {
  if (!LLM_API_URL) {
    throw new Error("LLM_API_URL is not configured.");
  }

  const messages = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  // history is an array of { role, content }
  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history) {
      messages.push(msg);
    }
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  const body = {
    model: LLM_MODEL,
    messages,
    // Adjust these if your local server supports them
    temperature: 0.3,
    max_tokens: 512,
  };

  const res = await fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // No Authorization header needed for local / free models
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`LLM error: HTTP ${res.status} - ${txt}`);
  }

  const data = await res.json();
  const answer =
    data.choices?.[0]?.message?.content?.trim() ||
    "I could not generate a response.";

  return answer;
}

module.exports = {
  callLLM,
};
