import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Send,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const projectTypes = [
  "Supplier Shortlist",
  "Supplier Verification",
  "Quote / RFQ Comparison",
  "Negotiation Support",
  "Factory Readiness Review",
  "Managed Sourcing",
  "Other",
];
const MIN_MESSAGE = 30;
const MAX_MESSAGE = 2000;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const inputClass =
  "w-full h-12 px-4 rounded-xl border bg-[#f9fafb] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
const inputErrorClass = "border-red-300";
const inputNormalClass = "border-gray-200";

export default function Contact() {
  useSeo(
    "Contact Asivanta | Talk to a Korea Sourcing Specialist",
    "Tell us what you need to source in Korea and we will come back with verified supplier options, indicative pricing and a realistic lead time. English-language support.",
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MESSAGE) return;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
  };

  const getFieldError = (name: string): string => {
    if (!touched[name]) return "";
    switch (name) {
      case "fullName":
        return form.fullName.trim() ? "" : "Full Name is required.";
      case "company":
        return form.company.trim() ? "" : "Company Name is required.";
      case "email":
        if (!form.email.trim()) return "Email is required.";
        if (!isValidEmail(form.email)) return "Enter a valid email address.";
        return "";
      case "projectType":
        return form.projectType ? "" : "Select a project type.";
      case "message":
        if (!form.message.trim()) return "Message is required.";
        if (form.message.length < MIN_MESSAGE)
          return `At least ${MIN_MESSAGE} characters required.`;
        return "";
      default:
        return "";
    }
  };

  const isFormValid =
    form.fullName.trim() &&
    form.company.trim() &&
    form.email.trim() &&
    isValidEmail(form.email) &&
    form.projectType &&
    form.message.trim().length >= MIN_MESSAGE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      company: true,
      email: true,
      projectType: true,
      message: true,
    });
    if (!isFormValid) return;

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          projectType: form.projectType,
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.error ||
            "Something went wrong while sending your inquiry. Please try again shortly.",
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError(
        "Something went wrong while sending your inquiry. Please try again shortly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-24 bg-[#f9fafb]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl font-light text-[#0F172A] tracking-tight mb-4"
            >
              Start a sourcing review
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-500 font-light max-w-xl mb-16"
            >
              Send the supplier, quote, part, product, or Korea sourcing
              challenge you are evaluating. We will review the context and
              respond with practical next steps.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {submitted ? (
                <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] p-10 md:p-14 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-medium text-[#0F172A] mb-3">
                    Thank you. Your inquiry has been received.
                  </h2>
                  <p className="text-gray-500 font-light mb-8 max-w-md mx-auto">
                    We will respond within 24–48 hours.
                  </p>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="rounded-full h-11 px-6"
                    >
                      Return to Home
                    </Button>
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] p-8 md:p-10"
                >
                  <input
                    type="text"
                    name="_hp_field"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="mb-8 grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-sm text-[#0F172A] md:grid-cols-3">
                    {[
                      "Buyer-side advisory",
                      "Confidential intake",
                      "24-48 hour response",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[#0F172A] mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        onBlur={() => handleBlur("fullName")}
                        className={`${inputClass} ${getFieldError("fullName") ? inputErrorClass : inputNormalClass}`}
                        placeholder="Your full name"
                      />
                      {getFieldError("fullName") && (
                        <p className="text-red-500 text-xs mt-1.5">
                          {getFieldError("fullName")}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-[#0F172A] mb-2"
                      >
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        onBlur={() => handleBlur("company")}
                        className={`${inputClass} ${getFieldError("company") ? inputErrorClass : inputNormalClass}`}
                        placeholder="Your company"
                      />
                      {getFieldError("company") && (
                        <p className="text-red-500 text-xs mt-1.5">
                          {getFieldError("company")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#0F172A] mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        className={`${inputClass} ${getFieldError("email") ? inputErrorClass : inputNormalClass}`}
                        placeholder="you@company.com"
                      />
                      {getFieldError("email") && (
                        <p className="text-red-500 text-xs mt-1.5">
                          {getFieldError("email")}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-[#0F172A] mb-2"
                      >
                        Phone{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`${inputClass} ${inputNormalClass}`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="projectType"
                      className="block text-sm font-medium text-[#0F172A] mb-2"
                    >
                      Review Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      onBlur={() => handleBlur("projectType")}
                      className={`${inputClass} appearance-none ${getFieldError("projectType") ? inputErrorClass : inputNormalClass}`}
                    >
                      <option value="" disabled>
                        Select a review type
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {getFieldError("projectType") && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {getFieldError("projectType")}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#0F172A] mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      onBlur={() => handleBlur("message")}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#f9fafb] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none ${getFieldError("message") ? inputErrorClass : inputNormalClass}`}
                      placeholder="Share what you are evaluating: supplier name or website, product/category, target country, order size, quote concerns, timeline, or what feels risky..."
                      maxLength={MAX_MESSAGE}
                    />
                    <div className="flex justify-between items-center mt-1.5">
                      {getFieldError("message") ? (
                        <p className="text-red-500 text-xs">
                          {getFieldError("message")}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span
                        className={`text-xs ${form.message.length >= MAX_MESSAGE ? "text-red-500" : form.message.length >= MAX_MESSAGE * 0.9 ? "text-amber-500" : "text-gray-400"}`}
                      >
                        {form.message.length} / {MAX_MESSAGE} characters
                      </span>
                    </div>
                  </div>

                  <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-relaxed text-gray-600">
                    File uploads are temporarily unavailable while ASIVANTA
                    strengthens document screening. Paste the important RFQ,
                    supplier, or specification details into the message field.
                    We will arrange a secure document exchange after reviewing
                    your request.
                  </div>

                  {serverError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{serverError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="rounded-full h-13 px-8 text-base hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Review Request
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-1"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <div className="space-y-6 lg:sticky lg:top-32">
                <motion.div
                  variants={fadeIn}
                  className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
                        Location
                      </h3>
                      <p className="text-sm text-gray-500">
                        Seoul, South Korea
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:contact@asivanta.com"
                        className="text-sm text-gray-500 hover:text-[#3B82F6] transition-colors"
                      >
                        contact@asivanta.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
                        Response Time
                      </h3>
                      <p className="text-sm text-gray-500">
                        Typical response within 24–48 hours
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-[#0a1128] rounded-2xl p-8"
                >
                  <p className="text-blue-100 font-light text-sm leading-relaxed">
                    "If you are wiring money to a supplier in Korea, confidence
                    should come before commitment."
                  </p>
                  <p className="text-blue-400 text-xs mt-4 font-medium tracking-wide uppercase">
                    ASIVANTA Advisory
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]"
                >
                  <h3 className="mb-5 text-sm font-semibold text-[#0F172A]">
                    Helpful details to include
                  </h3>
                  <ul className="space-y-4 text-sm text-gray-500">
                    {[
                      "Product, part number, or category",
                      "Supplier name, website, or quote",
                      "Target quantity, timeline, and destination",
                      "What you need verified before commitment",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
