import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

const ALLOWED_EXTENSIONS = new Set([".pdf", ".xlsx", ".png", ".jpg", ".jpeg"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES = 2;
const MAX_TOTAL_FILE_SIZE = 14 * 1024 * 1024;
const VALID_PROJECT_TYPES = [
  "Sourcing",
  "Supplier Shortlist",
  "Supplier Verification",
  "Quote / RFQ Comparison",
  "Negotiation",
  "Negotiation Support",
  "Factory Readiness Review",
  "Managed Sourcing",
  "Other",
];
const MIN_MESSAGE = 30;
const MAX_MESSAGE = 8000;

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

  const get = (k) =>
    (Array.isArray(fields[k]) ? fields[k][0] : fields[k]) || "";

  // Honeypot
  if (get("_hp_field")) return res.status(200).json({ success: true });

  const fullName = sanitize(get("fullName"));
  const company = sanitize(get("company"));
  const email = sanitize(get("email"));
  const phone = sanitize(get("phone"));
  const projectType = get("projectType");
  const quoteId = sanitize(get("quoteId"));
  const source = sanitize(get("source")) || "ASIVANTA Website Contact Form";
  const message = sanitize(get("message"));

  const errors = [];
  if (!fullName) errors.push("Full Name is required.");
  if (!company) errors.push("Company Name is required.");
  if (!email || !isValidEmail(email))
    errors.push("A valid email address is required.");
  if (!VALID_PROJECT_TYPES.includes(projectType))
    errors.push("Please select a valid project type.");
  if (!message) errors.push("Message is required.");
  else if (message.length < MIN_MESSAGE)
    errors.push(`Message must be at least ${MIN_MESSAGE} characters.`);
  else if (message.length > MAX_MESSAGE)
    errors.push(`Message must not exceed ${MAX_MESSAGE} characters.`);

  if (errors.length > 0)
    return res.status(400).json({ error: errors.join(" ") });

  // Validate uploaded files
  const uploadedFiles = files.files
    ? Array.isArray(files.files)
      ? files.files
      : [files.files]
    : [];

  if (uploadedFiles.length > MAX_FILES) {
    return res
      .status(400)
      .json({ error: `Maximum ${MAX_FILES} files allowed.` });
  }

  const totalFileSize = uploadedFiles.reduce(
    (sum, file) => sum + (file.size || 0),
    0,
  );
  if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
    return res.status(400).json({ error: "Total upload size is too large." });
  }

  for (const file of uploadedFiles) {
    const originalFilename = file.originalFilename || "";
    const ext = "." + originalFilename.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return res
        .status(400)
        .json({ error: `File type ${ext} is not allowed.` });
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype || "")) {
      return res
        .status(400)
        .json({ error: "Uploaded file type is not allowed." });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured." });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@asivanta.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const fileList =
    uploadedFiles.length > 0
      ? uploadedFiles
          .map(
            (f) => `- ${f.originalFilename} (${(f.size / 1024).toFixed(0)} KB)`,
          )
          .join("\n")
      : "None";

  const attachments = uploadedFiles.map((f) => ({
    filename: f.originalFilename,
    content: fs.readFileSync(f.filepath),
  }));

  const resend = new Resend(apiKey);
  const subjectPrefix =
    projectType === "Quote / RFQ Comparison"
      ? "New Asivanta Instant Quote"
      : "New Asivanta Inquiry";

  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: `${subjectPrefix}${quoteId ? ` ${quoteId}` : ""} — ${company}`,
    text: `NEW ASIVANTA INQUIRY
----------------------------------------
Company:      ${company}
Name:         ${fullName}
Email:        ${email}
Phone:        ${phone || "Not provided"}
Project Type: ${projectType}
Quote ID:     ${quoteId || "Not provided"}

MESSAGE:
${message}

FILES:
${fileList}

Submitted: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })} KST
Source: ${source}`,
    ...(attachments.length > 0 ? { attachments } : {}),
  });

  // Clean up temp files
  for (const file of uploadedFiles) {
    try {
      fs.unlinkSync(file.filepath);
    } catch {}
  }

  if (sendError) {
    console.error("Resend error:", sendError);
    return res.status(500).json({
      error:
        "Something went wrong while sending your inquiry. Please try again shortly.",
    });
  }

  return res.status(200).json({ success: true });
}
