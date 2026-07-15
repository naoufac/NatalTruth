/**
 * OpenRouter chat — Qwen3.5-122B-A10B via OpenRouter.
 * Key: process.env.OPENROUTER_API_KEY or process.env.OPENROUTER
 */

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "qwen/qwen3.5-122b-a10b";

export const OPENROUTER_BASE =
  process.env.OPENROUTER_BASE || "https://openrouter.ai/api/v1";

export type ChatTurn = { role: "system" | "user" | "assistant"; content: string };

export type ChatSession = {
  id: string;
  messages: ChatTurn[];
  updatedAt: string;
};

/** In-process session store (no DB yet). Survives only while the Node process lives. */
const sessions = new Map<string, ChatSession>();

export function getApiKey(): string | null {
  const k =
    process.env.OPENROUTER_API_KEY?.trim() ||
    process.env.OPENROUTER?.trim() ||
    "";
  return k || null;
}

export function listSessions(): { session_id: string; updatedAt: string; preview: string }[] {
  return [...sessions.values()]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((s) => {
      const lastUser = [...s.messages].reverse().find((m) => m.role === "user");
      return {
        session_id: s.id,
        updatedAt: s.updatedAt,
        preview: (lastUser?.content || "").slice(0, 80),
      };
    });
}

export function getSession(id: string): ChatSession | null {
  return sessions.get(id) || null;
}

export function deleteSession(id: string): boolean {
  return sessions.delete(id);
}

function newSessionId(): string {
  return `nt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const SYSTEM_PROMPT = `You are NatalTruth, a precise natal astrology and multi-system name-numerology assistant.
- Be accurate, useful, and honest. Do not invent planetary positions.
- When the user has supplied chart or name data in context, ground answers in that data.
- Prefer clear structure. No fake certainty. If data is missing, say so.
- Brand: NatalTruth (not any other product name).`;

export async function chatCompletion(opts: {
  message: string;
  sessionId?: string | null;
  context?: string | null;
}): Promise<{ session_id: string; response: string; model: string }> {
  const key = getApiKey();
  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY not configured on server (set env OPENROUTER_API_KEY or OPENROUTER)"
    );
  }

  const message = opts.message?.trim();
  if (!message) throw new Error("message is required");

  let session = opts.sessionId ? sessions.get(opts.sessionId) : undefined;
  if (!session) {
    session = {
      id: newSessionId(),
      messages: [{ role: "system", content: SYSTEM_PROMPT }],
      updatedAt: new Date().toISOString(),
    };
    if (opts.context?.trim()) {
      session.messages.push({
        role: "system",
        content: `User birth/chart context:\n${opts.context.trim()}`,
      });
    }
    sessions.set(session.id, session);
  }

  session.messages.push({ role: "user", content: message });

  const body = {
    model: OPENROUTER_MODEL,
    messages: session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    temperature: 0.7,
  };

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://nataltruth.com",
      "X-Title": "NatalTruth",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let data: {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`OpenRouter non-JSON (${res.status}): ${raw.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(
      data?.error?.message || `OpenRouter HTTP ${res.status}: ${raw.slice(0, 200)}`
    );
  }

  const reply =
    data.choices?.[0]?.message?.content?.trim() ||
    "(empty model response)";

  session.messages.push({ role: "assistant", content: reply });
  session.updatedAt = new Date().toISOString();
  sessions.set(session.id, session);

  return {
    session_id: session.id,
    response: reply,
    model: OPENROUTER_MODEL,
  };
}
