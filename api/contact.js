import { Resend } from "resend";
import { enforceRateLimit } from "./_rate-limit.js";

export const config = {
  api: { bodyParser: { sizeLimit: "96kb" } },
  maxDuration: 30,
};

const VALID_PROJECT_TYPES = new Set([
  "Sourcing",
  "Supplier Shortlist",
  "Supplier Verification",
  "Quote / RFQ Comparison",
  "Negotiation",
  "Negotiation Support",
  "Factory Readiness Review",
  "Managed Sourcing",
  "Other",
]);
const MIN_MESSAGE = 30;
const MAX_MESSAGE = 8000;
const MAX_QUOTE_LINES = 12;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function sanitize(value, maxLength = 8000) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function oneLine(value, maxLength) {
  return sanitize(value, maxLength).replace(/[\r\n]+/g, " ");
}

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body !== "string") return {};
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function parseQuoteLines(value) {
  const source = Array.isArray(value)
    ? value
    : (() => {
        try {
          return JSON.parse(String(value || "[]"));
        } catch {
          return [];
        }
      })();

  if (!Array.isArray(source)) return [];
  return source.slice(0, MAX_QUOTE_LINES).map((line, index) => ({
    line: Number(line?.line) || index + 1,
    asvPartNumber: oneLine(line?.asvPartNumber, 80),
    category: oneLine(line?.category, 80),
    manufacturer: oneLine(line?.manufacturer, 120),
    customerPartNumber: oneLine(line?.customerPartNumber, 120),
    description: oneLine(line?.description, 240),
    quantity: oneLine(line?.quantity, 40),
    annualVolume: oneLine(line?.annualVolume, 40),
    targetPrice: oneLine(line?.targetPrice, 80),
    leadTime: oneLine(line?.leadTime, 80),
    packaging: oneLine(line?.packaging, 80),
    referenceDesignator: oneLine(line?.referenceDesignator, 120),
    sourceCatalog: oneLine(line?.sourceCatalog, 120),
    family: oneLine(line?.family, 80),
    packageType: oneLine(line?.packageType, 80),
    frequency: oneLine(line?.frequency, 80),
    supplierPartNumber: oneLine(line?.supplierPartNumber, 120),
    spec: oneLine(line?.spec, 300),
    notes: oneLine(line?.notes, 360),
  }));
}

function csvCell(value) {
  const safe = String(value ?? "");
  const protectedValue = /^[=+\-@]/.test(safe) ? `'${safe}` : safe;
  return `"${protectedValue.replace(/"/g, '""')}"`;
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
    "Annual Volume",
    "Target Price",
    "Lead Time Target",
    "Packaging",
    "Reference Designator",
    "Source Catalog",
    "Family",
    "Package",
    "Frequency",
    "Supplier Part Number",
    "Generated Spec",
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
    line.annualVolume,
    line.targetPrice,
    line.leadTime,
    line.packaging,
    line.referenceDesignator,
    line.sourceCatalog,
    line.family,
    line.packageType,
    line.frequency,
    line.supplierPartNumber,
    line.spec,
    line.notes,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (
    !enforceRateLimit(req, res, {
      name: "contact",
      limit: 5,
      windowMs: 10 * 60_000,
    })
  ) {
    return;
  }
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) {
    return res.status(415).json({
      error:
        "File uploads are temporarily unavailable. Please paste the important RFQ details into the form.",
    });
  }

  const body = parseBody(req);
  if (body._hp_field) {
    return res.status(200).json({ success: true });
  }

  const fullName = oneLine(body.fullName, 120);
  const company = oneLine(body.company, 160);
  const email = oneLine(body.email, 254);
  const phone = oneLine(body.phone, 80);
  const projectType = oneLine(body.projectType, 80);
  const quoteId = oneLine(body.quoteId, 80);
  const quoteMode = oneLine(body.quoteMode, 80);
  const message = sanitize(body.message, MAX_MESSAGE + 1);
  const quoteLines = parseQuoteLines(body.quoteLines);

  const errors = [];
  if (!fullName) errors.push("Full Name is required.");
  if (!company) errors.push("Company Name is required.");
  if (!isValidEmail(email)) errors.push("A valid email address is required.");
  if (!VALID_PROJECT_TYPES.has(projectType)) {
    errors.push("Please select a valid project type.");
  }
  if (message.length < MIN_MESSAGE) {
    errors.push(`Message must be at least ${MIN_MESSAGE} characters.`);
  } else if (message.length > MAX_MESSAGE) {
    errors.push(`Message must not exceed ${MAX_MESSAGE} characters.`);
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Email service is not configured.");
    return res.status(500).json({ error: "Email service not configured." });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@asivanta.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const attachments =
    quoteLines.length > 0
      ? [
          {
            filename: `${quoteId || "asivanta"}-quote-lines.csv`,
            content: Buffer.from(quoteLinesToCsv(quoteId, quoteLines)),
          },
        ]
      : [];

  const resend = new Resend(apiKey);
  const subjectPrefix =
    projectType === "Quote / RFQ Comparison"
      ? "New Asivanta Quote Request"
      : "New Asivanta Inquiry";
  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: `${subjectPrefix}${quoteId ? ` ${quoteId}` : ""} - ${company}`,
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

Submitted: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })} KST
Source: ASIVANTA Website`,
    ...(attachments.length > 0 ? { attachments } : {}),
  });

  if (sendError) {
    console.error("Inquiry email could not be sent.");
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

We received your information and will review the submitted part details. If anything is unclear, we will contact you before preparing the quote response.

ASIVANTA Advisory
contact@asivanta.com`,
    });
    if (ackError) {
      console.error("Customer acknowledgement could not be sent.");
    }
  }

  return res.status(200).json({ success: true });
}
