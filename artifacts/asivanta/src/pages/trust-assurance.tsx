import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  ExternalLink,
  FileCheck2,
  FileWarning,
  Landmark,
  MailWarning,
  MessagesSquare,
  PhoneCall,
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

const marketSignals = [
  {
    label: "Supplier audit firms",
    text: "Usually charge per audit, per inspection day, or per site visit.",
  },
  {
    label: "Vendor-risk platforms",
    text: "Often sell annual software subscriptions for vendor monitoring and questionnaires.",
  },
  {
    label: "Security consultants",
    text: "Often bill for fraud controls, payment process review, or third-party risk workshops.",
  },
];

const topics = [
  {
    id: "supplier-credibility",
    icon: ShieldCheck,
    title: "Supplier Credibility",
    subtitle: "Is the company real, capable, and acting consistently?",
    current:
      "Modern supplier risk is not only a fake website problem. A company can look real online, answer quickly, and still be a trading intermediary, a weak operator, or a bad fit for the product you need.",
    examples: [
      "A buyer finds a supplier through a directory. The supplier claims factory ownership, but business details, product range, and communication style suggest a broker.",
      "A supplier says it exports to major global brands, but cannot provide consistent company details, production photos, or references that match the claim.",
      "A quote looks attractive, but the supplier avoids direct answers about tooling ownership, inspection rights, or who actually manufactures the goods.",
    ],
    checks: [
      "Business identity and public company signals",
      "Product and capability alignment",
      "Factory/trading-company indicators",
      "Communication consistency across sales, technical, and admin contacts",
      "Basic red flags before sample payment, deposit, or purchase order",
    ],
    advice: [
      "Do not judge credibility by website polish alone.",
      "Ask the same key question in two different ways and compare the answers.",
      "Separate proof of existence from proof of capability. They are not the same.",
      "Treat urgent discount pressure before verification as a risk signal.",
    ],
  },
  {
    id: "document-review",
    icon: FileCheck2,
    title: "Document & Certificate Review",
    subtitle: "Do documents match the supplier, product, quote, and buyer need?",
    current:
      "Certificates, test reports, catalog sheets, export documents, and company registrations are easy to forward, crop, reuse, or misunderstand. The risk is not always forgery. Sometimes the document is real, but it belongs to another factory, another product, another date, or another standard.",
    examples: [
      "A supplier sends a certificate for a similar product family, but the model number, voltage, material, or date does not match the buyer's RFQ.",
      "A company registration is valid, but the business scope does not support the manufacturing claim being made.",
      "A test report appears professional, but the issuing lab, sample description, and supplier name do not line up cleanly.",
    ],
    checks: [
      "Names, addresses, dates, and model numbers across documents",
      "Certificate scope compared with the product being quoted",
      "Expiration, revision, and issuer consistency",
      "Missing pages, cropped stamps, altered-looking fields, and unclear scans",
      "Whether the document supports a decision or only starts a question list",
    ],
    advice: [
      "Never treat a certificate as a guarantee by itself.",
      "Ask which exact product, production site, and date the document covers.",
      "Keep original files and email trails. Screenshots are weaker evidence.",
      "For regulated products, use qualified legal, customs, compliance, or lab professionals before relying on the document.",
    ],
  },
  {
    id: "communication-safety",
    icon: MessagesSquare,
    title: "Communication Safety",
    subtitle: "Reduce confusion, fake claims, rushed pressure, and payment manipulation.",
    current:
      "Business email compromise and vendor impersonation remain serious risks. A message can appear inside a real conversation thread and still contain changed bank details, altered invoices, or pressure to move quickly.",
    examples: [
      "A supplier suddenly sends new bank details before deposit and says the old account is under audit or temporarily unavailable.",
      "A salesperson pushes the buyer to skip normal review because the production slot will be lost today.",
      "A new contact joins the thread and asks the buyer to resend drawings, RFQ files, or pricing targets to a different address.",
    ],
    checks: [
      "Unexpected changes to bank account, company name, or payment path",
      "Email domain, sender identity, and reply-chain consistency",
      "Pressure language, secrecy requests, or refusal to use normal channels",
      "Whether technical, commercial, and payment details are being mixed too casually",
      "Separate-channel confirmation before sensitive decisions",
    ],
    advice: [
      "Verify bank-detail changes through a known trusted channel, not a phone number or link inside the suspicious email.",
      "Use two-person approval for payment changes when possible.",
      "Do not open unexpected attachments or links from new supplier contacts.",
      "If money was sent to a suspected wrong account, contact the bank immediately and report through proper fraud channels.",
    ],
  },
  {
    id: "data-awareness",
    icon: DatabaseZap,
    title: "Data & Business Information Awareness",
    subtitle: "Protect RFQs, drawings, pricing, supplier notes, and buyer intent.",
    current:
      "A sourcing request can contain sensitive business information even when it is not a formal trade secret. Drawings, target prices, BOMs, customer names, volumes, launch dates, and supplier comparisons can reveal strategy.",
    examples: [
      "A buyer sends a full drawing package to five unknown suppliers before checking who they are.",
      "A supplier forwards the buyer's drawing to sub-suppliers without explaining who will see it.",
      "A buyer shares target price, annual volume, and urgent launch timing too early, weakening negotiation leverage.",
    ],
    checks: [
      "What information is needed now versus later",
      "Whether drawings or specs can be partially masked during early screening",
      "Who receives RFQ files and whether sub-suppliers are involved",
      "How pricing targets, quantities, and project timelines are communicated",
      "Whether NDAs, contracts, or formal IP controls are needed before deeper exchange",
    ],
    advice: [
      "Send the minimum information needed for the current stage.",
      "Mark sensitive files clearly and keep a record of who received them.",
      "Use watermarked or reduced drawings for early capability screening when practical.",
      "For important IP, use proper legal agreements and professional legal advice before disclosure.",
    ],
  },
  {
    id: "practical-risk-reduction",
    icon: ClipboardCheck,
    title: "Practical Risk Reduction",
    subtitle: "Make better decisions before money, tooling, or timelines are exposed.",
    current:
      "Good sourcing risk control is not one giant checklist. It is a staged decision process: screen first, verify deeper when the risk rises, then commit only when the information is clear enough for the business decision.",
    examples: [
      "Before sample payment, the buyer checks identity, product fit, and communication consistency.",
      "Before tooling, the buyer confirms ownership, specifications, milestone evidence, and inspection expectations.",
      "Before deposit or purchase order, the buyer confirms payment details, document consistency, production plan, and escalation contacts.",
    ],
    checks: [
      "Risk level by money exposure, product sensitivity, and timeline pressure",
      "What must be verified before each decision point",
      "Which risks can be accepted, delayed, insured, negotiated, or avoided",
      "What open questions should be written into the next supplier message",
      "Where a buyer should stop and use formal legal, compliance, lab, insurance, or cybersecurity support",
    ],
    advice: [
      "No advisor can promise zero risk. The goal is better evidence before commitment.",
      "Write down what would make you stop the project before you start paying.",
      "Do not let urgency replace verification.",
      "Use Asivanta for buyer-side structure, local context, and practical next-step review.",
    ],
  },
];

const quickRules = [
  "Do not change supplier bank details from email alone.",
  "Do not rely on certificates without checking scope and consistency.",
  "Do not send full drawings to unknown suppliers at the first contact stage.",
  "Do not let a supplier's urgency become your internal approval process.",
  "Do not confuse a real company with the right company for your product.",
];

const referenceLinks = [
  {
    label: "CISA supply chain risk management basics",
    href: "https://www.cisa.gov/ict-supply-chain-program-basics",
  },
  {
    label: "FTC small business scam guidance",
    href: "https://www.ftc.gov/business-guidance/resources/scams-your-small-business-guide-business",
  },
  {
    label: "FBI business email compromise guidance",
    href: "https://www.fbi.gov/how-we-can-help-you/safety-resources/scams-and-safety/common-scams-and-crimes/business-email-compromise",
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
                Free buyer education layer
              </span>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end"
            >
              <div className="max-w-4xl">
                <h1 className="text-4xl font-light tracking-tight text-white md:text-6xl md:leading-[1.05]">
                  Secure Sourcing,{" "}
                  <span className="font-medium text-blue-300">
                    Built on Trust
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-blue-100/72 md:text-xl">
                  A practical buyer guide for supplier credibility, document
                  review, safer communication, data handling, and staged risk
                  reduction before money or product plans are exposed.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#choose-topic"
                    className="asv-glass-button inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-[#0a1128] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    Start the Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center rounded-full border border-white/25 bg-white/8 px-6 text-sm font-semibold text-blue-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/14 hover:text-white"
                  >
                    Ask Asivanta to Review
                  </Link>
                </div>
              </div>

              <div className="asv-glass-panel asv-glass-panel-dark rounded-[2rem] p-6">
                <div className="asv-glass-icon asv-glass-icon-dark mb-5 h-12 w-12 rounded-2xl text-blue-100">
                  <BookOpen className="h-6 w-6 stroke-[1.5]" />
                </div>
                <p className="text-sm font-light leading-relaxed text-blue-100/72">
                  Many buyers pay for pieces of this through supplier audits,
                  vendor-risk platforms, fraud-control consulting, and document
                  reviews. Asivanta gives visitors the education layer for free,
                  then helps apply it to real sourcing decisions.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_45%,#ffffff_100%)] py-20"
        id="choose-topic"
      >
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Click a topic
            </p>
            <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-5xl">
              Learn what to check before the next business step.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-gray-600 md:text-lg">
              The homepage stays simple. This page goes deeper: what is
              happening now, what can go wrong, what Asivanta checks, and what a
              careful buyer should do before moving forward.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {topics.map((topic) => (
              <a
                key={topic.id}
                href={`#${topic.id}`}
                className="asv-glass-panel group flex min-h-[13rem] flex-col rounded-[2rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
              >
                <div className="asv-glass-icon mb-5 h-12 w-12 rounded-2xl text-blue-600">
                  <topic.icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-[#0F172A]">
                  {topic.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-600">
                  {topic.subtitle}
                </p>
                <span className="mt-auto inline-flex items-center pt-5 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Open
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="asv-glass-panel rounded-[2rem] p-7 lg:col-span-2">
              <div className="mb-6 flex items-center gap-4">
                <div className="asv-glass-icon h-12 w-12 rounded-2xl text-blue-600">
                  <AlertTriangle className="h-6 w-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                    Why this matters now
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
                    The risk often appears before the purchase order.
                  </h2>
                </div>
              </div>
              <p className="text-base font-light leading-relaxed text-gray-600">
                Sourcing risk usually starts early: during supplier search,
                document exchange, RFQ clarification, payment setup, and urgent
                negotiation. By the time quality, payment, or timeline damage is
                visible, the buyer may already have shared sensitive files,
                paid a deposit, missed a deadline, or lost leverage.
              </p>
            </div>

            <div className="asv-glass-panel rounded-[2rem] p-7">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Usually paid elsewhere
              </p>
              <div className="space-y-4">
                {marketSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-sm font-light leading-relaxed text-gray-600">
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-20">
        <div className="container mx-auto space-y-8 px-6">
          {topics.map((topic, index) => (
            <article
              key={topic.id}
              id={topic.id}
              className="asv-glass-panel scroll-mt-28 rounded-[2rem] p-6 md:p-9"
            >
              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="asv-glass-icon h-14 w-14 rounded-3xl text-blue-600">
                      <topic.icon className="h-7 w-7 stroke-[1.5]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                        Chapter {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A] md:text-3xl">
                        {topic.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-base font-light leading-relaxed text-gray-600">
                    {topic.current}
                  </p>
                </div>

                <div className="space-y-4">
                  <EducationPanel
                    icon={FileWarning}
                    title="Real buyer examples"
                    items={topic.examples}
                  />
                  <EducationPanel
                    icon={Search}
                    title="What Asivanta checks"
                    items={topic.checks}
                  />
                  <EducationPanel
                    icon={BadgeCheck}
                    title="Professional advice"
                    items={topic.advice}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0a1128] py-20 text-white">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
                Five rules to remember
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                Simple controls prevent expensive mistakes.
              </h2>
              <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-blue-100/70">
                These are practical business controls, not legal advice,
                cybersecurity audit conclusions, or compliance certifications.
                For high-stakes decisions, use the right professional review.
              </p>
            </div>

            <div className="grid gap-3">
              {quickRules.map((rule) => (
                <div
                  key={rule}
                  className="asv-glass-panel asv-glass-panel-dark flex items-start gap-3 rounded-2xl p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                  <p className="text-sm font-medium leading-relaxed text-blue-50/90">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="asv-glass-panel rounded-[2rem] p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  How Asivanta helps
                </p>
                <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-4xl">
                  We turn uncertainty into a clear question list and next step.
                </h2>
                <p className="mt-5 text-base font-light leading-relaxed text-gray-600">
                  Asivanta does not promise zero risk. We help buyers slow down
                  risky moments, organize supplier information, compare signals,
                  identify what is missing, and decide what should be verified
                  before the next commitment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: PhoneCall,
                    title: "Separate-channel checks",
                    text: "Confirm sensitive changes outside the original email thread.",
                  },
                  {
                    icon: Landmark,
                    title: "Payment caution",
                    text: "Flag bank-detail changes, mismatched names, and rushed deposit pressure.",
                  },
                  {
                    icon: MailWarning,
                    title: "Communication review",
                    text: "Look for urgency, inconsistency, vague answers, and identity drift.",
                  },
                  {
                    icon: ClipboardCheck,
                    title: "Decision notes",
                    text: "Create a practical list of what to ask, verify, delay, or escalate.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/60 p-5">
                    <item.icon className="mb-4 h-6 w-6 text-blue-600" />
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-gray-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)] pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-8 rounded-[2rem] border border-white bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Public guidance references
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                  Built from practical sourcing experience and public risk guidance.
                </h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-600">
                  This guide is educational. It is not a substitute for legal,
                  cybersecurity, customs, insurance, lab, or compliance advice
                  when those decisions are required.
                </p>
              </div>
              <div className="grid gap-3">
                {referenceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {link.label}
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-blue-50/70 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                  Want Asivanta to review your situation?
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-gray-600">
                  Send the supplier, RFQ, quote, certificate, or payment concern
                  you are evaluating. We will help organize the risk questions
                  before you move forward.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/contact">
                  <Button className="h-12 rounded-full px-7">
                    Start a Sourcing Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/instant-quote">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-gray-300 px-7 text-gray-700 hover:bg-white"
                  >
                    Quote Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EducationPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof AlertTriangle;
  title: string;
  items: string[];
}) {
  return (
    <details className="group rounded-2xl border border-blue-100/70 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl open:bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="flex items-center gap-3 text-base font-semibold text-[#0F172A]">
          <span className="asv-glass-icon h-10 w-10 rounded-2xl text-blue-600">
            <Icon className="h-5 w-5 stroke-[1.5]" />
          </span>
          {title}
        </span>
        <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600 transition-transform group-open:rotate-180">
          Open
        </span>
      </summary>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
