import { useEffect } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
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
  "https://www.asivanta.com/insights/qualify-sourcing-lead-before-korean-supplier";

const checks = [
  {
    number: "01",
    title: "Confirm the deadline",
    text: "A useful opportunity has a date that still allows time for clarification, supplier matching, quotation, samples, and internal approval. Record both the stated deadline and the date you verified it.",
    items: [
      "When is the buyer expecting a first response?",
      "Is the date for information, a quotation, a sample, or a purchase decision?",
      "Is the notice current on the original source?",
    ],
  },
  {
    number: "02",
    title: "Identify the legal buyer and contact",
    text: "A marketplace profile or short request is not enough on its own. Match the organization name, website, country, business activity, and contact route before introducing a supplier.",
    items: [
      "Legal or trading name and a working company website",
      "Named role or department responsible for the request",
      "A contact route published by the organization or platform",
    ],
  },
  {
    number: "03",
    title: "Understand the requested role",
    text: "Determine whether the buyer needs a manufacturer, distributor, contract producer, technology partner, or sourcing adviser. The wrong role creates a poor match even when the product category looks correct.",
    items: [
      "Direct supply, private label, OEM, ODM, distribution, or partnership",
      "New supplier search, alternate supplier, or market exploration",
      "One defined purchase or a longer development program",
    ],
  },
  {
    number: "04",
    title: "Turn the request into measurable specifications",
    text: "Before asking a Korean supplier to quote, separate required specifications from preferences and open questions. If two suppliers could interpret the request differently, it is not ready for a fair comparison.",
    items: [
      "Product, material, dimensions, performance, finish, and application",
      "Required standards, certificates, tests, drawings, or samples",
      "Quantity now, expected future volume, packaging, and destination",
    ],
  },
  {
    number: "05",
    title: "Check the evidence fit",
    text: "Record why each supplier appears relevant and what remains unverified. A catalogue match is a lead; a documented capability, sample, test result, or specialist review is stronger evidence.",
    items: [
      "Exact product or manufacturing capability that matches",
      "Source link, document date, and company identity",
      "Claims that still require direct, technical, or on-site confirmation",
    ],
  },
  {
    number: "06",
    title: "Set the commercial baseline",
    text: "A price has little meaning without quantity, currency, scope, timing, and delivery terms. Ask every candidate for the same commercial fields so the offers can be compared.",
    items: [
      "Sample quantity, MOQ, price breaks, tooling, and other charges",
      "Lead time, payment schedule, quote validity, and exclusions",
      "Named Incoterms® 2020 rule and the agreed place or port",
    ],
  },
  {
    number: "07",
    title: "Use the correct contact route",
    text: "Contact the published department or platform channel whenever possible. The first note should explain why the request appears relevant, ask one useful qualifying question, and make it easy to decline.",
    items: [
      "Do not guess personal email addresses or use unrelated staff contacts",
      "Reference the original request without copying confidential material",
      "Stop follow-up when the recipient says no or the opportunity is closed",
    ],
  },
];

const warningSigns = [
  "The original notice cannot be found or has no usable date.",
  "The organization, website, contact identity, and request do not agree.",
  "The request is broad enough to fit almost any supplier in the category.",
  "The buyer asks for pricing without quantity, scope, or delivery context.",
  "The contact route requires bypassing a marketplace or published process.",
  "Urgency is used to pressure payment or disclosure before normal checks.",
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

export default function SourcingLeadQualificationGuide() {
  useSeo(
    "Qualify a Sourcing Lead Before Contacting Korean Suppliers | Asivanta",
    "Seven practical checks for confirming buyer identity, deadlines, specifications, evidence, and trade terms before asking Korean suppliers to quote.",
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.asivantaArticle = "sourcing-lead-qualification-guide";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "A Sourcing Lead Is Not Yet a Buyer: 7 Checks Before You Contact a Korean Supplier",
      description:
        "Seven practical checks for confirming buyer identity, deadlines, specifications, evidence, and trade terms before asking Korean suppliers to quote.",
      datePublished: "2026-08-22",
      dateModified: "2026-08-22",
      mainEntityOfPage: articleUrl,
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
                Buyer readiness
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                A sourcing lead is not yet a buyer
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                Seven checks to complete before asking a Korean supplier to
                spend time on a quotation, sample, or technical review.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    className="h-4 w-4 text-[#69aafc]"
                    aria-hidden="true"
                  />
                  Published 22 August 2026
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3
                    className="h-4 w-4 text-[#69aafc]"
                    aria-hidden="true"
                  />
                  6-minute guide
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <p className="text-xl leading-9 text-slate-700">
              Buyer notices, marketplace requests, trade-show conversations, and
              partnership posts can reveal real demand. They can also be
              incomplete, expired, or too vague for a supplier decision.
            </p>
            <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
              Qualification protects both sides. It helps the buyer receive
              comparable answers and prevents Korean suppliers from spending
              time on requests that are not ready.
            </p>

            <aside className="my-12 rounded-3xl bg-[#f5f5f7] p-7 md:p-9">
              <p className="text-sm font-semibold text-[#0071e3]">
                The simple rule
              </p>
              <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight">
                Do not treat a public lead as a confirmed buyer requirement
                until the identity, timing, scope, evidence, and contact route
                agree.
              </p>
            </aside>

            {checks.map((check) => (
              <section
                key={check.number}
                className="border-t border-black/10 py-12"
              >
                <p className="text-sm font-semibold text-[#0071e3]">
                  {check.number}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {check.title}
                </h2>
                <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                  {check.text}
                </p>
                <Checklist items={check.items} />
              </section>
            ))}

            <section className="border-t border-black/10 py-12">
              <div className="flex items-center gap-3 text-amber-700">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Pause and verify
                </p>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Warning signs that the lead is not ready
              </h2>
              <ul className="mt-7 grid gap-4 md:grid-cols-2">
                {warningSigns.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">
                A better first message
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Ask one question that changes the shortlist
              </h2>
              <div className="mt-7 rounded-3xl bg-[#f5f5f7] p-7 text-[1.02rem] leading-8 text-slate-700 md:p-9">
                <p>Hello [team or department],</p>
                <p className="mt-4">
                  We saw your current request for [specific product or
                  capability]. Asivanta supports buyer-side sourcing in Korea.
                  Before we prepare a small supplier shortlist, could you
                  confirm [one missing specification, quantity, deadline, or
                  required role]?
                </p>
                <p className="mt-4">
                  If the request is no longer active, reply “no” and we will not
                  follow up.
                </p>
                <p className="mt-4">
                  Asivanta
                  <br />
                  Seoul, South Korea
                </p>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                A short, specific question creates more value than a long sales
                introduction. It also gives the recipient a clear way to stop
                contact.
              </p>
            </section>

            <section className="my-8 rounded-3xl bg-[#07172f] p-8 text-white md:p-12">
              <p className="text-sm font-semibold text-[#69aafc]">
                Where Asivanta fits
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Turn one defined request into a decision-ready Korea shortlist
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Asivanta can organize public candidate evidence, identify open
                questions, prepare comparable supplier questions, and recommend
                the next verification step.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#0071e3] px-7 font-medium text-white transition-colors hover:bg-[#0077ed]"
              >
                Start a sourcing review
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            <section className="border-t border-black/10 pt-12">
              <h2 className="text-xl font-semibold tracking-tight">
                Sources and scope
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This is independent educational material, not a promise that a
                buyer, supplier, transaction, or payment is genuine. Public
                information should be dated and attributed. Legal, compliance,
                customs, tax, laboratory, financial, and specialist technical
                questions should be reviewed by qualified professionals.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  [
                    "tradeKorea buyer and trade services",
                    "https://www.tradekorea.com/service/tradeservice.do?popid=pop02",
                  ],
                  [
                    "KOTRA services for international buyers",
                    "https://www.kotra.or.kr/english/subList/41000046004",
                  ],
                  ["Enterprise Europe Network", "https://een.ec.europa.eu/"],
                  [
                    "ICC Incoterms® rules",
                    "https://iccwbo.org/business-solutions/incoterms-rules/",
                  ],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#0066cc] hover:underline"
                    >
                      {label}
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
