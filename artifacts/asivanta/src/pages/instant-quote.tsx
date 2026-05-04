import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  PackageCheck,
  Plus,
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
  targetPrice: string;
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
    targetPrice: "",
    notes: "",
  };
}

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#0F172A] outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15";

export default function InstantQuote() {
  const [mode, setMode] = useState<Mode>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
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
                `Target Price: ${line.targetPrice || "Not provided"}`,
                `Notes: ${line.notes || "None"}`,
              ].join("\n");
            })
            .join("\n\n")
        : "Quote list uploaded as attachment.";

    return `INSTANT QUOTE REQUEST
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
      const formData = new FormData();
      formData.append("fullName", form.fullName.trim());
      formData.append("company", form.company.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("projectType", "Quote / RFQ Comparison");
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
                    Quote readiness
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
                    setFiles([]);
                    setLines([emptyLine(1)]);
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
                    <label className="mb-2 block text-sm font-medium">
                      Upload List
                    </label>
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

                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                      <table className="min-w-[980px] w-full border-collapse text-sm">
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
                            <th className="px-3 py-3 text-left">Target</th>
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
