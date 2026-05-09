import fs from "fs";
import path from "path";

const MAX_MESSAGE_LENGTH = 700;
const MAX_HISTORY_ITEMS = 6;
const BRIDGE_TIMEOUT_MS = 5500;

const siteLinks = {
  home: { label: "Home", href: "/" },
  services: { label: "Services", href: "/#services" },
  methodology: { label: "How It Works", href: "/#how-it-works" },
  industries: { label: "Industries", href: "/#industries" },
  contact: { label: "Sourcing Review", href: "/contact" },
  quote: { label: "Quote Now", href: "/instant-quote" },
  insights: { label: "Insights", href: "/insights" },
  about: { label: "About ASIVANTA", href: "/about" },
  portal: { label: "Client Portal", href: "/portal" },
  login: { label: "Portal Login", href: "/login" },
  privacy: { label: "Privacy", href: "/privacy" },
  terms: { label: "Terms", href: "/terms" },
};

const siteMap = [
  "Home /: ASIVANTA overview, Seoul-based Korea sourcing, services, methodology, industries.",
  "Services /#services: supplier sourcing, verification, negotiation, factory readiness, quote comparison, market communication.",
  "Contact /contact: sourcing review intake for advisory help.",
  "Quote Now /instant-quote: guided Sunny-style component builder, BOM/RFQ/spec upload, or manual part list for quote review.",
  "Insights /insights: articles on Korean supplier verification, commercial terms, and risk reduction.",
  "About /about: ASIVANTA background, buyer-side model, Seoul presence, no hidden supplier commissions.",
  "Portal /portal and /login: client sourcing dashboard and access.",
  "Privacy /privacy and Terms /terms: legal pages.",
];

function readPersonality() {
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "api/ai/asivanta-assistant.md"),
      "utf8",
    );
  } catch {
    return "ASIVANTA assistant. Be concise, professional, and guide visitors to the right ASIVANTA page.";
  }
}

function sanitize(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim();
}

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function isPupCareLeak(text) {
  return /pupcare|pet|dog|cat|veterinary|grooming|walking/i.test(text);
}

function keywordFallback(message, pathName = "") {
  const text = `${message} ${pathName}`.toLowerCase();

  if (/quote|rfq|bom|price|pricing|part|spec|upload|drawing/.test(text)) {
    return {
      answer:
        "For a quote or RFQ, use Quote Now. Start with the guided component builder, upload a BOM/RFQ/spec sheet, or build a part list directly on the page.",
      links: [siteLinks.quote],
    };
  }

  if (
    /supplier|source|sourcing|manufacturer|factory|verify|verification|due diligence|audit/.test(
      text,
    )
  ) {
    return {
      answer:
        "For supplier sourcing or verification, start with a sourcing review. ASIVANTA can help define requirements, identify Korean manufacturers, and reduce risk before payments, tooling, deposits, or purchase orders.",
      links: [siteLinks.contact, siteLinks.services],
    };
  }

  if (
    /service|capability|do you do|help with|negotiate|negotiation|lead time|moq|terms/.test(
      text,
    )
  ) {
    return {
      answer:
        "ASIVANTA supports supplier sourcing, manufacturer verification, quote comparison, pricing and term negotiation, factory readiness review, and managed sourcing communication.",
      links: [siteLinks.services, siteLinks.contact],
    };
  }

  if (/portal|login|dashboard|client|document|order|rfq status/.test(text)) {
    return {
      answer:
        "For client project access, use the Client Portal or Portal Login. If you do not have access yet, contact ASIVANTA so the team can help.",
      links: [siteLinks.portal, siteLinks.login, siteLinks.contact],
    };
  }

  if (
    /about|who|company|commission|trading|broker|reseller|where|seoul/.test(
      text,
    )
  ) {
    return {
      answer:
        "ASIVANTA is a Seoul-based procurement advisory firm working on the buyer side. The firm is not a trading company and does not position itself around hidden supplier markups or commissions.",
      links: [siteLinks.about, siteLinks.contact],
    };
  }

  if (/insight|article|learn|guide|risk|korea/.test(text)) {
    return {
      answer:
        "The Insights page has practical articles on Korean supplier verification, commercial terms, and sourcing risk reduction.",
      links: [siteLinks.insights],
    };
  }

  return {
    answer:
      "I can help you find the right ASIVANTA path for Korea sourcing, supplier verification, quote comparison, factory readiness, or client portal access. For an RFQ, use Quote Now; for advisory help, start a sourcing review.",
    links: [siteLinks.quote, siteLinks.contact, siteLinks.services],
  };
}

function buildPrompt({ message, pagePath, pageTitle, history }) {
  return `${readPersonality()}

Current page: ${pagePath || "/"}
Page title: ${pageTitle || "ASIVANTA"}

Site map:
${siteMap.map((item) => `- ${item}`).join("\n")}

Recent conversation:
${history
  .slice(-MAX_HISTORY_ITEMS)
  .map((item) => `${item.role}: ${sanitize(item.text).slice(0, 400)}`)
  .join("\n")}

Visitor question:
${message}

Return only the answer text. Keep it concise and include the best path as plain text if useful.`;
}

async function callBridge(payload) {
  const bridgeUrl =
    process.env.AI_BRIDGE_URL ||
    process.env.OPENCLAW_URL ||
    "http://127.0.0.1:8787/chat";
  const token =
    process.env.AI_BRIDGE_TOKEN || process.env.OPENCLAW_API_KEY || "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BRIDGE_TIMEOUT_MS);
  try {
    const response = await fetch(bridgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const data = await response.json().catch(() => null);
    const answer =
      data?.answer ||
      data?.response ||
      data?.message ||
      data?.content ||
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "";
    return sanitize(answer);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function linksForAnswer(answer, fallbackLinks) {
  const lower = answer.toLowerCase();
  const links = [];
  if (/quote now|instant quote|rfq|quote|bom/.test(lower))
    links.push(siteLinks.quote);
  if (/contact|sourcing review|advisory|supplier|verification/.test(lower))
    links.push(siteLinks.contact);
  if (/service|capabilit/.test(lower)) links.push(siteLinks.services);
  if (/insight|article/.test(lower)) links.push(siteLinks.insights);
  if (/about|seoul|buyer-side|trading company/.test(lower))
    links.push(siteLinks.about);
  if (/portal|login|dashboard/.test(lower)) links.push(siteLinks.login);

  const merged = [...links, ...(fallbackLinks || [])];
  return merged
    .filter(
      (link, index, all) =>
        all.findIndex((item) => item.href === link.href) === index,
    )
    .slice(0, 3);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = parseBody(req);
  const message = sanitize(body.message).slice(0, MAX_MESSAGE_LENGTH);
  const pagePath = sanitize(body.path).slice(0, 160);
  const pageTitle = sanitize(body.title).slice(0, 120);
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const fallback = keywordFallback(message, pagePath);
  const prompt = buildPrompt({ message, pagePath, pageTitle, history });
  const bridgeAnswer = await callBridge({
    message,
    prompt,
    system: readPersonality(),
    pagePath,
    siteMap,
    history: history.slice(-MAX_HISTORY_ITEMS),
  });

  const safeAnswer =
    bridgeAnswer && !isPupCareLeak(bridgeAnswer)
      ? bridgeAnswer
      : fallback.answer;

  return res.status(200).json({
    answer: safeAnswer,
    links: linksForAnswer(safeAnswer, fallback.links),
    fallback: !bridgeAnswer || isPupCareLeak(bridgeAnswer),
  });
}
