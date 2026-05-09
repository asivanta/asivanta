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
  Cpu,
  Download,
  FileSpreadsheet,
  FileText,
  Gauge,
  HelpCircle,
  Loader2,
  PackageCheck,
  Plus,
  RadioReceiver,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  Upload,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

type Mode = "guided" | "upload" | "build";
type ProductFamily =
  | "ats"
  | "smdCrystal"
  | "smdOscillator"
  | "vcxo"
  | "tcxo"
  | "tuningFork"
  | "other";

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
  sourceCatalog: string;
  family: string;
  packageType: string;
  frequency: string;
  supplierPartNumber: string;
  spec: string;
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
  "Guided component quote",
  "Upload BOM / RFQ list",
  "Build part list",
  "Supplier quote comparison",
  "Spec sheet review",
];

const guidedFamilies = [
  {
    id: "ats" as ProductFamily,
    name: "ATS-type",
    summary:
      "Lead crystal and ATS SMD paths for legacy or industrial programs.",
    icon: Cpu,
  },
  {
    id: "smdCrystal" as ProductFamily,
    name: "SMD crystal",
    summary:
      "MHz crystal units such as SX-21, SX-32, SX-8, and automotive variants.",
    icon: Gauge,
  },
  {
    id: "smdOscillator" as ProductFamily,
    name: "SMD oscillator",
    summary:
      "XO / SPXO timing modules with voltage, stability, and output options.",
    icon: Timer,
  },
  {
    id: "vcxo" as ProductFamily,
    name: "VCXO",
    summary:
      "Voltage controlled oscillator RFQs with pulling/deviation review.",
    icon: Waves,
  },
  {
    id: "tcxo" as ProductFamily,
    name: "TCXO",
    summary:
      "Temperature compensated oscillator requests for tighter stability.",
    icon: ShieldCheck,
  },
  {
    id: "tuningFork" as ProductFamily,
    name: "T/F tuning fork",
    summary: "32.768 kHz clock crystal packages such as CS-2012 and CS-3215.",
    icon: RadioReceiver,
  },
  {
    id: "other" as ProductFamily,
    name: "Not sure",
    summary:
      "Start with partial information and ASIVANTA will route the review.",
    icon: HelpCircle,
  },
];

const packageOptions: Record<
  ProductFamily,
  { label: string; code: string; hint: string }[]
> = {
  ats: [
    { label: "ATS-25/U", code: "C", hint: "Lead crystal" },
    { label: "ATS-49/U", code: "D", hint: "Common through-hole" },
    { label: "SX-1", code: "J", hint: "ATS SMD" },
    { label: "SX-3", code: "K", hint: "Low-profile ATS SMD" },
  ],
  smdCrystal: [
    { label: "SX-7", code: "M", hint: "7.0 x 5.0 mm" },
    { label: "SX-8", code: "O", hint: "5.0 x 3.2 mm" },
    { label: "SX-32", code: "P", hint: "3.2 x 2.5 mm" },
    { label: "SX-22", code: "Q", hint: "2.5 x 2.0 mm" },
    { label: "SX-21", code: "R", hint: "2.0 x 1.6 mm" },
    { label: "SX-16", code: "S", hint: "1.6 x 1.2 mm" },
    { label: "SX-A21", code: "T", hint: "Automotive 2.0 x 1.6" },
    { label: "SX-A22", code: "U", hint: "Automotive 2.5 x 2.0" },
    { label: "SX-A32", code: "V", hint: "Automotive 3.2 x 2.5" },
    { label: "SX-A8", code: "W", hint: "Automotive 5.0 x 3.2" },
  ],
  smdOscillator: [
    { label: "SCO-10", code: "SCO-10", hint: "XO / SPXO" },
    { label: "SCO-32", code: "SCO-32", hint: "XO / SPXO" },
    { label: "SCO-53", code: "SCO-53", hint: "XO / SPXO" },
    { label: "SCO-22", code: "SCO-22", hint: "Compact XO" },
    { label: "SCO-06", code: "SCO-06", hint: "Compact XO" },
  ],
  vcxo: [{ label: "SVH", code: "SVH", hint: "VCXO review path" }],
  tcxo: [
    { label: "STA", code: "STA", hint: "TCXO / VCTCXO" },
    { label: "STV", code: "STV", hint: "VCTCXO review path" },
  ],
  tuningFork: [
    { label: "CS-306", code: "TC", hint: "32.768 kHz" },
    { label: "CS-519", code: "TJ", hint: "32.768 kHz" },
    { label: "CS-146", code: "TK", hint: "32.768 kHz" },
    { label: "CS-3215", code: "TL", hint: "32.768 kHz" },
    { label: "CS-2012", code: "TM", hint: "32.768 kHz" },
    { label: "CS-1610", code: "TN", hint: "32.768 kHz" },
    { label: "CS-406", code: "TD", hint: "32.768 kHz" },
    { label: "CS-405", code: "TF", hint: "32.768 kHz" },
  ],
  other: [{ label: "Review needed", code: "OPEN", hint: "ASIVANTA routes it" }],
};

const loadCapacitanceOptions = [
  "06",
  "07",
  "08",
  "09",
  "10",
  "12",
  "16",
  "18",
  "20",
  "30",
];
const toleranceOptions = ["10", "15", "20", "30", "50"];
const tempOptions = [
  { code: "D", label: "-10~70C" },
  { code: "E", label: "-20~70C" },
  { code: "G", label: "-20~85C" },
  { code: "J", label: "-40~85C" },
  { code: "L", label: "-40~105C" },
  { code: "M", label: "-40~125C" },
];
const stabilityOptions = [
  { code: "3", label: "+/-10ppm" },
  { code: "4", label: "+/-15ppm" },
  { code: "5", label: "+/-20ppm" },
  { code: "6", label: "+/-30ppm" },
  { code: "7", label: "+/-50ppm" },
  { code: "8", label: "+/-100ppm" },
];
const voltageOptions = [
  { code: "18", label: "1.8 V" },
  { code: "25", label: "2.5 V" },
  { code: "33", label: "3.3 V" },
  { code: "50", label: "5.0 V" },
];

const oscillatorStabilityOptions = [
  { code: "25", label: "+/-25ppm" },
  { code: "50", label: "+/-50ppm" },
  { code: "100", label: "+/-100ppm" },
];

const oscillatorTempOptions = [
  { code: "A", label: "-10~70C" },
  { code: "B", label: "-40~85C" },
  { code: "C", label: "-40~105C" },
];

const outputOptions = [
  { code: "M", label: "CMOS" },
  { code: "C", label: "Clipped sine" },
  { code: "L", label: "LVDS / review" },
];

const pullingOptions = [
  { code: "5", label: "+/-5ppm" },
  { code: "8", label: "+/-8ppm" },
  { code: "10", label: "+/-10ppm" },
];

const tuningForkCapacitanceOptions = [
  { code: "125", label: "12.5 pF" },
  { code: "90", label: "9.0 pF" },
  { code: "70", label: "7.0 pF" },
];

const tuningForkTempOptions = [
  { code: "A", label: "-10~60C" },
  { code: "B", label: "-40~85C" },
];

const crystalCatalogSpecs = {
  frequencyRange: "8.000 to 54.000 MHz",
  temperatureRange: "-40 to +105C / -40 to +125C",
  tolerance: "+/-15, +/-30, +/-50ppm standard",
  stability: "+/-30 to +/-100ppm, or +/-50 to +/-100ppm at wider temp",
  loadCapacitance: "18 pF standard; custom CL >= 10 pF or series resonant",
  driveLevel: "10 uW typical, 100 uW max",
  aging: "+/-5 ppm/year max",
};

const crystalEsrBands = [
  { min: 8, max: 9.999, esr: "100 ohm max" },
  { min: 10, max: 11.999, esr: "70 ohm max" },
  { min: 12, max: 14.999, esr: "70 ohm max" },
  { min: 15, max: 19.999, esr: "60 ohm max" },
  { min: 20, max: 34.999, esr: "50 ohm max" },
  { min: 35, max: 43.999, esr: "40 ohm max" },
  { min: 44, max: 54, esr: "40 ohm max" },
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

function formatMHz(value: string, digits = 4) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return digits === 3 ? "0.000" : "0.0000";
  }
  return parsed.toFixed(digits);
}

function formatKHz(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) return "32.768";
  return parsed.toFixed(3);
}

function modeLabel(mode: Mode) {
  if (mode === "guided") return "Quote Now Builder";
  if (mode === "upload") return "Upload List";
  return "Build List";
}

function optionLabel(
  items: { code: string; label: string }[],
  code: string,
  fallback = code,
) {
  return items.find((option) => option.code === code)?.label || fallback;
}

function voltageLabel(code: string) {
  return optionLabel(voltageOptions, code, `${code} V`);
}

function cleanQuantity(value: string) {
  return value.replace(/[^0-9]/g, "").slice(0, 12);
}

function numberFromSpec(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function crystalEsrLabel(frequency: string) {
  const mhz = numberFromSpec(frequency);
  const band = crystalEsrBands.find(
    (range) => mhz >= range.min && mhz <= range.max,
  );
  return band ? band.esr : "ESR needs catalog review";
}

function catalogRangeNote(family: ProductFamily, frequency: string) {
  if (family === "ats" || family === "smdCrystal") {
    const mhz = numberFromSpec(frequency);
    if (mhz > 0 && (mhz < 8 || mhz > 54)) {
      return "Frequency outside 8.000-54.000 MHz crystal catalog range; ASIVANTA will review.";
    }
    return `Catalog guide: ${crystalCatalogSpecs.frequencyRange}, ${crystalEsrLabel(frequency)}, fundamental mode.`;
  }
  if (family === "tuningFork") {
    return "Catalog guide: 32.768 kHz tuning fork package path.";
  }
  if (family === "other") {
    return "Catalog guide: ASIVANTA will identify the closest supplier/spec path.";
  }
  return "Catalog guide: oscillator path requires voltage, output, stability, and package review.";
}

function ppmLabel(code: string) {
  return stabilityOptions.find((option) => option.code === code)?.label || code;
}

function tempLabel(code: string) {
  return tempOptions.find((option) => option.code === code)?.label || code;
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
    sourceCatalog: "",
    family: "",
    packageType: "",
    frequency: "",
    supplierPartNumber: "",
    spec: "",
    notes: "",
  };
}

function quoteLineHasData(line: QuoteLine) {
  return Boolean(
    line.customerPart.trim() ||
    line.description.trim() ||
    line.quantity.trim() ||
    line.manufacturer.trim() ||
    line.supplierPartNumber.trim(),
  );
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
  const [mode, setMode] = useState<Mode>("guided");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [guidedMessage, setGuidedMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [lines, setLines] = useState<QuoteLine[]>([emptyLine(1)]);
  const [guidedFamily, setGuidedFamily] = useState<ProductFamily>("ats");
  const [guidedPackage, setGuidedPackage] = useState("D");
  const [guidedFrequency, setGuidedFrequency] = useState("25");
  const [guidedQuantity, setGuidedQuantity] = useState("1000");
  const [guidedAnnualVolume, setGuidedAnnualVolume] = useState("");
  const [guidedCapacitance, setGuidedCapacitance] = useState("12");
  const [guidedTolerance, setGuidedTolerance] = useState("30");
  const [guidedTemperature, setGuidedTemperature] = useState("J");
  const [guidedStability, setGuidedStability] = useState("6");
  const [guidedModeCode, setGuidedModeCode] = useState("1");
  const [guidedVoltage, setGuidedVoltage] = useState("33");
  const [guidedOscStability, setGuidedOscStability] = useState("50");
  const [guidedOscTemp, setGuidedOscTemp] = useState("B");
  const [guidedOutput, setGuidedOutput] = useState("M");
  const [guidedPulling, setGuidedPulling] = useState("5");
  const [guidedReference, setGuidedReference] = useState("");
  const [guidedNote, setGuidedNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    quoteType: "Guided component quote",
    destination: "",
    timeline: "",
    message: "",
  });

  const totalFileSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  const usableLines = useMemo(
    () => lines.filter((line) => quoteLineHasData(line)),
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
    () => (mode === "upload" ? [] : usableLines),
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
        sourceCatalog: line.sourceCatalog,
        family: line.family,
        packageType: line.packageType,
        frequency: line.frequency,
        supplierPartNumber: line.supplierPartNumber,
        spec: line.spec,
        notes: line.notes,
      })),
    [usableLines],
  );

  const quoteRecord = useMemo(
    () => ({
      quoteId,
      source: "Quote Now",
      mode: modeLabel(mode),
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

  const selectedGuidedFamily = useMemo(
    () =>
      guidedFamilies.find((family) => family.id === guidedFamily) ||
      guidedFamilies[0],
    [guidedFamily],
  );

  const selectedGuidedPackage = useMemo(
    () =>
      packageOptions[guidedFamily].find(
        (option) => option.code === guidedPackage,
      ) || packageOptions[guidedFamily][0],
    [guidedFamily, guidedPackage],
  );

  const isCrystalGuide =
    guidedFamily === "ats" || guidedFamily === "smdCrystal";
  const isOscillatorGuide =
    guidedFamily === "smdOscillator" ||
    guidedFamily === "vcxo" ||
    guidedFamily === "tcxo";
  const isTuningForkGuide = guidedFamily === "tuningFork";

  const frequencyPresets = useMemo(() => {
    if (guidedFamily === "tuningFork") return ["32.768"];
    if (guidedFamily === "vcxo" || guidedFamily === "tcxo") {
      return ["10", "12.8", "19.2", "20", "24.576", "26", "38.4"];
    }
    return ["12", "16", "24", "25", "26", "27", "32", "40"];
  }, [guidedFamily]);

  const guidedPartNumber = useMemo(() => {
    if (isCrystalGuide) {
      return `S${guidedPackage}${guidedCapacitance}${guidedModeCode}${guidedTolerance}${guidedTemperature}${guidedStability}-${formatMHz(guidedFrequency)}`;
    }
    if (isTuningForkGuide) {
      return `S${guidedPackage}${guidedCapacitance}20${guidedTemperature}-${formatKHz(guidedFrequency)}-TR`;
    }
    if (guidedFamily === "smdOscillator") {
      return `${guidedPackage}${guidedVoltage}${guidedOscStability}${guidedOscTemp}DSR${formatMHz(guidedFrequency, 3)}M`;
    }
    if (guidedFamily === "vcxo") {
      return `SVH${guidedVoltage}30GDDER${formatMHz(guidedFrequency, 3)}M`;
    }
    if (guidedFamily === "tcxo") {
      return `${guidedPackage}${guidedVoltage}20J${guidedOutput}${guidedPulling}R${formatMHz(guidedFrequency, 3)}M`;
    }
    return `ASV-REVIEW-${checksum(
      `${selectedGuidedFamily.name}-${guidedFrequency}-${guidedNote}`,
    )}`;
  }, [
    guidedCapacitance,
    guidedFamily,
    guidedFrequency,
    guidedModeCode,
    guidedNote,
    guidedOscStability,
    guidedOscTemp,
    guidedOutput,
    guidedPackage,
    guidedPulling,
    guidedStability,
    guidedTemperature,
    guidedTolerance,
    guidedVoltage,
    isCrystalGuide,
    isTuningForkGuide,
    selectedGuidedFamily.name,
  ]);

  const guidedFrequencyDisplay = isTuningForkGuide
    ? `${formatKHz(guidedFrequency)} kHz`
    : `${formatMHz(guidedFrequency, isOscillatorGuide ? 3 : 4)} MHz`;

  const guidedSpecSummary = useMemo(() => {
    const base = [
      selectedGuidedFamily.name,
      selectedGuidedPackage.label,
      guidedFrequencyDisplay,
    ];
    if (isCrystalGuide) {
      base.push(
        `CL ${guidedCapacitance} pF`,
        `Tolerance +/-${guidedTolerance}ppm`,
        `Stability ${ppmLabel(guidedStability)}`,
        `Temp ${tempLabel(guidedTemperature)}`,
        `ESR ${crystalEsrLabel(guidedFrequency)}`,
      );
    } else if (isTuningForkGuide) {
      base.push(
        `CL ${optionLabel(tuningForkCapacitanceOptions, guidedCapacitance)}`,
        `Temp ${optionLabel(tuningForkTempOptions, guidedTemperature)}`,
      );
    } else if (isOscillatorGuide) {
      base.push(
        `Voltage ${voltageLabel(guidedVoltage)}`,
        `Stability ${optionLabel(oscillatorStabilityOptions, guidedOscStability)}`,
        `Temp ${optionLabel(oscillatorTempOptions, guidedOscTemp)}`,
      );
      if (guidedFamily === "tcxo") {
        base.push(
          `Output ${optionLabel(outputOptions, guidedOutput)}`,
          `Pulling ${optionLabel(pullingOptions, guidedPulling)}`,
        );
      }
    } else {
      base.push("ASIVANTA review required");
    }
    base.push(catalogRangeNote(guidedFamily, guidedFrequency));
    return base.join(" | ");
  }, [
    guidedCapacitance,
    guidedFamily,
    guidedFrequencyDisplay,
    guidedOscStability,
    guidedOscTemp,
    guidedOutput,
    guidedPulling,
    guidedStability,
    guidedTemperature,
    guidedTolerance,
    guidedVoltage,
    isCrystalGuide,
    isOscillatorGuide,
    isTuningForkGuide,
    selectedGuidedFamily.name,
    selectedGuidedPackage.label,
  ]);

  const selectGuidedFamily = (family: ProductFamily) => {
    setGuidedFamily(family);
    setGuidedPackage(packageOptions[family][0].code);
    setGuidedMessage("");
    if (family === "tuningFork") {
      setGuidedFrequency("32.768");
      setGuidedCapacitance("125");
      setGuidedTemperature("B");
    } else if (family === "ats" || family === "smdCrystal") {
      setGuidedFrequency("25");
      setGuidedCapacitance("12");
      setGuidedTemperature("J");
    } else if (family === "other") {
      setGuidedFrequency("");
    } else {
      setGuidedFrequency("25");
      setGuidedTemperature("J");
    }
  };

  const addGuidedLine = () => {
    if (usableLines.length >= 12) {
      setGuidedMessage("Maximum 12 quote lines for one request.");
      return;
    }
    const quantity = cleanQuantity(guidedQuantity) || "1";
    const nextLine: QuoteLine = {
      ...emptyLine(Date.now()),
      category: "Electronics",
      manufacturer: "Sunny Electronics / Open market",
      customerPart: guidedPartNumber,
      description: `${selectedGuidedFamily.name} ${selectedGuidedPackage.label} ${guidedFrequencyDisplay}`,
      quantity,
      annualVolume: cleanQuantity(guidedAnnualVolume),
      packaging:
        guidedFamily === "ats" || guidedFamily === "other"
          ? "Review needed"
          : "Tape and reel",
      referenceDesignator: guidedReference,
      sourceCatalog: "Sunny frequency-control reference",
      family: selectedGuidedFamily.name,
      packageType: selectedGuidedPackage.label,
      frequency: guidedFrequencyDisplay,
      supplierPartNumber: guidedPartNumber,
      spec: guidedSpecSummary,
      notes: ["Guided Quote Now builder", guidedSpecSummary, guidedNote.trim()]
        .filter(Boolean)
        .join(" | "),
    };
    setLines((current) => {
      const existing = current.filter((line) => quoteLineHasData(line));
      return [...existing, nextLine].slice(0, 12);
    });
    setForm((current) => ({
      ...current,
      quoteType: "Guided component quote",
    }));
    setGuidedMessage(`${guidedPartNumber} added to the quote list.`);
    setTouched((current) => ({ ...current, quoteSource: true }));
  };

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
      "Source Catalog",
      "Family",
      "Package",
      "Frequency",
      "Supplier Part Number",
      "Generated Spec",
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
      line.sourceCatalog,
      line.family,
      line.packageType,
      line.frequency,
      line.supplierPartNumber,
      line.spec,
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
        "Known Specs",
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
        "Package, frequency, voltage, tolerance, stability",
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
                `Catalog Source: ${line.sourceCatalog || "Not provided"}`,
                `Family / Package: ${line.family || "Not provided"} / ${line.packageType || "Not provided"}`,
                `Frequency: ${line.frequency || "Not provided"}`,
                `Supplier Part: ${line.supplierPartNumber || "Not provided"}`,
                `Generated Spec: ${line.spec || "Not provided"}`,
                `Notes: ${line.notes || "None"}`,
              ].join("\n"),
            )
            .join("\n\n")
        : "No built part lines. Uploaded files are the source list.";

    return `ASIVANTA QUOTE NOW PACKET
Quote ID: ${quoteId}
Mode: ${modeLabel(mode)}
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
      if (
        draft.mode === "guided" ||
        draft.mode === "upload" ||
        draft.mode === "build"
      )
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
      if (mode !== "upload" && usableLines.length === 0)
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
      mode !== "upload"
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
                `Catalog Source: ${line.sourceCatalog || "Not provided"}`,
                `Family / Package: ${line.family || "Not provided"} / ${line.packageType || "Not provided"}`,
                `Frequency: ${line.frequency || "Not provided"}`,
                `Supplier Part: ${line.supplierPartNumber || "Not provided"}`,
                `Generated Spec: ${line.spec || "Not provided"}`,
                `Notes: ${line.notes || "None"}`,
              ].join("\n");
            })
            .join("\n\n")
        : "Quote list uploaded as attachment.";

    return `QUOTE NOW REQUEST
Quote ID: ${quoteId}
Mode: ${modeLabel(mode)}
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
      formData.append("source", "Quote Now");
      formData.append("quoteMode", modeLabel(mode));
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
                    Quote Now
                  </span>
                </div>
                <h1 className="max-w-4xl text-4xl font-light tracking-tight md:text-6xl">
                  Build a quote-ready part request in minutes.
                </h1>
                <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-blue-100/75 md:text-lg">
                  Start with one guided component path, upload a BOM, or build a
                  list manually. ASIVANTA turns partial specs into cleaner RFQ
                  data for faster pricing and supplier comparison.
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
                  <span>Guided specs</span>
                  <span>Upload guardrails</span>
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
                      quoteType: "Guided component quote",
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
              <div className="mb-5 grid gap-4 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("guided");
                    setForm((current) => ({
                      ...current,
                      quoteType: "Guided component quote",
                    }));
                  }}
                  className={`rounded-2xl border p-6 text-left transition-all ${
                    mode === "guided"
                      ? "border-blue-500 bg-white shadow-[0_8px_30px_rgba(37,99,235,0.12)]"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-medium tracking-tight">
                    Quote Now
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Choose a component family, package, frequency, and specs
                    with guided options.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("upload");
                    setForm((current) => ({
                      ...current,
                      quoteType: "Upload BOM / RFQ list",
                    }));
                  }}
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
                  onClick={() => {
                    setMode("build");
                    setForm((current) => ({
                      ...current,
                      quoteType: "Build part list",
                    }));
                  }}
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

                {mode === "guided" ? (
                  <div className="mb-7 space-y-6">
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <label className="block text-sm font-medium">
                          Start with one component family
                        </label>
                        <span className="text-xs text-gray-400">
                          Sunny catalog reference, ASIVANTA review
                        </span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {guidedFamilies.map((family) => {
                          const Icon = family.icon;
                          const active = guidedFamily === family.id;
                          return (
                            <button
                              type="button"
                              key={family.id}
                              onClick={() => selectGuidedFamily(family.id)}
                              className={`group rounded-2xl border p-4 text-left transition-all ${
                                active
                                  ? "border-blue-500 bg-blue-50 shadow-[0_8px_24px_rgba(37,99,235,0.12)]"
                                  : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                              }`}
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    active ? "bg-blue-600" : "bg-gray-100"
                                  }`}
                                >
                                  <Icon
                                    className={`h-5 w-5 ${
                                      active ? "text-white" : "text-blue-600"
                                    }`}
                                  />
                                </span>
                                <ArrowRight
                                  className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                                    active ? "text-blue-600" : "text-gray-300"
                                  }`}
                                />
                              </div>
                              <p className="text-sm font-semibold text-[#0F172A]">
                                {family.name}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                {family.summary}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {selectedGuidedFamily.name} option path
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-gray-500">
                            Choose what the customer knows. Unknown details can
                            stay in the note for ASIVANTA review.
                          </p>
                        </div>
                        <div className="rounded-full border border-blue-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-blue-700">
                          {guidedPartNumber}
                        </div>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Package
                            </label>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {packageOptions[guidedFamily].map((option) => (
                                <button
                                  type="button"
                                  key={option.code}
                                  onClick={() => setGuidedPackage(option.code)}
                                  className={`rounded-xl border px-3 py-3 text-left transition-all ${
                                    guidedPackage === option.code
                                      ? "border-blue-500 bg-white text-blue-700 shadow-sm"
                                      : "border-gray-200 bg-white/70 text-gray-700 hover:border-blue-200"
                                  }`}
                                >
                                  <span className="block text-sm font-semibold">
                                    {option.label}
                                  </span>
                                  <span className="mt-0.5 block text-xs text-gray-400">
                                    {option.hint}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Frequency
                              </label>
                              <input
                                value={guidedFrequency}
                                onChange={(e) =>
                                  setGuidedFrequency(
                                    e.target.value.replace(/[^0-9.]/g, ""),
                                  )
                                }
                                className={inputClass}
                                placeholder={
                                  isTuningForkGuide ? "32.768" : "25"
                                }
                              />
                              <p className="mt-1 text-xs text-gray-400">
                                {isTuningForkGuide ? "kHz" : "MHz"}
                              </p>
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Quantity
                              </label>
                              <input
                                value={guidedQuantity}
                                onChange={(e) =>
                                  setGuidedQuantity(
                                    cleanQuantity(e.target.value),
                                  )
                                }
                                className={inputClass}
                                placeholder="1000"
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Annual Volume
                              </label>
                              <input
                                value={guidedAnnualVolume}
                                onChange={(e) =>
                                  setGuidedAnnualVolume(
                                    cleanQuantity(e.target.value),
                                  )
                                }
                                className={inputClass}
                                placeholder="Optional"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {frequencyPresets.map((frequency) => (
                              <button
                                type="button"
                                key={frequency}
                                onClick={() => setGuidedFrequency(frequency)}
                                className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:border-blue-300"
                              >
                                {frequency} {isTuningForkGuide ? "kHz" : "MHz"}
                              </button>
                            ))}
                          </div>

                          {isCrystalGuide && (
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Load capacitance
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {loadCapacitanceOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option}
                                      onClick={() =>
                                        setGuidedCapacitance(option)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedCapacitance === option
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option} pF
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Mode
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    ["1", "Fundamental"],
                                    ["3", "3rd overtone"],
                                  ].map(([code, label]) => (
                                    <button
                                      type="button"
                                      key={code}
                                      onClick={() => setGuidedModeCode(code)}
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedModeCode === code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Tolerance
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {toleranceOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option}
                                      onClick={() => setGuidedTolerance(option)}
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedTolerance === option
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      +/-{option}ppm
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Stability
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {stabilityOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option.code}
                                      onClick={() =>
                                        setGuidedStability(option.code)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedStability === option.code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Temperature
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {tempOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option.code}
                                      onClick={() =>
                                        setGuidedTemperature(option.code)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedTemperature === option.code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {isTuningForkGuide && (
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Load capacitance
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {tuningForkCapacitanceOptions.map(
                                    (option) => (
                                      <button
                                        type="button"
                                        key={option.code}
                                        onClick={() =>
                                          setGuidedCapacitance(option.code)
                                        }
                                        className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                          guidedCapacitance === option.code
                                            ? "border-blue-500 bg-blue-600 text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                        }`}
                                      >
                                        {option.label}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Temperature
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {tuningForkTempOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option.code}
                                      onClick={() =>
                                        setGuidedTemperature(option.code)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedTemperature === option.code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {isOscillatorGuide && (
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Voltage
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {voltageOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option.code}
                                      onClick={() =>
                                        setGuidedVoltage(option.code)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedVoltage === option.code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Stability
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {oscillatorStabilityOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option.code}
                                      onClick={() =>
                                        setGuidedOscStability(option.code)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedOscStability === option.code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Temperature
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {oscillatorTempOptions.map((option) => (
                                    <button
                                      type="button"
                                      key={option.code}
                                      onClick={() =>
                                        setGuidedOscTemp(option.code)
                                      }
                                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                        guidedOscTemp === option.code
                                          ? "border-blue-500 bg-blue-600 text-white"
                                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {guidedFamily === "tcxo" && (
                                <>
                                  <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                      Output
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {outputOptions.map((option) => (
                                        <button
                                          type="button"
                                          key={option.code}
                                          onClick={() =>
                                            setGuidedOutput(option.code)
                                          }
                                          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                            guidedOutput === option.code
                                              ? "border-blue-500 bg-blue-600 text-white"
                                              : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                          }`}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                      Pulling
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {pullingOptions.map((option) => (
                                        <button
                                          type="button"
                                          key={option.code}
                                          onClick={() =>
                                            setGuidedPulling(option.code)
                                          }
                                          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                            guidedPulling === option.code
                                              ? "border-blue-500 bg-blue-600 text-white"
                                              : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                          }`}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-white bg-white p-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Generated request
                          </p>
                          <p className="mt-3 break-all font-mono text-lg font-semibold text-[#0F172A]">
                            {guidedPartNumber}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            {guidedSpecSummary}
                          </p>
                          {isCrystalGuide && (
                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs leading-relaxed text-gray-600">
                              <p className="font-semibold text-[#0F172A]">
                                Catalog reference
                              </p>
                              <p className="mt-1">
                                {crystalCatalogSpecs.frequencyRange};{" "}
                                {crystalCatalogSpecs.tolerance};{" "}
                                {crystalCatalogSpecs.stability};{" "}
                                {crystalCatalogSpecs.loadCapacitance}.
                              </p>
                            </div>
                          )}
                          <div className="mt-4 grid gap-3">
                            <input
                              value={guidedReference}
                              onChange={(e) =>
                                setGuidedReference(e.target.value.slice(0, 80))
                              }
                              className={inputClass}
                              placeholder="Reference designator or project name"
                            />
                            <textarea
                              rows={4}
                              value={guidedNote}
                              onChange={(e) =>
                                setGuidedNote(e.target.value.slice(0, 500))
                              }
                              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                              placeholder="Anything unknown? Add target price, equivalent part, spec sheet note, or sample need."
                            />
                          </div>
                          <Button
                            type="button"
                            className="mt-4 h-11 w-full rounded-full"
                            onClick={addGuidedLine}
                          >
                            Add to Quote List
                            <Plus className="ml-2 h-4 w-4" />
                          </Button>
                          {guidedMessage && (
                            <p className="mt-3 text-xs text-blue-700">
                              {guidedMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-gray-200 bg-[#f8fafc] p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Optional spec sheet or drawing
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Upload only helpful support files. Limits protect
                            the form from abuse.
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
                      {(fileError || errorFor("quoteSource")) && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {fileError || errorFor("quoteSource")}
                        </p>
                      )}
                    </div>
                  </div>
                ) : mode === "upload" ? (
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
                        Send Quote Now Request
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
