import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

const ALLOWED_EXTENSIONS = new Set([".pdf", ".xlsx", ".png", ".jpg", ".jpeg"]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES = 2;
const VALID_PROJECT_TYPES = ["Sourcing", "Supplier Verification", "Negotiation", "Other"];
const MIN_MESSAGE = 30;
const MAX_MESSAGE = 2000;

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}
function sanitize(s) {
  return String(s).replace(/[<>]/g, "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    maxFiles: MAX_FILES,
    maxFileSize: MAX_FILE_SIZE,
    multiples: true,
  });

  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    return res.status(400).json({ error: err.message || "Invalid form data." });
  }

  const get = (k) => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]) || "";

  // Honeypot
  if (get("_hp_field")) return res.status(200).json({ success: true });

  const fullName = sanitize(get("fullName"));
  const company = sanitize(get("company"));
  const email = sanitize(get("email"));
  const phone = sanitize(get("phone"));
  const projectType = get("projectType");
  const message = sanitize(get("message"));

  const errors = [];
  if (!fullName) errors.push("Full Name is required.");
  if (!company) errors.push("Company Name is required.");
  if (!email || !isValidEmail(email)) errors.push("A valid email address is required.");
  if (!VALID_PROJECT_TYPES.includes(projectType)) errors.push("Please select a valid project type.");
  if (!message) errors.push("Message is required.");
  else if (message.length < MIN_MESSAGE) errors.push(`Message must be at least ${MIN_MESSAGE} characters.`);
  else if (message.length > MAX_MESSAGE) errors.push(`Message must not exceed ${MAX_MESSAGE} characters.`);

  if (errors.length > 0) return res.status(400).json({ error: errors.join(" ") });

  // Validate uploaded files
  const uploadedFiles = files.files
    ? Array.isArray(files.files) ? files.files : [files.files]
    : [];

  for (const file of uploadedFiles) {
    const ext = "." + file.originalFilename.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return res.status(400).json({ error: `File type ${ext} is not allowed.` });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured." });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@asivanta.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const fileList = uploadedFiles.length > 0
    ? uploadedFiles.map(f => `- ${f.originalFilename} (${(f.size / 1024).toFixed(0)} KB)`).join("\n")
    : "None";

  const attachments = uploadedFiles.map(f => ({
    filename: f.originalFilename,
    content: fs.readFileSync(f.filepath),
  }));

  const resend = new Resend(apiKey);

  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: `New Asivanta Inquiry — ${projectType} — ${company}`,
    text: `NEW ASIVANTA INQUIRY
----------------------------------------
Company:      ${company}
Name:         ${fullName}
Email:        ${email}
Phone:        ${phone || "Not provided"}
Project Type: ${projectType}

MESSAGE:
${message}

FILES:
${fileList}

Submitted: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })} KST
Source: ASIVANTA Website Contact Form`,
    ...(attachments.length > 0 ? { attachments } : {}),
  });

  // Clean up temp files
  for (const file of uploadedFiles) {
    try { fs.unlinkSync(file.filepath); } catch {}
  }

  if (sendError) {
    console.error("Resend error:", sendError);
    return res.status(500).json({ error: "Something went wrong while sending your inquiry. Please try again shortly." });
  }

  return res.status(200).json({ success: true });
}
