import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { logger } from "../lib/logger";
import { db, contactSubmissionsTable, notificationEmailsTable } from "@workspace/db";

const router: IRouter = Router();

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

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const submissionsDir = path.resolve(process.cwd(), "submissions");
if (!fs.existsSync(submissionsDir)) fs.mkdirSync(submissionsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (BLOCKED_EXTENSIONS.has(ext)) return cb(new Error(`File type ${ext} is not allowed.`));
    if (!ALLOWED_EXTENSIONS.has(ext)) return cb(new Error(`File type ${ext} is not supported. Allowed: PDF, XLSX, PNG, JPG.`));
    cb(null, true);
  },
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

function logSubmission(data: Record<string, unknown>) {
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.json`;
  const filepath = path.join(submissionsDir, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    logger.info({ filepath }, "Contact submission logged");
  } catch (err) {
    logger.error({ err }, "Failed to log contact submission");
  }
}

async function getNotificationEmails(): Promise<string[]> {
  try {
    const rows = await db
      .select({ email: notificationEmailsTable.email })
      .from(notificationEmailsTable)
      .orderBy(notificationEmailsTable.addedAt);

    if (rows.length === 0) {
      return ["contact@asivanta.com"];
    }
    return rows.map((r) => r.email);
  } catch {
    return ["contact@asivanta.com"];
  }
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
  const fileRows = data.files.length > 0
    ? data.files.map((f) => `<tr><td style="padding:6px 12px;font-size:13px;color:#374151;">${f.original}</td><td style="padding:6px 12px;font-size:13px;color:#6B7280;">${(f.size / 1024).toFixed(0)} KB</td></tr>`).join("")
    : `<tr><td colspan="2" style="padding:6px 12px;font-size:13px;color:#6B7280;">None</td></tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0a1128;padding:28px 36px;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;color:#93C5FD;text-transform:uppercase;">ASIVANTA Advisory</p>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;color:#ffffff;">New Inquiry Received</h1>
          </td>
        </tr>

        <!-- Alert bar -->
        <tr>
          <td style="background:#EFF6FF;padding:12px 36px;border-bottom:1px solid #DBEAFE;">
            <p style="margin:0;font-size:13px;color:#1D4ED8;">
              <strong>Action required:</strong> A new contact form submission has been received from <strong>${data.company}</strong>.
            </p>
          </td>
        </tr>

        <!-- Contact details -->
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

        <!-- Message -->
        <tr>
          <td style="padding:28px 36px 0;">
            <h2 style="margin:0 0 12px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;">Message</h2>
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
          </td>
        </tr>

        <!-- Attachments -->
        <tr>
          <td style="padding:28px 36px 0;">
            <h2 style="margin:0 0 12px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;">Attached Files</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
              ${fileRows}
            </table>
          </td>
        </tr>

        <!-- Timestamp -->
        <tr>
          <td style="padding:28px 36px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">
              Submitted: ${new Date(data.submittedAt).toLocaleString("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
            </p>
          </td>
        </tr>

        <!-- Footer -->
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
  const fileList = data.files.length > 0
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

router.post(
  "/contact",
  (req: Request, res: Response, next) => {
    upload.array("files", MAX_FILES)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "File exceeds the 8MB size limit." });
        if (err.code === "LIMIT_FILE_COUNT") return res.status(400).json({ error: "Maximum 2 files allowed." });
        return res.status(400).json({ error: err.message });
      }
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: "Too many submissions. Please try again later." });
      }

      if (req.body._hp_field) {
        logger.warn({ ip: clientIp }, "Honeypot triggered");
        return res.json({ success: true });
      }

      const { fullName, company, email, phone, projectType, message } = req.body;

      const errors: string[] = [];
      if (!fullName || typeof fullName !== "string" || sanitize(fullName).length < 1) errors.push("Full Name is required.");
      if (!company || typeof company !== "string" || sanitize(company).length < 1) errors.push("Company Name is required.");
      if (!email || typeof email !== "string" || !isValidEmail(email)) errors.push("A valid email address is required.");
      if (!projectType || !VALID_PROJECT_TYPES.includes(projectType)) errors.push("Please select a valid project type.");
      if (!message || typeof message !== "string") {
        errors.push("Message is required.");
      } else if (message.length < MIN_MESSAGE_LENGTH) {
        errors.push(`Message must be at least ${MIN_MESSAGE_LENGTH} characters.`);
      } else if (message.length > MAX_MESSAGE_LENGTH) {
        errors.push(`Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`);
      }

      if (errors.length > 0) return res.status(400).json({ error: errors.join(" ") });

      const files = (req.files as Express.Multer.File[]) || [];
      for (const file of files) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext) || BLOCKED_EXTENSIONS.has(ext)) {
          fs.unlinkSync(file.path);
          return res.status(400).json({ error: `File type ${ext} is not allowed.` });
        }
        if (file.size > MAX_FILE_SIZE) {
          fs.unlinkSync(file.path);
          return res.status(400).json({ error: "File exceeds the 8MB size limit." });
        }
        // FUTURE: Add virus/malware scanning here
      }

      const cleanData = {
        fullName: sanitize(fullName),
        company: sanitize(company),
        email: sanitize(email),
        phone: phone ? sanitize(phone) : "",
        projectType,
        message: sanitize(message),
        files: files.map((f) => ({ original: f.originalname, stored: f.filename, size: f.size })),
        submittedAt: new Date().toISOString(),
        ip: clientIp,
      };

      logSubmission(cleanData);

      try {
        await db.insert(contactSubmissionsTable).values({
          fullName: cleanData.fullName,
          company: cleanData.company,
          email: cleanData.email,
          phone: cleanData.phone,
          projectType: cleanData.projectType,
          message: cleanData.message,
          files: cleanData.files,
          ip: cleanData.ip,
          submittedAt: new Date(cleanData.submittedAt),
        });
        logger.info("Contact submission saved to database");
      } catch (dbErr) {
        logger.error({ dbErr }, "Failed to save submission to database");
      }

      const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        logger.warn("RESEND_API_KEY not configured — skipping email notification");
        for (const file of files) {
          try { fs.unlinkSync(file.path); } catch { /* ignore */ }
        }
        return res.json({ success: true });
      }

      const notificationEmails = await getNotificationEmails();
      const resend = new Resend(apiKey);

      const attachments = files.map((f) => ({
        filename: f.originalname,
        content: fs.readFileSync(f.path),
      }));

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: notificationEmails,
        subject: `New Asivanta Inquiry — ${cleanData.company}`,
        text: buildEmailText(cleanData),
        html: buildEmailHtml(cleanData),
        ...(attachments.length > 0 ? { attachments } : {}),
      });

      for (const file of files) {
        try { fs.unlinkSync(file.path); } catch { /* ignore */ }
      }

      if (sendError) {
        logger.error({ sendError }, "Resend email failed");
        return res.status(500).json({ error: "Something went wrong while sending your inquiry. Please try again shortly." });
      }

      logger.info({ company: cleanData.company, projectType: cleanData.projectType, recipients: notificationEmails.length }, "Contact form submitted successfully");
      return res.json({ success: true });
    } catch (err) {
      logger.error({ err }, "Contact form error");
      return res.status(500).json({ error: "Something went wrong while sending your inquiry. Please try again shortly." });
    }
  },
);

export default router;
