# ASIVANTA LLM Router

Last updated: 2026-07-22

`api/ai/router.js` routes chat requests across multiple LLM providers with
per-provider timeouts and a failure-cooldown circuit breaker. `api/ai/chat.js`
uses it; the keyword fallback in `chat.js` remains the final safety net, so
the chat widget always answers even with every provider down.

## Task-based routing

Each message is classified as `simple` (everyday questions) or `coding`
(mentions code, bugs, programming languages, etc.), and each intent has its
own provider chain:

- **simple** (default `grok,bridge,anthropic,openai`): Grok 4.5 first for
  everyday questions, local Gemma bridge as free backup.
- **coding** (default `anthropic,openai,grok,bridge`): Claude (Opus 4.8)
  first, Codex (GPT-5.6) as backup if Claude fails or is unavailable.

Only providers with an API key configured are attempted; the rest are
skipped. OpenRouter exists as a provider but is **not** in either default
chain — add it to `LLM_ROUTE_*` yourself if you ever want it.

## Providers

| Name         | Configured when                           | Env vars                                                                                                            |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `grok`       | `XAI_API_KEY` (or `GROK_API_KEY`) set     | `XAI_API_KEY`, `XAI_MODEL` (default `grok-4.5` — note the dot), `XAI_BASE_URL`                                      |
| `anthropic`  | `ANTHROPIC_API_KEY` set                   | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (default `claude-opus-4-8`)                                                  |
| `openai`     | `OPENAI_API_KEY` set                      | `OPENAI_API_KEY`, `OPENAI_MODEL` (default `gpt-5.6` = Codex 5.6 top tier), `OPENAI_BASE_URL`                        |
| `bridge`     | Always (unless `AI_BRIDGE_ALLOW_LOCAL=0`) | `AI_BRIDGE_URL` (or `OPENCLAW_URL`), `AI_BRIDGE_TOKEN`, `AI_BRIDGE_MODEL`                                           |
| `openrouter` | `OPENROUTER_API_KEY` set                  | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (default `openrouter/auto`), `OPENROUTER_SITE_URL`, `OPENROUTER_SITE_NAME` |

GPT-5.6 model ids: `gpt-5.6` (alias for `gpt-5.6-sol`, most capable),
`gpt-5.6-terra` (everyday workhorse), `gpt-5.6-luna` (cheapest).

## Routing env vars

- `LLM_ROUTE_SIMPLE` — chain for everyday questions. Default: `grok,bridge,anthropic,openai`.
- `LLM_ROUTE_CODING` — chain for coding questions. Default: `anthropic,openai,grok,bridge`.
- `LLM_ROUTE` — if set, overrides both chains with one fixed order.
- `LLM_TIMEOUT_MS` — per-provider request timeout. Default: `30000`.
- Circuit breaker: 2 consecutive failures put a provider on a 60s cooldown
  (state is per warm serverless instance).
- A provider that is unconfigured, cooling down, errors, times out, or returns
  an empty answer is skipped and the next one is tried.

## Endpoints

- `POST /api/ai/chat` — unchanged contract; the response includes `source`
  (winning provider name or `fallback`) and `model`.
- `GET /api/ai/llm-status` — both chains (`simple` and `coding`) with
  `configured`/`cooling` booleans per provider. No secrets exposed.

## Notes

- The assistant personality (`api/ai/asivanta-assistant.md`) is included in
  the system guide for every provider, including the bridge.
- The PupCare-leak guard in `chat.js` still rejects any routed answer that
  mentions PupCare topics and serves the keyword fallback instead.
