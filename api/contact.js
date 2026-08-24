import { Resend } from "resend";
import formidable from "formidable";

export const config = { api: { bodyParser: false } };

const MAX_FIELDS_SIZE = 16 * 1024;

function sanitize(value) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/[<>]/g, "").trim();
}

function isValidEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const origin = String(req.headers.origin || "");
  if (!/^https:\/\/(www\.)?asivanta\.com$/i.test(origin) && !/^http:\/\/localhost(?::\d+)?$/i.test(origin)) {
    return res.status(403).json({ error: "Request origin is not allowed." });
  }

  const form = formidable({ maxFiles: 0, maxFields: 8, maxFieldsSize: MAX_FIELDS_SIZE, multiples: false });
  let fields;
  try {
    [fields] = await form.parse(req);
  } catch {
    return res.status(400).json({ error: "Invalid form data." });
  }

  const get = (key) => (Array.isArray(fields[key]) ? fields[key][0] : fields[key]) || "";
  if (get("_hp_field")) return res.status(200).json({ success: true });

  const fullName = sanitize(get("fullName"));
  const company = sanitize(get("company"));
  const email = sanitize(get("email"));
  const evaluation = sanitize(get("evaluation"));
  const message = sanitize(get("message"));

  const errors = [];
  if (fullName.length > 120) errors.push("Name must be 120 characters or fewer.");
  if (company.length > 160) errors.push("Company must be 160 characters or fewer.");
  if (email.length > 254) errors.push("Email must be 254 characters or fewer.");
  if (evaluation.length > 1000) errors.push("Evaluation must be 1000 characters or fewer.");
  if (message.length > 2000) errors.push("Message must be 2000 characters or fewer.");
  if (!fullName) errors.push("Name is required.");
  if (!company) errors.push("Company is required.");
  if (!isValidEmail(email)) errors.push("A valid email is required.");
  if (evaluation.length < 10) errors.push("Tell us what you are evaluating.");
  if (message.length < 10) errors.push("Tell us what you need clarified.");
  if (errors.length) return res.status(400).json({ error: errors.join(" ") });

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    console.error("TURNSTILE_SECRET_KEY not set");
    return res.status(503).json({ error: "The inquiry form is temporarily unavailable. Please email hello@asivanta.com." });
  }

  const turnstileToken = String(get("turnstileToken") || "").trim();
  if (!turnstileToken) {
    return res.status(400).json({ error: "Please complete the abuse-prevention check before sending your inquiry." });
  }

  let turnstileResult;
  try {
    const verificationBody = new URLSearchParams({
      secret: turnstileSecret,
      response: turnstileToken,
    });
    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verificationBody,
    });
    if (!verificationResponse.ok) throw new Error(`Turnstile returned ${verificationResponse.status}`);
    turnstileResult = await verificationResponse.json();
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return res.status(503).json({ error: "The inquiry form is temporarily unavailable. Please email hello@asivanta.com." });
  }

  if (!turnstileResult?.success) {
    return res.status(403).json({ error: "Abuse-prevention verification failed. Please try again or email hello@asivanta.com." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return res.status(503).json({ error: "The inquiry form is temporarily unavailable. Please email hello@asivanta.com." });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "hello@asivanta.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `New Asivanta inquiry — ${company}`,
    text: `NEW ASIVANTA INQUIRY\n\nName: ${fullName}\nCompany: ${company}\nEmail: ${email}\n\nWHAT THEY ARE EVALUATING:\n${evaluation}\n\nWHAT THEY NEED CLARIFIED:\n${message}\n\nSubmitted: ${new Date().toISOString()}\nSource: asivanta.com/contact`,
  });

  if (error) {
    console.error("Resend error:", error);
    return res.status(502).json({ error: "Your inquiry could not be sent. Please email hello@asivanta.com." });
  }

  return res.status(200).json({ success: true });
}
