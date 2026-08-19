import { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { useSeo } from "@/hooks/use-seo";
import logoImage from "../assets/logo-nav.png";

const articleUrl =
  "https://www.asivanta.com/insights/korean-manufacturer-vs-trading-company";

const sourceLinks = [
  {
    label: "Korea National Tax Service business-registration guidance",
    href: "https://s.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7776&mi=2443",
  },
  {
    label: "Government24 factory-registration certificate guidance",
    href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=14100000262&HighCtgCD=A03007&tp_seq=01",
  },
  {
    label: "Korea Industrial Complex Corporation Factory On",
    href: "https://www.factoryon.go.kr/main/main.do",
  },
  {
    label: "IAF CertSearch accredited certificate verification",
    href: "https://www.iafcertsearch.org/verify-certificates",
  },
  {
    label: "Safety Korea product certification search",
    href: "https://www.safetykorea.kr/release/certDetail",
  },
];

const identityChecks = [
  "Korean and English legal company names",
  "Business Registration Number and current business status",
  "Registered office and quoted factory addresses",
  "Name on the quote, invoice, bank account, and contract",
  "The person authorised to confirm commercial and bank details",
];

const factoryCertificateChecks = [
  "Legal company name and registration number",
  "Factory address—not only the Seoul sales office",
  "Registered industry classification and listed products",
  "Manufacturing and supporting-facility area where shown",
  "Issue date and any later change in name, address, or business scope",
];

const capabilityEvidence = [
  "A process map showing which steps are internal and subcontracted",
  "Equipment list tied to the requested process, tolerance, and output",
  "Recent records for inspection, traceability, calibration, and corrective action",
  "A sample or pilot plan with written acceptance criteria",
  "References or shipment evidence relevant to the same product family",
  "Named owners for quality, engineering, production, and export communication",
];

const commitmentChecks = [
  "Match the legal entity, quote, invoice, contract, and bank beneficiary",
  "Confirm bank details through a previously established second channel",
  "Write down the approved material, process, drawing revision, and change-notification rule",
  "Define sample and production acceptance criteria before payment",
  "Record tooling, fixture, drawing, software, and test-data ownership",
  "Choose a document, specialist, laboratory, or on-site check proportionate to the risk",
];

const evidenceRows = [
  {
    evidence: "Business Registration Certificate and status check",
    supports: "The legal tax identity and whether the business is registered",
    doesNotProve: "That the company owns a factory or can make your product",
  },
  {
    evidence: "Factory Registration Certificate or Factory On record",
    supports:
      "A registered manufacturing site, address, industry, and recorded factory details",
    doesNotProve:
      "Current capacity, quality performance, or control of every process",
  },
  {
    evidence: "ISO or sector certificate",
    supports:
      "A certified management-system scope, site, issuer, and validity period",
    doesNotProve:
      "That your part meets specification or that production is currently available",
  },
  {
    evidence: "Product certificate or test report",
    supports: "The model, sample, or product covered by that document",
    doesNotProve:
      "That a different model, factory, revision, or shipment is covered",
  },
  {
    evidence: "Factory video, photos, or sales presentation",
    supports: "A useful lead for questions and possible site evidence",
    doesNotProve:
      "Ownership, date, location, output, or repeatable quality by itself",
  },
];

const roleQuestions = [
  [
    "Who issues the quote and invoice?",
    "Confirms the contracting party; it does not identify the physical producer by itself.",
  ],
  [
    "Which legal entity owns or leases the factory?",
    "Tests whether the quoted supplier and manufacturing site are connected.",
  ],
  [
    "Which production steps are performed at that address?",
    "Separates internal capability from subcontracting and brokering.",
  ],
  [
    "Which steps are subcontracted, and who controls them?",
    "Shows whether outside processes are disclosed and managed.",
  ],
  [
    "Who signs the quality agreement and corrective action?",
    "Identifies who is accountable when a sample or production lot fails.",
  ],
  [
    "Can the factory and certificate scope be checked independently?",
    "Turns a document claim into a verifiable evidence request.",
  ],
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-[1.02rem] leading-7 text-slate-600"
        >
          <CheckCircle2
            className="mt-1 h-5 w-5 shrink-0 text-[#0071e3]"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function KoreanManufacturerVsTradingCompany() {
  useSeo(
    "Korean Manufacturer or Trading Company? Verification Guide | Asivanta",
    "Learn what Korean business, factory, ISO, and product records actually prove before you approve a supplier, sample, tooling payment, or purchase order.",
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.asivantaArticle = "korean-manufacturer-vs-trading-company";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "Korean Manufacturer or Trading Company? What Each Document Actually Proves",
      description:
        "A buyer-side guide to checking Korean legal identity, factory registration, manufacturing capability, certificates, and supplier role before commitment.",
      datePublished: "2026-08-20",
      dateModified: "2026-08-20",
      mainEntityOfPage: articleUrl,
      isAccessibleForFree: true,
      author: {
        "@type": "Organization",
        name: "Asivanta",
        url: "https://www.asivanta.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Asivanta",
        url: "https://www.asivanta.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.asivanta.com/opengraph.jpg",
        },
      },
      citation: sourceLinks.map((source) => source.href),
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
      <header className="bg-[#07172f] text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            aria-label="ASIVANTA home"
            className="inline-flex items-center"
          >
            <img
              src={logoImage}
              alt="ASIVANTA"
              className="h-11 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <Link
            href="/insights"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All insights
          </Link>
        </div>
      </header>

      <main>
        <article>
          <section className="bg-[#07172f] px-6 pb-20 pt-16 text-white md:pb-28 md:pt-24">
            <div className="mx-auto max-w-4xl">
              <p className="text-sm font-semibold text-[#69aafc]">
                Supplier verification
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Korean manufacturer or trading company? What each document
                actually proves
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                A polished website, business certificate, or ISO logo can be
                useful evidence. None of them alone proves that the company
                makes your product at the claimed factory.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    className="h-4 w-4 text-[#69aafc]"
                    aria-hidden="true"
                  />
                  Published 20 August 2026
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3
                    className="h-4 w-4 text-[#69aafc]"
                    aria-hidden="true"
                  />
                  9-minute guide
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <p className="text-xl leading-9 text-slate-700">
              The useful question is not simply “manufacturer or trader?” It is
              “what role will this company perform, where will each production
              step happen, and what evidence supports that answer?”
            </p>
            <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
              A transparent trading company or integrator can be a good
              supplier. It may consolidate orders, manage small quantities, or
              coordinate specialised subcontractors. The risk begins when the
              role, factory, or process ownership is unclear.
            </p>

            <aside className="my-12 rounded-3xl bg-[#f5f5f7] p-7 md:p-9">
              <p className="text-sm font-semibold text-[#0071e3]">
                The evidence rule
              </p>
              <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight">
                Treat every document as evidence for a specific fact—not as a
                general badge that the supplier is safe.
              </p>
            </aside>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">01</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Confirm the legal business first
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Ask for the Korean Business Registration Certificate and the
                exact Korean legal name. Korea's National Tax Service explains
                that businesses supplying goods or services must register for
                each business place. A status check helps confirm the tax
                identity and whether the registration is active.
              </p>
              <Checklist items={identityChecks} />
              <p className="mt-6 font-medium leading-8 text-slate-700">
                This proves a registered business identity. It does not prove
                factory ownership, production capacity, export experience, or
                quality performance.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">02</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Check the manufacturing site separately
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Government24 describes the Factory Registration Certificate as a
                certificate of the registered record for a person conducting
                manufacturing at a registered factory. Factory On, operated by
                the Korea Industrial Complex Corporation, also provides a
                nationwide factory search based on more than 200,000 factory
                records.
              </p>
              <Checklist items={factoryCertificateChecks} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                A valid factory record is stronger than a sales-office address,
                but it still does not show whether the site has current capacity
                for your tolerance, material, process, and delivery schedule.
                Small or specially regulated operations may also require
                different records, so absence from one search should be treated
                as an open question—not an automatic fraud conclusion.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">03</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Match every document to the fact it supports
              </h2>
              <div className="mt-7 overflow-hidden rounded-2xl border border-black/10">
                <div className="hidden grid-cols-[1fr_1.1fr_1.1fr] bg-[#f5f5f7] text-sm font-semibold text-slate-800 md:grid">
                  <div className="p-4">Evidence</div>
                  <div className="border-l border-black/10 p-4">
                    What it supports
                  </div>
                  <div className="border-l border-black/10 p-4">
                    What it does not prove
                  </div>
                </div>
                {evidenceRows.map((row) => (
                  <div
                    key={row.evidence}
                    className="grid border-t border-black/10 first:border-t-0 md:grid-cols-[1fr_1.1fr_1.1fr]"
                  >
                    <div className="p-4 font-semibold text-slate-800">
                      {row.evidence}
                    </div>
                    <div className="p-4 text-sm leading-6 text-slate-600 md:border-l md:border-black/10">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#0071e3] md:hidden">
                        Supports
                      </span>
                      {row.supports}
                    </div>
                    <div className="p-4 pt-0 text-sm leading-6 text-slate-600 md:border-l md:border-black/10 md:pt-4">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-amber-700 md:hidden">
                        Does not prove
                      </span>
                      {row.doesNotProve}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">04</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Test the supplier's role with the RFQ
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Ask the same role questions before comparing price. A supplier
                that answers clearly may be a direct manufacturer, contract
                manufacturer, integrator, distributor, or trading company. The
                category matters less than knowing who controls production and
                who is accountable.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {roleQuestions.map(([question, reason]) => (
                  <div
                    key={question}
                    className="rounded-2xl border border-black/10 p-6"
                  >
                    <h3 className="font-semibold leading-6 text-slate-900">
                      {question}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">05</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Verify capability—not only identity
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                After the legal entity and factory are connected, test whether
                the process fits the requirement. Ask for evidence tied to your
                part family, specification, and expected production volume.
              </p>
              <Checklist items={capabilityEvidence} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                For accredited management-system certificates, check the legal
                name, covered site, standard, scope, issuing body, and status.
                IAF CertSearch provides an official global database for
                accredited certificates. For products covered by Korean product
                safety rules, Safety Korea can show certificate status, model,
                manufacturer, country, and factory information. The applicable
                system depends on the product and destination market.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">06</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Classify the result honestly
              </h2>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {[
                  [
                    "Manufacturer supported",
                    "The legal entity, factory record, process evidence, and accountability align with the quoted scope.",
                  ],
                  [
                    "Trading or distribution role disclosed",
                    "The supplier does not make the product but clearly identifies its role, producer, controls, and accountability.",
                  ],
                  [
                    "Integrator or contract-manufacturing model",
                    "Multiple parties perform the work and the supplier explains ownership, subcontracting, quality control, and change management.",
                  ],
                  [
                    "Unresolved",
                    "The entity, site, process, certificate, bank, or accountability evidence conflicts or remains missing.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-black/10 p-6"
                  >
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-7 font-medium leading-8 text-slate-700">
                “Unresolved” is a useful result. It means the next decision is
                to request evidence, narrow the scope, arrange a specialist or
                site check, or stop—before money or tooling is committed.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">07</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Recheck before payment or purchase order
              </h2>
              <Checklist items={commitmentChecks} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                No public-record search or sourcing adviser can promise zero
                risk. The purpose of verification is to make the supplier's
                role, supporting evidence, open questions, and next control
                visible before the decision grows expensive.
              </p>
            </section>

            <section className="my-8 rounded-3xl bg-[#07172f] p-8 text-white md:p-12">
              <p className="text-sm font-semibold text-[#69aafc]">
                One-supplier evidence review
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Unsure who actually makes the quoted product?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Send Asivanta one Korean supplier, quote, part, or certificate
                set. We can organise what is verified, what is supplier-stated,
                what conflicts, and which next check fits the decision.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#0071e3] px-7 font-medium text-white transition-colors hover:bg-[#0077ed]"
              >
                Start a supplier review
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            <section className="border-t border-black/10 pt-12">
              <h2 className="text-xl font-semibold tracking-tight">
                Sources and scope
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This is independent educational material, not a guarantee or
                legal, tax, certification, laboratory, customs, sanctions,
                cybersecurity, or engineering advice. Records can be incomplete
                or change after publication. Product-specific requirements and
                important commercial decisions should be checked with qualified
                professionals and the responsible authority.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {sourceLinks.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#0066cc] hover:underline"
                    >
                      {source.label}
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-black/10 p-6">
                <p className="text-sm font-semibold text-slate-900">
                  Related guide
                </p>
                <Link
                  href="/insights/kes-2026-overseas-buyer-checklist"
                  className="mt-2 inline-flex items-center gap-2 font-medium text-[#0066cc] hover:underline"
                >
                  Prepare a supplier shortlist and meeting scorecard for KES
                  2026
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
