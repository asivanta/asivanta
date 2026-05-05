import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  PackageCheck,
  Plus,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

type Mode = "upload" | "build";

type QuoteLine = {
  id: number;
  category: string;
  manufacturer: string;
  customerPart: string;
  description: string;
  quantity: string;
  annualVolume: string;
  targetPrice: string;
  leadTime: string;
  bufferPercent: string;
  packaging: string;
  referenceDesignator: string;
  notes: string;
};

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const categories = [
  "Electronics",
  "Machined Parts",
  "Stamped Parts",
  "Plastic Parts",
  "Packaging",
  "Industrial Supplies",
  "Other",
];

const quoteTypes = [
  "Upload BOM / RFQ list",
  "Build part list",
  "Supplier quote comparison",
  "Spec sheet review",
];

const ALLOWED_EXTENSIONS = [".pdf", ".xlsx", ".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES = 2;
const MAX_TOTAL_SIZE = 14 * 1024 * 1024;
const MIN_MESSAGE = 30;
const DRAFT_KEY = "asivanta_instant_quote_draft";

function generateQuoteId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ASVQ-${stamp}-${random}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function cleanToken(value: string, fallback: string) {
  const token = value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 4);
  return token || fallback;
}

function checksum(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 46656;
  }
  return hash.toString(36).toUpperCase().padStart(3, "0");
}

function generatedAsivantaNumber(line: QuoteLine, index: number) {
  const category = cleanToken(line.category, "GEN");
  const maker = cleanToken(line.manufacturer, "OPEN");
  const customer = cleanToken(line.customerPart || line.description, "SPEC");
  const qty = Math.max(Number(line.quantity) || 1, 1)
    .toString(36)
    .toUpperCase();
  const check = checksum(
    `${line.category}-${line.manufacturer}-${line.customerPart}-${line.description}-${line.quantity}-${index}`,
  );
  return `ASV-${category}-${maker}-${customer}-${qty}-${check}`;
}

function emptyLine(id: number): QuoteLine {
  return {
    id,
    category: "Electronics",
    manufacturer: "",
    customerPart: "",
    description: "",
    quantity: "",
    annualVolume: "",
    targetPrice: "",
    leadTime: "",
    bufferPercent: "",
    packaging: "",
    referenceDesignator: "",
    notes: "",
  };
}

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#0F172A] outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15";

export default function InstantQuote() {
  const [quoteId, setQuoteId] = useState(() => generateQuoteId());
  const [mode, setMode] = useState<Mode>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [lines, setLines] = useState<QuoteLine[]>([emptyLine(1)]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    quoteType: "Upload BOM / RFQ list",
    destination: "",
    timeline: "",
    message: "",
  });

  const totalFileSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  const usableLines = useMemo(
    () =>
      lines.filter(
        (line) =>
          line.customerPart.trim() ||
          line.description.trim() ||
          line.quantity.trim() ||
          line.manufacturer.trim(),
      ),
    [lines],
  );

  const quoteCompleteness = useMemo(() => {
    const baseFields = [
      form.fullName,
      form.company,
      form.email,
      form.destination,
      form.timeline,
    ].filter((value) => value.trim()).length;
    const lineScore =
      mode === "upload"
        ? files.length > 0
          ? 2
          : 0
        : Math.min(usableLines.length, 2);
    return Math.round(((baseFields + lineScore) / 7) * 100);
  }, [files.length, form, mode, usableLines.length]);

  const previewLines = useMemo(
    () => (mode === "build" ? usableLines : []),
    [mode, usableLines],
  );

  const structuredQuoteLines = useMemo(
    () =>
      usableLines.map((line, index) => ({
        line: index + 1,
        asvPartNumber: generatedAsivantaNumber(line, index),
        category: line.category,
        manufacturer: line.manufacturer || "Open",
        customerPartNumber: line.customerPart,
        description: line.description,
        quantity: line.quantity,
        annualVolume: line.annualVolume,
        targetPrice: line.targetPrice,
        leadTime: line.leadTime,
        bufferPercent: line.bufferPercent,
        packaging: line.packaging,
        referenceDesignator: line.referenceDesignator,
        notes: line.notes,
      })),
    [usableLines],
  );

  const quoteRecord = useMemo(
    () => ({
      quoteId,
      source: "Instant Quote",
      mode: mode === "upload" ? "Upload List" : "Build List",
      quoteType: form.quoteType,
      readiness: quoteCompleteness,
      customer: {
        fullName: form.fullName.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      logistics: {
        destination: form.destination.trim(),
        timeline: form.timeline.trim(),
      },
      message: form.message.trim(),
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      lines: structuredQuoteLines,
      createdAt: new Date().toISOString(),
      adminStatus: "new",
    }),
    [files, form, mode, quoteCompleteness, quoteId, structuredQuoteLines],
  );

  const updateForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 2000) return;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateLine = (id: number, field: keyof QuoteLine, value: string) => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, [field]: value.slice(0, 180) } : line,
      ),
    );
  };

  const addLine = () => {
    setLines((current) =>
      current.length >= 12
        ? current
        : [...current, emptyLine(Math.max(...current.map((l) => l.id)) + 1)],
    );
  };

  const removeLine = (id: number) => {
    setLines((current) =>
      current.length === 1
        ? [emptyLine(1)]
        : current.filter((l) => l.id !== id),
    );
  };

  const parseBulkLines = () => {
    const rows = bulkText
      .split(/\r?\n/)
      .map((row) => row.trim())
      .filter(Boolean)
      .slice(0, 12);

    if (rows.length === 0) {
      setBulkMessage("Paste at least one line to add parts.");
      return;
    }

    const parsed = rows.map((row, index) => {
      const cells = row
        .split(/\t|,|;/)
        .map((cell) => cell.trim())
        .filter(Boolean);
      const [
        customerPart = "",
        quantity = "",
        description = "",
        manufacturer = "",
        targetPrice = "",
        leadTime = "",
        packaging = "",
      ] = cells;
      return {
        ...emptyLine(index + 1),
        customerPart: customerPart.slice(0, 180),
        quantity: quantity.replace(/[^0-9]/g, "").slice(0, 12),
        description: description.slice(0, 180),
        manufacturer: manufacturer.slice(0, 180),
        targetPrice: targetPrice.slice(0, 180),
        leadTime: leadTime.slice(0, 180),
        packaging: packaging.slice(0, 180),
      };
    });

    setMode("build");
    setLines(parsed.length > 0 ? parsed : [emptyLine(1)]);
    setBulkText("");
    setBulkMessage(
      `${parsed.length} part line${parsed.length === 1 ? "" : "s"} added.`,
    );
  };

  const exportAsvCsv = () => {
    if (usableLines.length === 0) {
      setBulkMessage("Add at least one part line before exporting.");
      return;
    }

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
      "Buffer %",
      "Packaging",
      "Reference Designator",
      "Notes",
    ];
    const rows = structuredQuoteLines.map((line) => [
      quoteId,
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
      line.bufferPercent,
      line.packaging,
      line.referenceDesignator,
      line.notes,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quoteId}-asv-lines.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadRfqTemplate = () => {
    const template = [
      [
        "Customer Part Number",
        "Quantity",
        "Description / Spec",
        "Manufacturer",
        "Target Price",
        "Lead Time Target",
        "Packaging",
        "Reference Designator",
        "Buffer %",
        "Annual Volume",
        "Notes",
      ],
      [
        "ABC-123",
        "1000",
        "Material, size, tolerance, finish, certification",
        "Preferred maker or Open",
        "USD target",
        "4 weeks",
        "Tape/reel, box, bulk, pallet",
        "R1 R2 C7 or assembly area",
        "5",
        "12000",
        "Sample need, alternates allowed, compliance needs",
      ],
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    downloadTextFile(
      "asivanta-rfq-template.csv",
      template,
      "text/csv;charset=utf-8",
    );
  };

  const buildQuotePacketText = () => {
    const lineSummary =
      structuredQuoteLines.length > 0
        ? structuredQuoteLines
            .map((line) =>
              [
                `${line.line}. ${line.asvPartNumber}`,
                `Customer Part: ${line.customerPartNumber || "Not provided"}`,
                `Description: ${line.description || "Not provided"}`,
                `Quantity: ${line.quantity || "Not provided"}`,
                `Annual Volume: ${line.annualVolume || "Not provided"}`,
                `Manufacturer: ${line.manufacturer || "Open"}`,
                `Target Price: ${line.targetPrice || "Not provided"}`,
                `Lead Time Target: ${line.leadTime || "Not provided"}`,
                `Buffer / Attrition: ${line.bufferPercent || "Not provided"}%`,
                `Packaging: ${line.packaging || "Not provided"}`,
                `Reference Designator: ${line.referenceDesignator || "Not provided"}`,
                `Notes: ${line.notes || "None"}`,
              ].join("\n"),
            )
            .join("\n\n")
        : "No built part lines. Uploaded files are the source list.";

    return `ASIVANTA INSTANT QUOTE PACKET
Quote ID: ${quoteId}
Mode: ${mode === "upload" ? "Upload List" : "Build List"}
Quote Type: ${form.quoteType}
Company: ${form.company || "Not provided"}
Contact: ${form.fullName || "Not provided"}
Email: ${form.email || "Not provided"}
Destination: ${form.destination || "Not provided"}
Timeline: ${form.timeline || "Not provided"}
Readiness: ${quoteCompleteness}%

CUSTOMER NOTES
${form.message || "Not provided"}

ASV LINE DATA
${lineSummary}

FILES
${files.length > 0 ? files.map((file) => `${file.name} (${formatFileSize(file.size)})`).join("\n") : "None attached in browser"}
`;
  };

  const downloadQuotePacket = () => {
    downloadTextFile(
      `${quoteId}-quote-packet.txt`,
      buildQuotePacketText(),
      "text/plain;charset=utf-8",
    );
  };

  const copyAsvNumbers = async () => {
    if (structuredQuoteLines.length === 0) {
      setCopyMessage("Add at least one part line before copying.");
      return;
    }
    const value = structuredQuoteLines
      .map(
        (line) =>
          `${line.asvPartNumber}\t${line.customerPartNumber}\t${line.quantity}`,
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(
        `${structuredQuoteLines.length} ASV number${structuredQuoteLines.length === 1 ? "" : "s"} copied.`,
      );
    } catch {
      setCopyMessage("Copy was blocked by the browser. Export CSV instead.");
    }
  };

  const saveDraft = () => {
    const draft = {
      quoteId,
      mode,
      form,
      lines,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setDraftMessage("Draft saved on this browser.");
  };

  const restoreDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      setDraftMessage("No saved draft found on this browser.");
      return;
    }
    try {
      const draft = JSON.parse(raw);
      if (draft.quoteId) setQuoteId(String(draft.quoteId));
      if (draft.mode === "upload" || draft.mode === "build")
        setMode(draft.mode);
      if (draft.form) setForm((current) => ({ ...current, ...draft.form }));
      if (Array.isArray(draft.lines) && draft.lines.length > 0) {
        setLines(draft.lines.slice(0, 12));
      }
      setDraftMessage(
        "Draft restored. Attached files must be reselected for browser security.",
      );
    } catch {
      setDraftMessage("Saved draft could not be restored.");
    }
  };

  const downloadQuoteRecord = () => {
    downloadTextFile(
      `${quoteId}-admin-record.json`,
      JSON.stringify(quoteRecord, null, 2),
      "application/json;charset=utf-8",
    );
  };

  const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selected = Array.from(e.target.files || []);
    if (selected.length + files.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    const newTotal =
      totalFileSize + selected.reduce((sum, file) => sum + file.size, 0);
    if (newTotal > MAX_TOTAL_SIZE) {
      setFileError(
        `Total upload size must stay under ${formatFileSize(MAX_TOTAL_SIZE)}.`,
      );
      return;
    }

    for (const file of selected) {
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setFileError("Allowed files: PDF, XLSX, PNG, JPG.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(
          `${file.name} exceeds the ${formatFileSize(MAX_FILE_SIZE)} limit.`,
        );
        return;
      }
    }

    setFiles((current) => [...current, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setFileError("");
  };

  const errorFor = (name: string) => {
    if (!touched[name]) return "";
    if (name === "fullName" && !form.fullName.trim()) return "Required.";
    if (name === "company" && !form.company.trim()) return "Required.";
    if (name === "email") {
      if (!form.email.trim()) return "Required.";
      if (!isValidEmail(form.email)) return "Enter a valid email.";
    }
    if (name === "quoteSource") {
      if (mode === "upload" && files.length === 0)
        return "Upload at least one file.";
      if (mode === "build" && usableLines.length === 0)
        return "Add at least one part line.";
    }
    if (name === "message" && form.message.trim().length < MIN_MESSAGE) {
      return `Add at least ${MIN_MESSAGE} characters.`;
    }
    return "";
  };

  const canSubmit =
    form.fullName.trim() &&
    form.company.trim() &&
    isValidEmail(form.email) &&
    form.message.trim().length >= MIN_MESSAGE &&
    (mode === "upload" ? files.length > 0 : usableLines.length > 0);

  const buildMessage = () => {
    const quoteLines =
      mode === "build"
        ? usableLines
            .map((line, index) => {
              return [
                `${index + 1}. ${generatedAsivantaNumber(line, index)}`,
                `Category: ${line.category}`,
                `Manufacturer: ${line.manufacturer || "Open"}`,
                `Customer Part: ${line.customerPart || "Not provided"}`,
                `Description: ${line.description || "Not provided"}`,
                `Quantity: ${line.quantity || "Not provided"}`,
                `Annual Volume: ${line.annualVolume || "Not provided"}`,
                `Target Price: ${line.targetPrice || "Not provided"}`,
                `Lead Time Target: ${line.leadTime || "Not provided"}`,
                `Buffer / Attrition: ${line.bufferPercent || "Not provided"}%`,
                `Packaging: ${line.packaging || "Not provided"}`,
                `Reference Designator: ${line.referenceDesignator || "Not provided"}`,
                `Notes: ${line.notes || "None"}`,
              ].join("\n");
            })
            .join("\n\n")
        : "Quote list uploaded as attachment.";

    return `INSTANT QUOTE REQUEST
Quote ID: ${quoteId}
Mode: ${mode === "upload" ? "Upload List" : "Build List"}
Quote Type: ${form.quoteType}
Destination: ${form.destination || "Not provided"}
Timeline: ${form.timeline || "Not provided"}
Quote Readiness: ${quoteCompleteness}%

CUSTOMER NOTES:
${form.message.trim()}

ASIVANTA GENERATED PART DATA:
${quoteLines}

NEXT INTERNAL STEP:
Match ASV numbers to internal pricing/spec table, generate PDF quote packet, and reply to customer.`;
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      company: true,
      email: true,
      quoteSource: true,
      message: true,
    });
    if (!canSubmit) return;

    setSubmitting(true);
    setServerError("");

    try {
      const nativeFormData = new FormData(e.currentTarget as HTMLFormElement);
      const formData = new FormData();
      formData.append(
        "_hp_field",
        String(nativeFormData.get("_hp_field") || ""),
      );
      formData.append("fullName", form.fullName.trim());
      formData.append("company", form.company.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("projectType", "Quote / RFQ Comparison");
      formData.append("quoteId", quoteId);
      formData.append("source", "Instant Quote");
      formData.append(
        "quoteMode",
        mode === "upload" ? "Upload List" : "Build List",
      );
      formData.append("quoteLinesJson", JSON.stringify(structuredQuoteLines));
      formData.append("quoteRecordJson", JSON.stringify(quoteRecord));
      formData.append("message", buildMessage());
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.error ||
            "Something went wrong while sending this quote request.",
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Something went wrong while sending this quote request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0F172A] font-sans">
      <Navbar />

      <section className="bg-[#0a1128] pt-32 md:pt-40 pb-12 text-white">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-blue-100/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-blue-400"></div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                    Instant Quote
                  </span>
                </div>
                <h1 className="max-w-4xl text-4xl font-light tracking-tight md:text-6xl">
                  Build a quote-ready sourcing list in minutes.
                </h1>
                <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-blue-100/75 md:text-lg">
                  Upload a BOM, RFQ, or spec sheet, or build a part list from
                  scratch. ASIVANTA converts the request into standardized ASV
                  part numbers for faster pricing and supplier comparison.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-100">
                    Quote {quoteId}
                  </span>
                  <span className="text-2xl font-semibold">
                    {quoteCompleteness}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all"
                    style={{ width: `${quoteCompleteness}%` }}
                  ></div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-blue-100/70">
                  <span>ASV numbers</span>
                  <span>File guardrails</span>
                  <span>PDF-ready packet</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-10">
        {submitted ? (
          <section className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_rgba(15,23,42,0.08)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight">
              Quote request received.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
              The request was sent to ASIVANTA with the generated ASV part data.
              Internal pricing can be matched to these numbers for the PDF quote
              packet.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/instant-quote">
                <Button
                  variant="outline"
                  className="h-11 rounded-full px-6"
                  onClick={() => {
                    setSubmitted(false);
                    setQuoteId(generateQuoteId());
                    setFiles([]);
                    setLines([emptyLine(1)]);
                    setBulkText("");
                    setBulkMessage("");
                    setForm({
                      fullName: "",
                      company: "",
                      email: "",
                      phone: "",
                      quoteType: "Upload BOM / RFQ list",
                      destination: "",
                      timeline: "",
                      message: "",
                    });
                  }}
                >
                  Start Another Quote
                </Button>
              </Link>
              <Link href="/">
                <Button className="h-11 rounded-full px-6">Return Home</Button>
              </Link>
            </div>
          </section>
        ) : (
          <form onSubmit={submitQuote} className="grid gap-8 lg:grid-cols-12">
            <input
              type="text"
              name="_hp_field"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <section className="lg:col-span-8">
              <div className="mb-5 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={`rounded-2xl border p-6 text-left transition-all ${
                    mode === "upload"
                      ? "border-blue-500 bg-white shadow-[0_8px_30px_rgba(37,99,235,0.12)]"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-medium tracking-tight">
                    Upload List
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Send a prepared BOM, RFQ sheet, supplier quote, or spec
                    packet.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("build")}
                  className={`rounded-2xl border p-6 text-left transition-all ${
                    mode === "build"
                      ? "border-blue-500 bg-white shadow-[0_8px_30px_rgba(37,99,235,0.12)]"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-medium tracking-tight">
                    Build List
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Enter part lines and generate ASV part numbers before
                    sending.
                  </p>
                </button>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_rgba(15,23,42,0.08)] md:p-8">
                <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-[#f8fafc] p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium">Draft tools</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Save long RFQs locally before submitting. Files must be
                      reselected after restore.
                    </p>
                    {draftMessage && (
                      <p className="mt-2 text-xs text-blue-700">
                        {draftMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
                      onClick={saveDraft}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
                      onClick={restoreDraft}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                  </div>
                </div>

                <div className="mb-7 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={updateForm}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, fullName: true }))
                      }
                      className={inputClass}
                      placeholder="Your full name"
                    />
                    {errorFor("fullName") && (
                      <p className="mt-1 text-xs text-red-500">
                        {errorFor("fullName")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Company
                    </label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={updateForm}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, company: true }))
                      }
                      className={inputClass}
                      placeholder="Company name"
                    />
                    {errorFor("company") && (
                      <p className="mt-1 text-xs text-red-500">
                        {errorFor("company")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateForm}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                    {errorFor("email") && (
                      <p className="mt-1 text-xs text-red-500">
                        {errorFor("email")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={updateForm}
                      className={inputClass}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Quote Type
                    </label>
                    <select
                      name="quoteType"
                      value={form.quoteType}
                      onChange={updateForm}
                      className={inputClass}
                    >
                      {quoteTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Destination
                      </label>
                      <input
                        name="destination"
                        value={form.destination}
                        onChange={updateForm}
                        className={inputClass}
                        placeholder="USA, EU, Korea..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Timeline
                      </label>
                      <input
                        name="timeline"
                        value={form.timeline}
                        onChange={updateForm}
                        className={inputClass}
                        placeholder="2 weeks, Q3..."
                      />
                    </div>
                  </div>
                </div>

                {mode === "upload" ? (
                  <div className="mb-7">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <label className="block text-sm font-medium">
                        Upload List
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-full px-4"
                        onClick={downloadRfqTemplate}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        RFQ Template
                      </Button>
                    </div>
                    <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#f8fafc] p-8 text-center transition-all hover:border-blue-300 hover:bg-blue-50/40">
                      <Upload className="mb-4 h-8 w-8 text-blue-500" />
                      <span className="text-sm font-medium">
                        Choose BOM, RFQ, quote, or spec file
                      </span>
                      <span className="mt-2 text-xs text-gray-400">
                        PDF, XLSX, PNG, JPG - max 2 files, 8MB each
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.xlsx,.png,.jpg,.jpeg"
                        multiple
                        onChange={selectFiles}
                        onBlur={() =>
                          setTouched((t) => ({ ...t, quoteSource: true }))
                        }
                      />
                    </label>
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="flex-1 truncate text-sm">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatFileSize(file.size)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                            >
                              <X className="h-3.5 w-3.5 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {(fileError || errorFor("quoteSource")) && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {fileError || errorFor("quoteSource")}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-7">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium">
                        Part Lines
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-full px-4"
                          onClick={copyAsvNumbers}
                          disabled={usableLines.length === 0}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy ASV
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-full px-4"
                          onClick={exportAsvCsv}
                          disabled={usableLines.length === 0}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export ASV CSV
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-full px-4"
                          onClick={addLine}
                          disabled={lines.length >= 12}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Part
                        </Button>
                      </div>
                    </div>
                    {copyMessage && (
                      <p className="mb-3 text-xs text-blue-700">
                        {copyMessage}
                      </p>
                    )}

                    <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium">Bulk Add</p>
                      </div>
                      <textarea
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                        placeholder="Paste rows: part number, quantity, description, manufacturer, target price, lead time, packaging"
                      />
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-gray-500">
                          Supports comma, tab, or semicolon separated rows. Max
                          12 lines.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-full px-4"
                          onClick={parseBulkLines}
                        >
                          Parse Into List
                        </Button>
                      </div>
                      {bulkMessage && (
                        <p className="mt-2 text-xs text-blue-700">
                          {bulkMessage}
                        </p>
                      )}
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                      <table className="min-w-[1580px] w-full border-collapse text-sm">
                        <thead className="bg-[#e9eef7] text-xs uppercase tracking-wide text-[#0F172A]">
                          <tr>
                            <th className="w-12 px-3 py-3 text-left">#</th>
                            <th className="px-3 py-3 text-left">Category</th>
                            <th className="px-3 py-3 text-left">Maker</th>
                            <th className="px-3 py-3 text-left">
                              Customer Part #
                            </th>
                            <th className="px-3 py-3 text-left">Description</th>
                            <th className="px-3 py-3 text-left">Qty</th>
                            <th className="px-3 py-3 text-left">Annual</th>
                            <th className="px-3 py-3 text-left">Target</th>
                            <th className="px-3 py-3 text-left">Lead</th>
                            <th className="px-3 py-3 text-left">Buffer %</th>
                            <th className="px-3 py-3 text-left">Pack</th>
                            <th className="px-3 py-3 text-left">Ref Des</th>
                            <th className="px-3 py-3 text-left">Notes</th>
                            <th className="w-12 px-3 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {lines.map((line, index) => (
                            <tr
                              key={line.id}
                              className="border-t border-gray-200"
                            >
                              <td className="px-3 py-3 text-gray-400">
                                {index + 1}
                              </td>
                              <td className="px-3 py-3">
                                <select
                                  value={line.category}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "category",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-36 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                >
                                  {categories.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.manufacturer}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "manufacturer",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-32 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="Maker"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.customerPart}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "customerPart",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-40 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="Part number"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.description}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-56 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="Specs, material, size"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.quantity}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "quantity",
                                      e.target.value.replace(/[^0-9]/g, ""),
                                    )
                                  }
                                  className="h-10 w-24 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="1000"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.annualVolume}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "annualVolume",
                                      e.target.value.replace(/[^0-9]/g, ""),
                                    )
                                  }
                                  className="h-10 w-24 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="12000"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.targetPrice}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "targetPrice",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-28 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="$ / unit"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.leadTime}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "leadTime",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-28 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="4 weeks"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.bufferPercent}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "bufferPercent",
                                      e.target.value.replace(/[^0-9.]/g, ""),
                                    )
                                  }
                                  className="h-10 w-24 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="5"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.packaging}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "packaging",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-28 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="Bulk"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.referenceDesignator}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "referenceDesignator",
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 w-32 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="R1 C4"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  value={line.notes}
                                  onChange={(e) =>
                                    updateLine(line.id, "notes", e.target.value)
                                  }
                                  className="h-10 w-36 rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-400"
                                  placeholder="Alt, cert, sample"
                                />
                              </td>
                              <td className="px-3 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeLine(line.id)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-[#f8fafc] p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Attach spec sheet or drawing
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Optional PDF, XLSX, PNG, or JPG support files
                          </p>
                        </div>
                        {files.length < MAX_FILES && (
                          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium transition-colors hover:border-blue-300 hover:text-blue-600">
                            <Upload className="mr-2 h-4 w-4" />
                            Add File
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept=".pdf,.xlsx,.png,.jpg,.jpeg"
                              multiple
                              onChange={selectFiles}
                            />
                          </label>
                        )}
                      </div>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                            >
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="flex-1 truncate text-sm">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatFileSize(file.size)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                              >
                                <X className="h-3.5 w-3.5 text-gray-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {fileError && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {fileError}
                        </p>
                      )}
                    </div>
                    {errorFor("quoteSource") && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errorFor("quoteSource")}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quote Notes
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={updateForm}
                    onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                    placeholder="Share what matters: target price, equivalent parts, annual volume, sample needs, drawings/spec concerns, certification needs, destination, and urgency."
                  />
                  <div className="mt-2 flex items-center justify-between">
                    {errorFor("message") ? (
                      <p className="text-xs text-red-500">
                        {errorFor("message")}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Internal pricing table can be matched after submission.
                      </p>
                    )}
                    <span className="text-xs text-gray-400">
                      {form.message.length} / 2000
                    </span>
                  </div>
                </div>

                {serverError && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {serverError}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-12 rounded-full px-7"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Instant Quote Request
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full px-7"
                    onClick={downloadQuotePacket}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Packet
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full px-7"
                    onClick={downloadQuoteRecord}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Admin JSON
                  </Button>
                  <Link href="/contact">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full px-7"
                    >
                      Ask Advisory First
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-4">
              <div className="space-y-5 lg:sticky lg:top-28">
                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_rgba(15,23,42,0.08)]">
                  <div className="mb-5 flex items-center gap-3">
                    <PackageCheck className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium tracking-tight">
                      ASV Part Number Preview
                    </h3>
                  </div>
                  <div className="mb-4 rounded-xl border border-gray-100 bg-[#f8fafc] p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Quote ID
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold">
                      {quoteId}
                    </p>
                  </div>
                  {previewLines.length > 0 ? (
                    <div className="space-y-3">
                      {previewLines.slice(0, 5).map((line, index) => (
                        <div
                          key={line.id}
                          className="rounded-xl border border-gray-100 bg-[#f8fafc] p-4"
                        >
                          <p className="font-mono text-sm font-semibold text-[#0F172A]">
                            {generatedAsivantaNumber(line, index)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {line.description ||
                              line.customerPart ||
                              "Part line"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-[#f8fafc] p-5 text-sm text-gray-500">
                      ASV numbers appear after part lines are added.
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium tracking-tight">
                      Upload Guardrails
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {[
                      "Only PDF, XLSX, PNG, JPG files accepted",
                      "Maximum 2 files and 8MB per file",
                      "Total upload size capped below server limit",
                      "Server revalidates file count, size, and extension",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#0a1128] p-6 text-white">
                  <h3 className="font-medium tracking-tight">
                    Quote Packet Flow
                  </h3>
                  <div className="mt-5 space-y-4 text-sm text-blue-100/75">
                    {[
                      "Customer list intake",
                      "ASV standard part number generation",
                      "Internal price/spec matching",
                      "PDF quote packet reply",
                    ].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-blue-300">
                    Ready for internal pricing data
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </aside>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
