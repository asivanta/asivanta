import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  DatabaseZap,
  FileCheck2,
  MessagesSquare,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const assuranceSections = [
  {
    icon: ShieldCheck,
    title: "Supplier Credibility",
    text: "Asivanta helps review supplier background, business information, communication behavior, and basic reliability signals before buyers move deeper into a sourcing project.",
  },
  {
    icon: FileCheck2,
    title: "Document Review",
    text: "We help check certificates, company documents, product documents, and trade-related information for consistency, missing details, and possible red flags.",
  },
  {
    icon: MessagesSquare,
    title: "Communication Safety",
    text: "We help reduce confusion, fake claims, rushed pressure, and unclear supplier communication by keeping buyer questions, supplier answers, and next steps clear.",
  },
  {
    icon: DatabaseZap,
    title: "Data & Business Information Awareness",
    text: "Asivanta encourages careful handling of buyer information, RFQs, drawings, product details, pricing, and supplier communication throughout the sourcing process.",
  },
  {
    icon: ClipboardCheck,
    title: "Practical Risk Reduction",
    text: "No sourcing partner can promise zero risk. Asivanta helps buyers make better decisions with clearer information before deposits, purchase orders, or long-term commitments move forward.",
  },
];

export default function TrustAssurance() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative overflow-hidden bg-[#0a1128] pb-24 pt-32 text-white md:pb-28 md:pt-40">
        <div className="asv-liquid-sheen absolute inset-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(96,165,250,0.22),transparent_28%),linear-gradient(180deg,rgba(10,17,40,0)_0%,rgba(10,17,40,0.55)_100%)]"></div>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-blue-100/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mb-5 flex items-center gap-3"
            >
              <div className="h-px w-8 bg-blue-400"></div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                Buyer risk review
              </span>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end"
            >
              <div className="max-w-4xl">
                <h1 className="text-4xl font-light tracking-tight text-white md:text-6xl md:leading-[1.05]">
                  Secure Sourcing,{" "}
                  <span className="font-medium text-blue-300">
                    Built on Trust
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-blue-100/72 md:text-xl">
                  A practical assurance layer for buyers who need clearer
                  supplier information before money, timelines, or product
                  quality are put at risk.
                </p>
              </div>

              <div className="asv-glass-panel asv-glass-panel-dark rounded-[2rem] p-6">
                <div className="asv-glass-icon asv-glass-icon-dark mb-5 h-12 w-12 rounded-2xl text-blue-100">
                  <Search className="h-6 w-6 stroke-[1.5]" />
                </div>
                <p className="text-sm font-light leading-relaxed text-blue-100/72">
                  We look for practical signals: supplier identity, document
                  consistency, communication behavior, and business information
                  handling. The goal is better decisions, not false certainty.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_45%,#ffffff_100%)] py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-5 md:grid-cols-2"
          >
            {assuranceSections.map((section, index) => (
              <motion.article
                key={section.title}
                variants={fadeIn}
                className={`asv-glass-panel rounded-[2rem] p-7 md:p-8 ${
                  index === assuranceSections.length - 1
                    ? "md:col-span-2"
                    : ""
                }`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="asv-glass-icon h-12 w-12 rounded-2xl text-blue-600">
                    <section.icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
                    {section.title}
                  </h2>
                </div>
                <p className="max-w-3xl text-[15px] font-light leading-relaxed text-gray-600 md:text-base">
                  {section.text}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="container mx-auto px-6">
          <div className="asv-glass-panel rounded-[2rem] p-8 text-center md:p-12">
            <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-4xl">
              Review the risk before you commit.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-gray-600">
              Send the supplier, RFQ, quote, certificate, or sourcing question
              you are evaluating. Asivanta can help organize what should be
              checked before the next business step.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 rounded-full px-7 transition-all duration-300 hover:-translate-y-0.5">
                  Start a Sourcing Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/instant-quote">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-gray-300 px-7 text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50"
                >
                  Quote Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
