import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import fs from "node:fs";
import formidable from "formidable";
import { Resend } from "resend";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".xlsx", ".png", ".jpg", ".jpeg"]);
const BLOCKED_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".js", ".msi", ".vbs", ".ps1",
  ".html", ".svg", ".sh", ".py", ".rb", ".php", ".jsp",
  ".dll", ".com", ".scr", ".pif", ".cpl", ".inf", ".reg",
]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES = 2;
const VALID_PROJECT_TYPES = ["Sourcing", "Supplier Verification", "Negotiation", "Other"];
const MIN_MESSAGE_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 2000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

function respond(res: ServerResponse, status: number, body: object): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function parseForm(req: IncomingMessage): Promise<[formidable.Fields, formidable.Files]> {
  const form = new formidable.IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    multiples: true,
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });
}

function buildEmailHtml(data: {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  files: Array<{ original: string; size: number }>;
  submittedAt: string;
}): string {
  const fileRows =
    data.files.length > 0
      ? data.files
          .map(
            (f) =>
              `<tr><td style="padding:6px 12px;font-size:13px;color:#374151;">${f.original}</td><td style="padding:6px 12px;font-size:13px;color:#6B7280;">${(f.size / 1024).toFixed(0)} KB</td></tr>`
          )
          .join("")
      : `<tr><td colspan="2" style="padding:6px 12px;font-size:13px;color:#6B7280;">None</td></tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0a1128;padding:28px 36px;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;color:#93C5FD;text-transform:uppercase;">ASIVANTA Advisory</p>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;color:#ffffff;">New Inquiry Received</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#EFF6FF;padding:12px 36px;border-bottom:1px solid #DBEAFE;">
            <p style="margin:0;font-size:13px;color:#1D4ED8;">
              <strong>Action required:</strong> A new contact form submission has been received from <strong>${data.company}</strong>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px 0;">
            <h2 style="margin:0 0 20px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;">Contact Information</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
              <tr style="background:#F9FAFB;">
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6B7280;width:40%;border-bottom:1px solid #E5E7EB;">Company Name</td>
                <td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #E5E7EB;"><strong>${data.company}</strong></td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6B7280;border-bottom:1px solid #E5E7EB;">Contact Name</td>
                <td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #E5E7EB;">${data.fullName}</td>
              </tr>
              <tr style="background:#F9FAFB;">
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6B7280;border-bottom:1px solid #E5E7EB;">Email Address</td>
                <td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #E5E7EB;"><a href="mailto:${data.email}" style="color:#2563EB;text-decoration:none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6B7280;border-bottom:1px solid #E5E7EB;">Phone Number</td>
                <td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #E5E7EB;">${data.phone || "Not provided"}</td>
              </tr>
              <tr style="background:#F9FAFB;">
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#6B7280;">Project Type</td>
                <td style="padding:10px 16px;font-size:13px;"><span style="display:inline-block;padding:3px 10px;background:#EFF6FF;color:#1D4ED8;border-radius:20px;font-size:12px;font-weight:500;">${data.projectType}</span></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 0;">
            <h2 style="margin:0 0 12px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;">Message</h2>
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 0;">
            <h2 style="margin:0 0 12px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;">Attached Files</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
              ${fileRows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">
              Submitted: ${new Date(data.submittedAt).toLocaleString("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 36px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
              ASIVANTA Advisory · Seoul, South Korea · <a href="https://asivanta.com" style="color:#9CA3AF;">asivanta.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailText(data: {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  files: Array<{ original: string; size: number }>;
  submittedAt: string;
}): string {
  const fileList =
    data.files.length > 0
      ? data.files.map((f) => `  - ${f.original} (${(f.size / 1024).toFixed(0)} KB)`).join("\n")
      : "  None";

  return `NEW ASIVANTA INQUIRY
${"─".repeat(40)}

CONTACT INFORMATION
Company Name:  ${data.company}
Contact Name:  ${data.fullName}
Email:         ${data.email}
Phone:         ${data.phone || "Not provided"}
Project Type:  ${data.projectType}

MESSAGE
${"─".repeat(40)}
${data.message}

ATTACHED FILES
${"─".repeat(40)}
${fileList}

${"─".repeat(40)}
Submitted: ${new Date(data.submittedAt).toLocaleString("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
Source: ASIVANTA Website Contact Form
`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return respond(res, 405, { error: "Method not allowed" });
  }

  let fields: formidable.Fields;
  let files: formidable.Files;

  try {
    [fields, files] = await parseForm(req);
  } catch (err: unknown) {
    const e = err as { message?: string };
    const msg = (e.message || "").toLowerCase();
    if (msg.includes("maxfilesize") || msg.includes("too large") || msg.includes("size")) {
      return respond(res, 400, { error: "File exceeds the 8MB size limit." });
    }
    return respond(res, 400, { error: e.message || "Invalid form data." });
  }

  const getField = (key: string): string => {
    const val = fields[key];
    return (Array.isArray(val) ? val[0] : val) || "";
  };

  const hp = fields._hp_field;
  if (hp && (Array.isArray(hp) ? hp[0] : hp)) {
    return respond(res, 200, { success: true });
  }

  const fullName = getField("fullName");
  const company = getField("company");
  const email = getField("email");
  const phone = getField("phone");
  const projectType = getField("projectType");
  const message = getField("message");

  const errors: string[] = [];
  if (!fullName || sanitize(fullName).length < 1) errors.push("Full Name is required.");
  if (!company || sanitize(company).length < 1) errors.push("Company Name is required.");
  if (!email || !isValidEmail(email)) errors.push("A valid email address is required.");
  if (!projectType || !VALID_PROJECT_TYPES.includes(projectType)) errors.push("Please select a valid project type.");
  if (!message) {
    errors.push("Message is required.");
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.push(`Message must be at least ${MIN_MESSAGE_LENGTH} characters.`);
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`);
  }

  if (errors.length > 0) return respond(res, 400, { error: errors.join(" ") });

  const rawFiles = Object.values(files)
    .flatMap((f) => (Array.isArray(f) ? f : [f]))
    .filter(Boolean) as formidable.File[];

  if (rawFiles.length > MAX_FILES) {
    for (const f of rawFiles) {
      try { fs.unlinkSync(f.filepath); } catch { /* ignore */ }
    }
    return respond(res, 400, { error: "Maximum 2 files allowed." });
  }

  // Validate file extensions
  for (const f of rawFiles) {
    const ext = path.extname(f.originalFilename || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext) || BLOCKED_EXTENSIONS.has(ext)) {
      for (const file of rawFiles) {
        try { fs.unlinkSync(file.filepath); } catch { /* ignore */ }
      }
      return respond(res, 400, { error: `File type ${ext || "(unknown)"} is not allowed.` });
    }
  }

  const cleanData = {
    fullName: sanitize(fullName),
    company: sanitize(company),
    email: sanitize(email),
    phone: phone ? sanitize(phone) : "",
    projectType,
    message: sanitize(message),
    files: rawFiles.map((f) => ({ original: f.originalFilename || "", size: f.size })),
    submittedAt: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    for (const f of rawFiles) {
      try { fs.unlinkSync(f.filepath); } catch { /* ignore */ }
    }
    return respond(res, 200, { success: true });
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@asivanta.com";
  const resend = new Resend(apiKey);

  const attachments = rawFiles.map((f) => ({
    filename: f.originalFilename || "attachment",
    content: fs.readFileSync(f.filepath),
  }));

  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: `New Asivanta Inquiry — ${cleanData.company}`,
    text: buildEmailText(cleanData),
    html: buildEmailHtml(cleanData),
    ...(attachments.length > 0 ? { attachments } : {}),
  });

  for (const f of rawFiles) {
    try { fs.unlinkSync(f.filepath); } catch { /* ignore */ }
  }

  if (sendError) {
    return respond(res, 500, { error: "Something went wrong while sending your inquiry. Please try again shortly." });
  }

  return respond(res, 200, { success: true });
}
