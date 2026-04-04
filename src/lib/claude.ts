import Anthropic from "@anthropic-ai/sdk";

// ─── MattDESIGN.AI — Claude Client ───────────────────────────────────────────
// Singleton client. Returns null when ANTHROPIC_API_KEY is absent
// so agents gracefully fall back to mock data in dev.

let _client: Anthropic | null = null;

export const MODEL = "claude-sonnet-4-6";

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

/**
 * Call Claude with a structured system + user prompt.
 * Returns the text response, or null when no API key is set.
 */
export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096,
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return null;
  return content.text;
}

/**
 * Parse JSON from a Claude response.
 * Strips markdown code fences if present.
 * Returns `fallback` if parsing fails.
 */
export function parseJSON<T>(raw: string, fallback: T): T {
  try {
    const stripped = raw
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "")
      .trim();
    return JSON.parse(stripped) as T;
  } catch {
    try {
      const match = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (match) return JSON.parse(match[1]) as T;
    } catch {}
    return fallback;
  }
}

/** Whether the Claude client is configured */
export function hasClaudeKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
