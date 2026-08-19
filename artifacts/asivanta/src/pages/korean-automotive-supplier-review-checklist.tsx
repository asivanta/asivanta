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
  "https://www.asivanta.com/insights/korean-automotive-supplier-review-checklist";

const sourceLinks = [
  {
    label: "KOTRA Frankfurt — GP Europe 2026 Future Mobility buyer meetings",
    href: "https://www.linkedin.com/company/kotra-frankfurt/",
  },
  {
    label: "IATF — automotive customer-specific requirements",
    href: "https://www.iatfglobaloversight.org/oem-requirements/customer-specific-requirements/",
  },
  {
    label: "IATF — recognized certification bodies under contract",
    href: "https://www.iatfglobaloversight.org/certification-bodies/under-contract/",
  },
  {
    label: "AIAG — automotive quality core tools",
    href: "https://www.aiag.org/expertise-areas/quality/quality-core-tools",
  },
  {
    label: "IMDS — International Material Data System information pages",
    href: "https://public.mdsystem.com/en/web/imds-public-pages",
  },
  {
    label: "UNECE — vehicle and component regulation FAQ",
    href: "https://unece.org/transport/vehicle-regulations/faq",
  },
];

const requirementBrief = [
  "Customer, vehicle or equipment program, destination market, and planned start of production",
  "Part number, drawing revision, specifications, critical and special characteristics, and annual volume range",
  "Prototype, validation, pre-series, launch, and serial-production milestones",
  "Required quality system, customer-specific requirements, and expected approval process",
  "Applicable testing, material reporting, regulatory, cybersecurity, software, and traceability requirements",
  "Tooling ownership, nominated sub-suppliers, packaging, Incoterms, currency, warranty, and change-notification rules",
];

const siteEvidence = [
  {
    title: "Legal and contracting entity",
    text: "Match the quoted company name, registration information, bank beneficiary, contract party, and invoicing entity. Record any parent, affiliate, distributor, or agent role separately.",
  },
  {
    title: "Named production site",
    text: "Record the address that will make the part, the processes performed there, the people responsible, and the processes or special operations sent elsewhere.",
  },
  {
    title: "Certificate boundary",
    text: "Check the legal entity, site, standard, scope, issue and expiry dates, and certification body. Confirm that the body is recognized by the applicable oversight system.",
  },
  {
    title: "Program boundary",
    text: "A valid IATF 16949 certificate does not by itself prove that the quoted part, line, tooling, capacity, customer requirement, or launch plan is approved.",
  },
];

const coreToolQuestions = [
  "Who owns APQP for this program, and what is the current timing and gate status?",
  "Which design and process risks are controlled through DFMEA, PFMEA, and the Control Plan?",
  "What PPAP level, customer portal, sample quantity, evidence, and approval timing apply?",
  "Which measurement systems require MSA, and how will capability be shown for critical characteristics?",
  "What process data will be controlled with SPC, and what reaction plan applies when the process changes or drifts?",
  "Can the supplier show a redacted example that connects the drawing, process flow, PFMEA, Control Plan, work instruction, inspection result, and submission record?",
];

const manufacturingEvidence = [
  "Process-flow diagram from incoming material through shipment, including outside processes",
  "Make-or-buy map naming sub-tier suppliers, special processors, laboratories, and responsibility for their approval",
  "Equipment list connected to the quoted process, tooling plan, maintenance ownership, and backup strategy",
  "Rated and demonstrated capacity by operation, shift pattern, expected scrap, bottleneck, and launch-ramp assumption",
  "Lot, material, process, inspection, rework, and shipment traceability for the proposed program",
  "Engineering and process change rules, required customer notice, revalidation, and record retention",
  "Launch containment, escalation, corrective-action, warranty, and field-issue responsibilities",
];

const complianceQuestions = [
  "Which destination-country laws, customer specifications, and UN or national approvals apply to this exact component?",
  "Who owns IMDS registration, material data creation, sub-tier collection, submission, rejection correction, and final acceptance?",
  "Which restricted or declarable substance lists and customer-specific material rules apply at the planned submission date?",
  "Are test reports tied to the current drawing, material, site, process, laboratory, and approval revision?",
  "For software or connected components, which cybersecurity, update, diagnostic, safety, and configuration requirements apply?",
  "Which compliance item is still open, who owns it, and what happens to timing or cost if it is not accepted?",
];

const meetingOutputs = [
  [
    "Commercial",
    "Comparable price basis, tooling, payment, Incoterms, packaging, currency, warranty, and open assumptions.",
  ],
  [
    "Engineering",
    "Current drawing and requirement list, feasibility owner, technical questions, and dated answer plan.",
  ],
  [
    "Quality",
    "Required system, customer-specific requirements, core-tool deliverables, PPAP path, and approval owner.",
  ],
  [
    "Operations",
    "Named site, process map, sub-tier boundary, capacity evidence, bottleneck, and launch-ramp plan.",
  ],
  [
    "Compliance",
    "Material-reporting, testing, approval, traceability, regulatory, and destination-market responsibilities.",
  ],
  [
    "Decision",
    "Evidence received, evidence promised, unresolved risks, next review date, and a clear proceed, pause, or stop condition.",
  ],
];

const pauseSignals = [
  {
    title: "The certificate belongs to another site or entity",
    text: "A group-level certificate, expired copy, unrelated scope, or different manufacturing address cannot support the proposed production site without more evidence.",
  },
  {
    title: "The quote has no program assumptions",
    text: "Price looks attractive, but tooling, test cost, packaging, scrap, capacity, payment, currency, logistics, or annual-volume assumptions are missing.",
  },
  {
    title: "No one owns the quality submission",
    text: "The supplier mentions PPAP or IATF but cannot name the responsible person, submission level, customer portal, timing, or evidence still required.",
  },
  {
    title: "Sub-tier and special processes stay hidden",
    text: "Heat treatment, coating, molding, electronics, software, testing, or other important work is outsourced without a named control and change process.",
  },
  {
    title: "Material or approval work starts after nomination",
    text: "IMDS, destination rules, customer-specific requirements, test methods, or component approvals are treated as paperwork to solve after the sourcing decision.",
  },
  {
    title: "A sample is treated as launch proof",
    text: "A hand-built or laboratory sample does not establish repeatability, production-rate capability, traceability, sub-tier control, or serial quality performance.",
  },
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

export default function KoreanAutomotiveSupplierReviewChecklist() {
  useSeo(
    "Korean Automotive Supplier Review Checklist | Asivanta",
    "A practical buyer-side checklist for evaluating a Korean automotive supplier's site, IATF scope, APQP and PPAP readiness, capacity, sub-tier controls, IMDS process, and launch evidence.",
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.asivantaArticle =
      "korean-automotive-supplier-review-checklist";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "Korean Automotive Supplier Review Checklist: From First Meeting to a Verifiable Launch Plan",
      description:
        "A buyer-side checklist for evaluating a Korean automotive supplier's exact site, quality-system boundary, core-tool readiness, production evidence, material reporting, and launch plan.",
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
                Automotive sourcing and supplier quality
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Korean automotive supplier review checklist: from first meeting
                to a verifiable launch plan
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                A strong presentation and a quality certificate are useful
                starting points. Connect the exact part, customer, production
                site, process, evidence, approval path, capacity, and launch
                owner before nomination or tooling commitment.
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
                  11-minute guide
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <p className="text-xl leading-9 text-slate-700">
              Automotive sourcing is not only a search for a capable company. It
              is a controlled decision about one part or system, one program,
              one production site, and one route to customer approval and stable
              serial supply.
            </p>
            <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
              KOTRA Frankfurt&apos;s GP Europe 2026 Future Mobility event is
              designed to connect qualified OEM and Tier 1 purchasing,
              engineering, supplier-management, R&amp;D, and innovation teams
              with more than 40 Korean companies on 10 September 2026. The
              meeting is the beginning of qualification—not evidence that a
              supplier is ready for a specific customer or program.
            </p>

            <aside className="my-12 rounded-3xl bg-[#f5f5f7] p-7 md:p-9">
              <p className="text-sm font-semibold text-[#0071e3]">
                The automotive sourcing rule
              </p>
              <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight">
                Do not approve “the supplier” in general. Review the exact legal
                entity, production site, process, part, program, requirement
                set, and launch plan.
              </p>
            </aside>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">01</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Define the requirement before comparing companies
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                A supplier cannot give a comparable answer if the buyer has not
                defined what must be priced, validated, approved, produced, and
                delivered. Start with a controlled requirement brief.
              </p>
              <Checklist items={requirementBrief} />
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">02</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Connect the company, site, certificate, and program
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                IATF publishes customer-specific requirements from participating
                automakers and a list of recognized certification bodies. Those
                sources help define what to verify, but the buyer must still
                connect the records to the site and work being proposed.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {siteEvidence.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-black/10 p-6"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">03</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Ask how the quality tools connect—not whether they exist
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                AIAG identifies APQP, Control Plan, PPAP, FMEA, MSA, and SPC as
                automotive quality core tools. The useful evidence is how the
                required tools connect to the current drawing, process, risks,
                measurements, controls, and customer submission.
              </p>
              <Checklist items={coreToolQuestions} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                Exact customer and program requirements may differ and may
                change. Use the current customer-specific requirement, supplier
                manual, contract, portal instruction, and qualified quality
                specialists rather than a generic checklist alone.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">04</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Map the real production and sub-tier chain
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                A factory tour is a snapshot. The decision needs a written map
                of how serial product will move through internal operations,
                outside processes, inspection, approval, and shipment.
              </p>
              <Checklist items={manufacturingEvidence} />
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">05</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Verify material, regulatory, and approval ownership
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                IMDS is the automotive industry&apos;s material data system and
                supports legal and customer material-reporting obligations.
                UNECE regulations may support mutual recognition of vehicle or
                component approvals where the applicable countries and
                regulation align. Neither system removes the need to identify
                the exact requirement for the part and destination.
              </p>
              <Checklist items={complianceQuestions} />
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">06</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Leave the meeting with six written outputs
              </h2>
              <div className="mt-7 overflow-hidden rounded-2xl border border-black/10">
                {meetingOutputs.map(([title, text]) => (
                  <div
                    key={title}
                    className="grid border-t border-black/10 first:border-t-0 md:grid-cols-[0.25fr_1fr]"
                  >
                    <div className="bg-[#f5f5f7] p-4 font-semibold text-slate-800">
                      {title}
                    </div>
                    <div className="p-4 text-sm leading-6 text-slate-600 md:border-l md:border-black/10">
                      {text}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">07</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Pause when the evidence boundary stays unclear
              </h2>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {pauseSignals.map((signal) => (
                  <div
                    key={signal.title}
                    className="rounded-2xl border border-black/10 p-6"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {signal.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">08</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Use a 30-day qualification decision
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  [
                    "Days 1–5",
                    "Issue one requirement brief and evidence request. Confirm the contracting entity, proposed site, program owner, and next review date.",
                  ],
                  [
                    "Days 6–20",
                    "Compare the site, certificate boundary, quality-tool path, process map, capacity, sub-tier controls, material reporting, and commercial assumptions.",
                  ],
                  [
                    "Days 21–30",
                    "Approve a defined validation step, request missing evidence, narrow the supplier role, or stop before nomination and tooling exposure grow.",
                  ],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-[#f5f5f7] p-6">
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="my-8 rounded-3xl bg-[#07172f] p-8 text-white md:p-12">
              <p className="text-sm font-semibold text-[#69aafc]">
                One-supplier automotive review
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Have a Korean automotive supplier or technology candidate?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Send Asivanta one requirement and proposed supplier. We can
                organize public and Korean-language evidence, the entity and
                site boundary, commercial assumptions, open quality and launch
                questions, and the next verification step before commitment.
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
                This independent educational guide is not affiliated with or
                endorsed by KOTRA, GP Europe, Automechanika Frankfurt, IATF,
                AIAG, IMDS, UNECE, any automaker, or any event participant. It
                is not legal, regulatory, quality-system, certification,
                homologation, engineering, product-safety, cybersecurity,
                sanctions, tax, or contract advice. Requirements vary by
                customer, program, part, site, and destination and can change.
                Confirm important decisions with the responsible customer,
                authority, and qualified specialists.
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
                  Related supplier verification guide
                </p>
                <Link
                  href="/insights/korean-manufacturer-vs-trading-company"
                  className="mt-2 inline-flex items-center gap-2 font-medium text-[#0066cc] hover:underline"
                >
                  Check what Korean business, factory, and certificate records
                  actually prove
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
