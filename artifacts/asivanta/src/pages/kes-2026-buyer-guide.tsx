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
  "https://www.asivanta.com/insights/kes-2026-overseas-buyer-checklist";

const preparationInputs = [
  "Part number, product description, BOM line, drawing, or target capability",
  "Expected quantity now and at a realistic future volume",
  "Application, operating conditions, and non-negotiable specifications",
  "Required certificates, inspection records, or test reports",
  "Delivery destination, timing, tooling, and alternate-part rules",
];

const candidateEvidence = [
  "Legal company name, Korean name, website, and physical address",
  "Manufacturer, distributor, trading company, or integrator role",
  "The exact product or capability that appears relevant",
  "Public certificates, test claims, export evidence, and source dates",
  "Questions that still need direct, specialist, or on-site confirmation",
];

const rfqQuestions = [
  "Exact product scope and technical compliance",
  "Minimum order and sample quantities",
  "Unit prices at stated quantity breaks",
  "Tooling, engineering, programming, inspection, and packaging charges",
  "Incoterm, shipping point, payment schedule, and bank-verification process",
  "Sample, pilot, and production lead times",
  "Warranty, nonconforming material, and corrective-action process",
  "Origin, traceability, change notification, and end-of-life controls",
];

const meetingNotes = [
  "Technical fit and evidence shown",
  "Questions answered clearly, deferred, or avoided",
  "Sample plan and commercial clarity",
  "Quality, traceability, and production documents",
  "Factory-visit or specialist-check need",
  "Next action, owner, and date",
];

const commitmentChecks = [
  "Reconfirm the legal company and bank beneficiary through a second channel",
  "Confirm that the quote and invoice describe the same scope",
  "Resolve payment-detail changes by an established channel, not email alone",
  "Confirm ownership of tooling, drawings, firmware, and test fixtures",
  "Write down inspection and acceptance criteria",
  "Choose public-record, factory, lab, legal, compliance, or specialist checks in proportion to the risk",
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

export default function Kes2026BuyerGuide() {
  useSeo(
    "KES 2026 Overseas Buyer Checklist | Asivanta",
    "Prepare for Korea Electronics Show 2026 with a buyer-side supplier shortlist, comparable RFQ questions, meeting evidence, and a safer post-show decision plan.",
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.asivantaArticle = "kes-2026-buyer-guide";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "How Overseas Buyers Should Prepare for Korea Electronics Show 2026",
      description:
        "A buyer-side checklist for supplier shortlisting, RFQ preparation, meeting evidence, and post-show decisions at KES 2026.",
      datePublished: "2026-08-20",
      dateModified: "2026-08-20",
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
                Trade show preparation
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                How overseas buyers should prepare for Korea Electronics Show
                2026
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                Build a usable supplier shortlist, ask comparable RFQ questions,
                and leave Seoul with evidence—not only brochures and business
                cards.
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
                  8-minute guide
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <p className="text-xl leading-9 text-slate-700">
              Korea Electronics Show 2026 takes place at COEX in Seoul from 13
              to 16 October. The organizer expects about 500 exhibitors and
              70,000 visitors across electronics, semiconductors, robotics,
              mobility, digital health, XR, components, and advanced materials.
            </p>
            <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
              That scale creates opportunity, but it also creates a buyer
              problem: four busy days can produce dozens of conversations
              without producing one decision-ready supplier comparison. The best
              time to prepare is before the first meeting.
            </p>

            <aside className="my-12 rounded-3xl bg-[#f5f5f7] p-7 md:p-9">
              <p className="text-sm font-semibold text-[#0071e3]">
                The buyer-side goal
              </p>
              <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight">
                Leave Seoul knowing which suppliers deserve a sample, technical
                review, factory visit, or commercial negotiation—and which
                claims still need evidence.
              </p>
            </aside>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">01</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Define one sourcing decision
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Start with one part, product, manufacturing process, or
                capability. Write the requirement so a supplier can understand
                it without guessing.
              </p>
              <Checklist items={preparationInputs} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                If the requirement is vague, every supplier will quote a
                different interpretation. The prices may look comparable even
                when the offers are not.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">02</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Build a shortlist before the show
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Use the official exhibitor search, Korean company websites,
                technical catalogues, trade platforms, and public business
                records to find possible matches. A long list is only the
                beginning.
              </p>
              <Checklist items={candidateEvidence} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                A polished English website is not proof of factory capability. A
                limited English website is not proof that a Korean manufacturer
                is weak. Compare the Korean and English evidence and identify
                what needs direct confirmation.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">03</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Send the same core RFQ questions
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Trade-show conversations become easier to compare when every
                candidate receives the same core questions.
              </p>
              <Checklist items={rfqQuestions} />
              <p className="mt-6 font-medium leading-8 text-slate-700">
                A quote without scope, exclusions, and assumptions is not ready
                for comparison.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">04</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Use a meeting scorecard
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                After each meeting, capture facts while they are fresh. The
                scorecard should record the decision value of the meeting, not
                the confidence of the salesperson.
              </p>
              <Checklist items={meetingNotes} />

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  [
                    "Confirmed",
                    "Supported by a document, demonstration, or attributable source.",
                  ],
                  [
                    "Supplier-stated",
                    "Said by the supplier but not yet independently checked.",
                  ],
                  [
                    "Open",
                    "Unanswered, inconsistent, or requiring a specialist or site check.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-black/10 p-5"
                  >
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">05</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Slow down payment and tooling decisions
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                A trade show is designed to create momentum. That is useful for
                introductions, but it is not a reason to skip normal controls
                before a sample payment, tooling deposit, or purchase order.
              </p>
              <Checklist items={commitmentChecks} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                No sourcing adviser can promise zero risk. A useful review makes
                the remaining risk visible and matches the next check to the
                size of the decision.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">06</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Turn the show into a 30-day decision plan
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                Within two business days, remove candidates that miss the
                requirement, send the same clarification list to the remaining
                suppliers, compare revised quotes on total scope, and assign the
                technical, commercial, document, and payment checks.
              </p>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                The most useful output from KES is a shortlist with evidence,
                open questions, owners, and dates—not a bag of catalogues.
              </p>
            </section>

            <section className="my-8 rounded-3xl bg-[#07172f] p-8 text-white md:p-12">
              <p className="text-sm font-semibold text-[#69aafc]">
                Buyer-side preparation
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Have one Korea sourcing decision to prepare before KES?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Asivanta can organize candidate evidence, prepare comparable RFQ
                questions, and identify the next verification step for one
                defined part, product, supplier list, or capability.
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
                This guide is independent educational material. Asivanta is not
                affiliated with KES, KEA, KOTRA, NIST, or any exhibitor. Legal,
                compliance, laboratory, cybersecurity, customs, insurance, and
                specialist technical questions should be reviewed by qualified
                professionals.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  [
                    "KES 2026 official show information",
                    "https://www.kes.org/eng/intro/info.asp",
                  ],
                  [
                    "KES 2026 exhibitor search",
                    "https://www.kes.org/eng/search/product_list.asp?admission=2026",
                  ],
                  [
                    "KOTRA services for international buyers",
                    "https://www.kotra.or.kr/english/subList/41000046004",
                  ],
                  [
                    "NIST supplier due diligence quick-start guide",
                    "https://www.nist.gov/publications/nist-cybersecurity-supply-chain-management-due-diligence-assessment-quick-start-guide",
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
