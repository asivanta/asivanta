import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, (m) => m.slice(1));
const appRoot = join(root, "artifacts", "asivanta");
const source = (...parts) => readFileSync(join(appRoot, ...parts), "utf8");

const publicFiles = [
  "src/App.tsx",
  "src/components/layout/navbar.tsx",
  "src/components/layout/footer.tsx",
  "src/pages/home.tsx",
  "src/pages/about.tsx",
  "src/pages/report.tsx",
  "src/pages/trust-assurance.tsx",
  "src/pages/insights.tsx",
  "src/pages/contact.tsx",
  "src/pages/privacy.tsx",
  "src/pages/terms.tsx",
  "src/lib/page-meta.tsx",
  "index.html",
];

const publicCopy = () => publicFiles.map((file) => source(file)).join("\n");

test("public routes expose the advisory site and no mock product surfaces", () => {
  const app = source("src", "App.tsx");
  for (const route of ["/", "/about", "/report", "/trust-assurance", "/insights", "/contact", "/privacy", "/terms"]) {
    assert.match(app, new RegExp(`path=["']${route.replace("/", "\\/")}["']`));
  }
  for (const route of ["/portal", "/login", "/admin", "/instant-quote", "/quote-now"]) {
    assert.doesNotMatch(app, new RegExp(`path=["']${route.replace("/", "\\/")}["']`));
  }
});

test("prohibited orphan surfaces are absent from the public application source", () => {
  for (const file of [
    "src/pages/portal.tsx",
    "src/pages/login.tsx",
    "src/pages/admin.tsx",
    "src/components/TelegramChatButton.tsx",
  ]) {
    assert.equal(existsSync(join(appRoot, file)), false, `${file} must be deleted or moved outside the application source`);
  }
});

test("mobile navigation contains focus and restores inert and scroll state", () => {
  const navbar = source("src", "components", "layout", "navbar.tsx");
  assert.match(navbar, /event\.key\s*===\s*["']Escape["']/);
  assert.match(navbar, /event\.key\s*===\s*["']Tab["']/);
  assert.match(navbar, /event\.shiftKey/);
  assert.match(navbar, /event\.preventDefault\(\)/);
  assert.match(navbar, /mobileMenuRef\.current[\s\S]*querySelectorAll/);
  assert.match(navbar, /document\.addEventListener\(["']keydown["']/);
  assert.match(navbar, /document\.removeEventListener\(["']keydown["']/);
  assert.match(navbar, /firstMobileLinkRef\.current\?\.focus\(\)/);
  assert.match(navbar, /toggleRef\.current\?\.focus\(\)/);
  assert.match(navbar, /querySelectorAll<HTMLElement>\(["']main, footer["']\)/);
  assert.match(navbar, /element\.inert\s*=\s*true/);
  assert.match(navbar, /element\.inert\s*=\s*previousInert/);
  assert.match(navbar, /document\.body\.style\.overflow\s*=\s*["']hidden["']/);
  assert.match(navbar, /document\.body\.style\.overflow\s*=\s*previousBodyOverflow/);
  assert.match(navbar, /h-\[calc\(100dvh-5rem\)\][\s\S]*overscroll-contain/);
  assert.match(navbar, /matchMedia\(["']\(min-width:\s*768px\)["']\)/);
  assert.match(navbar, /desktopQuery\.matches[\s\S]*setOpen\(false\)/);
  assert.match(navbar, /desktopQuery\.addEventListener\(["']change["']/);
  assert.match(navbar, /desktopQuery\.removeEventListener\(["']change["']/);
});

test("public HTML does not transfer visitor data to a third-party font host", () => {
  const html = source("index.html");
  const css = source("src", "index.css");
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  assert.doesNotMatch(css, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
});

test("homepage carries the approved positioning and four available services", () => {
  const home = source("src", "pages", "home.tsx");
  assert.match(home, /Buyer-side Korea sourcing review/);
  assert.match(home, /Asivanta helps overseas buyers review Korean suppliers, RFQs, and open questions before tooling, deposits, or a purchase order\./);
  for (const service of [
    "Supplier and shortlist review",
    "RFQ and quote comparison",
    "Document and evidence review",
    "Pre-commitment questions",
  ]) assert.match(home, new RegExp(service));
});

test("public conversion path is an honest inquiry to hello@asivanta.com", () => {
  const copy = publicCopy();
  assert.match(copy, /hello@asivanta\.com/);
  assert.doesNotMatch(copy, /advisory@asivanta\.com|contact@asivanta\.com/i);
  const contact = source("src", "pages", "contact.tsx");
  for (const field of ["fullName", "company", "email", "evaluation", "message"]) {
    assert.match(contact, new RegExp(`name=["']${field}["']`));
  }
  assert.match(contact, /Received\. We will reply if we can help\./);
  assert.doesNotMatch(contact, /24[–-]48 hours|response time/i);
});

test("contact form fails closed around an explicitly rendered Turnstile challenge", () => {
  const contact = source("src", "pages", "contact.tsx");
  assert.match(contact, /import\.meta\.env\.VITE_TURNSTILE_SITE_KEY/);
  assert.match(contact, /https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit/);
  assert.match(contact, /turnstile\.render\(/);
  assert.match(contact, /payload\.append\(["']turnstileToken["'],\s*turnstileToken\)/);
  assert.match(contact, /finally\s*{[\s\S]*resetTurnstile\(\)/);
  assert.match(contact, /turnstile\.reset\(/);
  assert.match(contact, /disabled=\{submitting\s*\|\|\s*!turnstileToken/);
  assert.match(contact, /challengeError[\s\S]*mailto:hello@asivanta\.com/);
  assert.match(contact, /dataset\.turnstileFailed\s*=\s*["']true["']/);
  assert.match(contact, /dataset\.turnstileFailed\s*===\s*["']true["']/);
  assert.doesNotMatch(contact, /1x00000000000000000000AA|2x00000000000000000000AB|3x00000000000000000000FF/);
});

test("privacy policy discloses Cloudflare abuse-prevention processing conservatively", () => {
  const privacy = source("src", "pages", "privacy.tsx");
  assert.match(privacy, /Cloudflare may process technical data[^.]*abuse prevention/i);
});

test("unsupported product and capability claims are absent from release surfaces", () => {
  const copy = publicCopy();
  for (const banned of [
    /client portal/i,
    /secure login/i,
    /real-time/i,
    /instant quote/i,
    /quote now/i,
    /verified supplier options/i,
    /we verify every supplier/i,
    /fifteen years|15 years|20 years/i,
    /supplier relationships that take years/i,
    /we visit factories in person/i,
    /no hidden costs\. no cultural gaps\. no surprises\./i,
  ]) assert.doesNotMatch(copy, banned);
});

test("every release URL has unique approved metadata", () => {
  const meta = JSON.parse(source("route-meta.json"));
  const expectedTitles = [
    "Asivanta | Buyer-Side Korea Sourcing Advisory",
    "About Asivanta | Seoul-Based Sourcing Advisory",
    "Korea Supplier Shortlist Review | Asivanta",
    "Trust & Assurance | Asivanta",
    "Insights | Korea Sourcing Guides",
    "Contact Asivanta",
    "Privacy Policy | Asivanta",
    "Terms of Service | Asivanta",
  ];
  const titles = Object.values(meta).map((page) => page.title);
  assert.deepEqual(titles, expectedTitles);
  assert.equal(new Set(titles).size, 8);
});

test("valid route metadata restores indexable robots directives after a not-found view", () => {
  const meta = source("src", "lib", "page-meta.tsx");
  assert.match(meta, /setMeta\(\s*['"]meta\[name=[\\"]robots[\\"]\]['"]\s*,\s*['"]name=robots['"]\s*,\s*['"]index,follow,max-image-preview:large['"]\s*\)/);
});

test("production build emits route-specific non-JavaScript metadata", () => {
  const manifestPath = join(appRoot, "route-meta.json");
  assert.equal(existsSync(manifestPath), true, "route metadata manifest is missing");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const outputRoot = join(appRoot, "dist", "public");
  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  for (const meta of Object.values(manifest)) {
    const output = meta.path === "/" ? "index.html" : `${meta.path.slice(1)}.html`;
    const outputPath = join(outputRoot, output);
    assert.equal(existsSync(outputPath), true, `${output} is missing from the production build`);
    const html = readFileSync(outputPath, "utf8");
    const url = `https://asivanta.com${meta.path}`;
    assert.match(html, new RegExp(`<title>${escapeRegex(meta.title)}</title>`));
    assert.match(html, new RegExp(`<meta name="description" content="${escapeRegex(meta.description)}"`));
    assert.match(html, new RegExp(`<link rel="canonical" href="${escapeRegex(url)}"`));
    assert.match(html, new RegExp(`<meta property="og:title" content="${escapeRegex(meta.title)}"`));
    assert.match(html, new RegExp(`<meta property="og:description" content="${escapeRegex(meta.description)}"`));
    assert.match(html, new RegExp(`<meta property="og:url" content="${escapeRegex(url)}"`));
  }
});

test("crawl controls list only release routes", () => {
  const sitemap = source("public", "sitemap.xml");
  const robots = source("public", "robots.txt");
  for (const route of ["about", "report", "trust-assurance", "insights", "contact", "privacy", "terms"]) {
    assert.match(sitemap, new RegExp(`https:\\/\\/asivanta\\.com\\/${route}`));
  }
  assert.doesNotMatch(sitemap, /portal|login|admin|quote/i);
  assert.match(robots, /Sitemap: https:\/\/asivanta\.com\/sitemap\.xml/);
});

test("legacy insight URLs permanently redirect to the Insights index", () => {
  const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  const redirects = new Map((vercel.redirects || []).map((redirect) => [redirect.source, redirect]));
  for (const source of [
    "/insights/kes-2026-overseas-buyer-checklist",
    "/insights/korea-physical-ai-rd-partner-checklist",
    "/insights/korean-automotive-supplier-review-checklist",
    "/insights/korean-manufacturer-vs-trading-company",
  ]) {
    assert.deepEqual(redirects.get(source), { source, destination: "/insights", permanent: true });
  }
});

test("unknown and removed routes use a real static 404 instead of a catch-all rewrite", () => {
  const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  assert.equal(vercel.cleanUrls, true);
  assert.equal(vercel.rewrites, undefined);
  for (const route of ["/portal", "/login", "/admin", "/instant-quote", "/quote-now"]) {
    assert.equal((vercel.redirects || []).some(({ source }) => source === route), false);
  }

  const notFoundPath = join(appRoot, "dist", "public", "404.html");
  assert.equal(existsSync(notFoundPath), true, "404.html is missing from the production build");
  const html = readFileSync(notFoundPath, "utf8");
  assert.match(html, /<title>Page Not Found \| Asivanta<\/title>/);
  assert.match(html, /<meta name="robots" content="noindex,follow"/);
  assert.match(html, /Page not found/);
});

test("structured data is limited to Organization and WebSite", () => {
  const html = source("index.html");
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"WebSite"/);
  assert.doesNotMatch(html, /"@type":\s*"Product"|"@type":\s*"SoftwareApplication"/);
});

test("contact API defaults to the approved inbox and validates the new inquiry fields", () => {
  const api = readFileSync(join(root, "api", "contact.js"), "utf8");
  assert.match(api, /hello@asivanta\.com/);
  for (const field of ["fullName", "company", "email", "evaluation", "message"]) {
    assert.match(api, new RegExp(`get\\(["']${field}["']\\)`));
  }
  assert.doesNotMatch(api, /contact@asivanta\.com|advisory@asivanta\.com/i);
});

test("contact API does not trust forwarded IP headers or retain unbounded request state", () => {
  const api = readFileSync(join(root, "api", "contact.js"), "utf8");
  assert.doesNotMatch(api, /x-forwarded-for/i);
  assert.doesNotMatch(api, /new Map\s*\(/);
  assert.doesNotMatch(api, /rate.?limit/i);
});

function multipartRequest(fields, ip, { method = "POST", origin = "http://localhost:4173" } = {}) {
  const boundary = "----asivanta-test-boundary";
  const body = Object.entries(fields).map(([name, value]) =>
    `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
  ).join("") + `--${boundary}--\r\n`;
  const request = Readable.from([Buffer.from(body)]);
  request.method = method;
  request.headers = {
    "content-type": `multipart/form-data; boundary=${boundary}`,
    "content-length": String(Buffer.byteLength(body)),
    origin,
    "x-forwarded-for": ip,
  };
  request.socket = { remoteAddress: ip };
  return request;
}

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

function validInquiry(overrides = {}) {
  return {
    fullName: "John Example",
    company: "Example Buyer",
    email: "john@example.com",
    evaluation: "A Korean supplier shortlist for one defined component.",
    message: "We need the company names, quote scope, and open evidence gaps compared.",
    _hp_field: "",
    ...overrides,
  };
}

test("contact API rejects unsupported methods and hostile origins before parsing", async () => {
  const { default: handler } = await import(new URL("../api/contact.js", import.meta.url));

  const methodResponse = mockResponse();
  await handler(multipartRequest({}, "192.0.2.20", { method: "GET" }), methodResponse);
  assert.equal(methodResponse.statusCode, 405);
  assert.equal(methodResponse.headers.Allow, "POST");

  const missingOriginResponse = mockResponse();
  await handler(multipartRequest({}, "192.0.2.21", { origin: "" }), missingOriginResponse);
  assert.equal(missingOriginResponse.statusCode, 403);
  assert.match(missingOriginResponse.payload.error, /origin is not allowed/);

  const hostileOriginResponse = mockResponse();
  await handler(multipartRequest({}, "192.0.2.21", { origin: "https://asivanta.com.example.org" }), hostileOriginResponse);
  assert.equal(hostileOriginResponse.statusCode, 403);
  assert.match(hostileOriginResponse.payload.error, /origin is not allowed/);
});

test("contact API requires and verifies Turnstile before mail delivery", async () => {
  const { default: handler } = await import(new URL("../api/contact.js", import.meta.url));
  const priorSecret = process.env.TURNSTILE_SECRET_KEY;
  const priorResendKey = process.env.RESEND_API_KEY;
  const priorFetch = globalThis.fetch;
  const priorConsoleError = console.error;
  const verificationRequests = [];
  console.error = () => {};

  try {
    delete process.env.RESEND_API_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    globalThis.fetch = async (...args) => {
      verificationRequests.push(args);
      return { ok: true, json: async () => ({ success: true }) };
    };

    const missingSecretResponse = mockResponse();
    await handler(multipartRequest(validInquiry({ turnstileToken: "configured-token" }), "192.0.2.30"), missingSecretResponse);
    assert.equal(missingSecretResponse.statusCode, 503);
    assert.equal(verificationRequests.length, 0);

    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const missingTokenResponse = mockResponse();
    await handler(multipartRequest(validInquiry(), "192.0.2.31"), missingTokenResponse);
    assert.equal(missingTokenResponse.statusCode, 400);
    assert.equal(verificationRequests.length, 0);

    globalThis.fetch = async (...args) => {
      verificationRequests.push(args);
      return { ok: true, json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }) };
    };
    const failedChallengeResponse = mockResponse();
    await handler(multipartRequest(validInquiry({ turnstileToken: "failed-token" }), "192.0.2.32"), failedChallengeResponse);
    assert.equal(failedChallengeResponse.statusCode, 403);
    assert.match(failedChallengeResponse.payload.error, /verification failed/i);

    globalThis.fetch = async (...args) => {
      verificationRequests.push(args);
      return { ok: true, json: async () => ({ success: true }) };
    };
    const verifiedResponse = mockResponse();
    await handler(multipartRequest(validInquiry({ turnstileToken: "verified-token" }), "192.0.2.33"), verifiedResponse);
    assert.equal(verifiedResponse.statusCode, 503, "successful verification must reach the mail configuration gate");

    assert.equal(verificationRequests.length, 2);
    for (const [url, options] of verificationRequests) {
      assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
      assert.equal(options.method, "POST");
      assert.equal(options.body.get("secret"), "test-secret");
      assert.equal(options.body.has("remoteip"), false, "forwarded or proxy IPs must not be sent to Turnstile");
    }
    assert.equal(verificationRequests[0][1].body.get("response"), "failed-token");
    assert.equal(verificationRequests[1][1].body.get("response"), "verified-token");
  } finally {
    console.error = priorConsoleError;
    globalThis.fetch = priorFetch;
    if (priorSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = priorSecret;
    if (priorResendKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = priorResendKey;
  }
});

test("contact API honeypot succeeds without sending or validating an inquiry", async () => {
  const { default: handler } = await import(new URL("../api/contact.js", import.meta.url));
  const response = mockResponse();
  await handler(multipartRequest({ _hp_field: "https://spam.example" }, "192.0.2.22"), response);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { success: true });
});

test("contact API rejects multipart fields over the configured aggregate limit", async () => {
  const { default: handler } = await import(new URL("../api/contact.js", import.meta.url));
  const response = mockResponse();
  await handler(multipartRequest({ message: "x".repeat(17 * 1024) }, "192.0.2.23"), response);
  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.payload, { error: "Invalid form data." });
});

test("contact API rejects overlength normalized fields before challenge verification", async () => {
  const { default: handler } = await import(new URL("../api/contact.js", import.meta.url));
  const priorSecret = process.env.TURNSTILE_SECRET_KEY;
  const priorFetch = globalThis.fetch;
  const verificationRequests = [];

  try {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    globalThis.fetch = async (...args) => {
      verificationRequests.push(args);
      return { ok: true, json: async () => ({ success: true }) };
    };

    const cases = [
      ["fullName", "x".repeat(121), /Name must be 120 characters or fewer/],
      ["company", "x".repeat(161), /Company must be 160 characters or fewer/],
      ["email", `a@b.co${"x".repeat(249)}`, /Email must be 254 characters or fewer/],
      ["evaluation", "x".repeat(1001), /Evaluation must be 1000 characters or fewer/],
      ["message", "x".repeat(2001), /Message must be 2000 characters or fewer/],
    ];

    for (const [field, value, expectedError] of cases) {
      const response = mockResponse();
      await handler(multipartRequest(validInquiry({ [field]: value, turnstileToken: "unused-token" }), "192.0.2.40"), response);
      assert.equal(response.statusCode, 400, `${field} must be rejected rather than truncated`);
      assert.match(response.payload.error, expectedError);
    }
    assert.equal(verificationRequests.length, 0, "invalid lengths must be rejected before Turnstile");
  } finally {
    globalThis.fetch = priorFetch;
    if (priorSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = priorSecret;
  }
});

test("contact API parses multipart input and fails safely without mail configuration", async () => {
  const { default: handler } = await import(new URL("../api/contact.js", import.meta.url));

  const invalidResponse = mockResponse();
  await handler(multipartRequest({ fullName: "John" }, "192.0.2.10"), invalidResponse);
  assert.equal(invalidResponse.statusCode, 400);
  assert.match(invalidResponse.payload.error, /Company is required/);

  const validResponse = mockResponse();
  const priorKey = process.env.RESEND_API_KEY;
  const priorSecret = process.env.TURNSTILE_SECRET_KEY;
  const priorFetch = globalThis.fetch;
  const priorConsoleError = console.error;
  console.error = () => {};
  delete process.env.RESEND_API_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
  try {
    await handler(multipartRequest(validInquiry({ turnstileToken: "verified-token" }), "192.0.2.11"), validResponse);
  } finally {
    console.error = priorConsoleError;
    globalThis.fetch = priorFetch;
    if (priorKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = priorKey;
    if (priorSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = priorSecret;
  }
  assert.equal(validResponse.statusCode, 503);
  assert.match(validResponse.payload.error, /temporarily unavailable/);
  assert.equal(validResponse.headers["Cache-Control"], "no-store");
});
