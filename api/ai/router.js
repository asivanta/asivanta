// Task-based routing: everyday questions go to Grok first, coding questions
// go to Claude first with Codex (OpenAI) as backup. Bridge (local Gemma) and
// the rest of the chain are free fallbacks so the chat always answers.
const DEFAULT_ROUTE_SIMPLE = "grok,bridge,anthropic,openai";
const DEFAULT_ROUTE_CODING = "anthropic,openai,grok,bridge";
const DEFAULT_TIMEOUT_MS = 30000;
const BREAKER_FAILURE_THRESHOLD = 2;
const BREAKER_COOLDOWN_MS = 60000;

// Per-warm-instance breaker state; resets on cold start, which is acceptable.
const breaker = new Map();

function breakerState(name) {
  if (!breaker.has(name)) {
    breaker.set(name, { failures: 0, openedAt: 0 });
  }
  return breaker.get(name);
}

function isOpen(name) {
  const state = breakerState(name);
  if (state.failures < BREAKER_FAILURE_THRESHOLD) return false;
  if (Date.now() - state.openedAt >= BREAKER_COOLDOWN_MS) {
    state.failures = 0;
    return false;
  }
  return true;
}

function recordFailure(name) {
  const state = breakerState(name);
  state.failures += 1;
  if (state.failures >= BREAKER_FAILURE_THRESHOLD) {
    state.openedAt = Date.now();
  }
}

function recordSuccess(name) {
  breakerState(name).failures = 0;
}

function timeoutMs() {
  const value = Number(process.env.LLM_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS;
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs());
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function toChatMessages(history, message) {
  const messages = history
    .filter((item) => item && item.text)
    .map((item) => ({
      role: item.role === "user" ? "user" : "assistant",
      content: String(item.text).slice(0, 400),
    }));
  messages.push({ role: "user", content: message });
  return messages;
}

async function callOpenAICompatible(
  { base, key, model, extraHeaders },
  { message, system, history },
) {
  const response = await fetchWithTimeout(
    `${base.replace(/\/$/, "")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        ...extraHeaders,
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        messages: [
          { role: "system", content: system },
          ...toChatMessages(history, message),
        ],
      }),
    },
  );
  if (!response.ok) throw new Error(`${response.status}`);
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

const CODING_PATTERN =
  /```|\b(code|coding|program|programming|bug|debug|error message|stack trace|function|script|python|javascript|typescript|java\b|c\+\+|c#|sql|regex|json|html|css|react|node|npm|pnpm|git|github|api endpoint|compile|deploy|refactor|unit test)\b/i;

export function detectIntent(message) {
  return CODING_PATTERN.test(String(message || "")) ? "coding" : "simple";
}

const providers = {
  bridge: {
    configured: () =>
      Boolean(
        process.env.AI_BRIDGE_URL ||
        process.env.OPENCLAW_URL ||
        process.env.AI_BRIDGE_ALLOW_LOCAL !== "0",
      ),
    model: () => process.env.AI_BRIDGE_MODEL || "gemma-bridge",
    async call({ message, system, history }) {
      const url =
        process.env.AI_BRIDGE_URL ||
        process.env.OPENCLAW_URL ||
        "http://127.0.0.1:8787/chat";
      const token =
        process.env.AI_BRIDGE_TOKEN || process.env.OPENCLAW_API_KEY || "";
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, systemGuide: system, history }),
      });
      if (!response.ok) throw new Error(`bridge ${response.status}`);
      const data = await response.json();
      return (
        data?.answer ||
        data?.response ||
        data?.message ||
        data?.content ||
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        ""
      );
    },
  },

  grok: {
    configured: () =>
      Boolean(process.env.XAI_API_KEY || process.env.GROK_API_KEY),
    // Note: the id needs the dot — "grok-4.5", not "grok-4-5".
    model: () => process.env.XAI_MODEL || "grok-4.5",
    call: (input) =>
      callOpenAICompatible(
        {
          base: process.env.XAI_BASE_URL || "https://api.x.ai/v1",
          key: process.env.XAI_API_KEY || process.env.GROK_API_KEY,
          model: providers.grok.model(),
        },
        input,
      ),
  },

  openrouter: {
    configured: () => Boolean(process.env.OPENROUTER_API_KEY),
    model: () => process.env.OPENROUTER_MODEL || "openrouter/auto",
    call: (input) =>
      callOpenAICompatible(
        {
          base:
            process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
          key: process.env.OPENROUTER_API_KEY,
          model: providers.openrouter.model(),
          extraHeaders: {
            "HTTP-Referer":
              process.env.OPENROUTER_SITE_URL || "https://asivanta.com",
            "X-Title": process.env.OPENROUTER_SITE_NAME || "ASIVANTA",
          },
        },
        input,
      ),
  },

  openai: {
    configured: () => Boolean(process.env.OPENAI_API_KEY),
    // "gpt-5.6" is the alias for the top GPT-5.6 (Codex) tier.
    model: () => process.env.OPENAI_MODEL || "gpt-5.6",
    call: (input) =>
      callOpenAICompatible(
        {
          base: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
          key: process.env.OPENAI_API_KEY,
          model: providers.openai.model(),
        },
        input,
      ),
  },

  anthropic: {
    configured: () => Boolean(process.env.ANTHROPIC_API_KEY),
    model: () => process.env.ANTHROPIC_MODEL || "claude-opus-4-8",
    async call({ message, system, history }) {
      const response = await fetchWithTimeout(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: providers.anthropic.model(),
            max_tokens: 400,
            system,
            messages: toChatMessages(history, message),
          }),
        },
      );
      if (!response.ok) throw new Error(`anthropic ${response.status}`);
      const data = await response.json();
      return data?.content?.[0]?.text || "";
    },
  },
};

function routeOrder(intent) {
  const route =
    process.env.LLM_ROUTE ||
    (intent === "coding"
      ? process.env.LLM_ROUTE_CODING || DEFAULT_ROUTE_CODING
      : process.env.LLM_ROUTE_SIMPLE || DEFAULT_ROUTE_SIMPLE);
  return route
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name) => providers[name]);
}

export function routerStatus() {
  const chain = (intent) =>
    routeOrder(intent).map((name) => ({
      provider: name,
      model: providers[name].model(),
      configured: providers[name].configured(),
      cooling: isOpen(name),
    }));
  return { simple: chain("simple"), coding: chain("coding") };
}

export async function routeChat({ message, system, history = [] }) {
  const intent = detectIntent(message);
  const attempts = [];
  for (const name of routeOrder(intent)) {
    const provider = providers[name];
    if (!provider.configured() || isOpen(name)) {
      attempts.push({ provider: name, skipped: true });
      continue;
    }
    try {
      const text = String(
        (await provider.call({ message, system, history })) || "",
      )
        .replace(/[<>]/g, "")
        .trim();
      if (!text) throw new Error(`${name} empty answer`);
      recordSuccess(name);
      return {
        text,
        provider: name,
        model: provider.model(),
        intent,
        attempts,
      };
    } catch (error) {
      recordFailure(name);
      attempts.push({ provider: name, error: String(error?.message || error) });
    }
  }
  return { text: null, provider: null, model: null, intent, attempts };
}
