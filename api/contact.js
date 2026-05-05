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
const MAX_QUOTE_LINES = 12;

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}
function sanitize(s) {
  return String(s).replace(/[<>]/g, "").trim();
}
function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}
function parseQuoteLines(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_QUOTE_LINES).map((line, index) => ({
      line: Number(line.line) || index + 1,
      asvPartNumber: sanitize(line.asvPartNumber || "").slice(0, 80),
      category: sanitize(line.category || "").slice(0, 80),
      manufacturer: sanitize(line.manufacturer || "").slice(0, 120),
      customerPartNumber: sanitize(line.customerPartNumber || "").slice(0, 120),
      description: sanitize(line.description || "").slice(0, 240),
      quantity: sanitize(line.quantity || "").slice(0, 40),
      targetPrice: sanitize(line.targetPrice || "").slice(0, 80),
      notes: sanitize(line.notes || "").slice(0, 240),
    }));
  } catch {
    return [];
  }
}
function quoteLinesToCsv(quoteId, quoteLines) {
  const header = [
    "Quote ID",
    "Line",
    "ASV Part Number",
    "Category",
    "Manufacturer",
    "Customer Part Number",
    "Description",
    "Quantity",
    "Target Price",
    "Notes",
  ];
  const rows = quoteLines.map((line) => [
    quoteId || "Not provided",
    line.line,
    line.asvPartNumber,
    line.category,
    line.manufacturer,
    line.customerPartNumber,
    line.description,
    line.quantity,
    line.targetPrice,
    line.notes,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
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
  const quoteMode = sanitize(get("quoteMode"));
  const quoteLines = parseQuoteLines(get("quoteLinesJson"));
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
  if (quoteLines.length > 0) {
    attachments.push({
      filename: `${quoteId || "asivanta"}-asv-lines.csv`,
      content: Buffer.from(quoteLinesToCsv(quoteId, quoteLines)),
    });
  }

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
Quote Mode:   ${quoteMode || "Not provided"}
Quote Lines:  ${quoteLines.length}

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

  const canSendCustomerAck =
    projectType === "Quote / RFQ Comparison" &&
    (process.env.QUOTE_SEND_CUSTOMER_ACK === "true" ||
      !fromEmail.includes("onboarding@resend.dev"));

  if (canSendCustomerAck) {
    const { error: ackError } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `ASIVANTA received your quote request${quoteId ? ` ${quoteId}` : ""}`,
      text: `Hello ${fullName},

Thank you for sending your ASIVANTA quote request.

Quote ID: ${quoteId || "Not provided"}
Company: ${company}
Quote Mode: ${quoteMode || "Not provided"}
Submitted: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })} KST

We received your information and will review the list, uploaded files, and any ASV part numbers generated from the request. If anything is unclear, we will contact you before preparing the quote packet.

ASIVANTA Advisory
contact@asivanta.com`,
    });
    if (ackError) {
      console.error("Resend acknowledgement error:", ackError);
    }
  }

  return res.status(200).json({ success: true });
}
