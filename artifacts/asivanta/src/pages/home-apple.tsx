import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { AppleNavbar } from "@/components/layout/apple-navbar";
import { AppleFooter } from "@/components/layout/apple-footer";
import { useSeo } from "@/hooks/use-seo";
import heroBg from "../assets/hero-bg-apple.webp";

const operatingPrinciples = [
  ["Buyer-side", "The review is organized around your decision."],
  ["Korea-based", "Seoul-based coordination and local context."],
  [
    "Commercial clarity",
    "RFQs, quotes, terms, and open questions are reviewed before a purchase decision.",
  ],
  [
    "Trade-aware",
    "Export, import, and shipping questions are identified for specialist confirmation.",
  ],
];

const reviewSteps = [
  {
    number: "01",
    title: "Share the decision",
    text: "Send the part, product, supplier, RFQ, drawing, or concern you are evaluating.",
  },
  {
    number: "02",
    title: "Separate fact from claim",
    text: "Available documents, quote terms, supplier statements, and missing evidence are organized clearly.",
  },
  {
    number: "03",
    title: "Choose the next check",
    text: "Receive practical questions and next steps without a guarantee the available evidence cannot support.",
  },
];

const reviewCoverage = [
  {
    icon: FileSearch,
    title: "Supplier and shortlist review",
    text: "Organize available supplier information, fit questions, and evidence gaps for a defined requirement.",
  },
  {
    icon: ListChecks,
    title: "RFQ and quote comparison",
    text: "Compare scope, pricing structure, terms, exclusions, and unanswered commercial questions.",
  },
  {
    icon: ShieldCheck,
    title: "Factory-readiness planning",
    text: "Define what should be checked remotely, on-site, or by a qualified specialist before commitment.",
  },
  {
    icon: MessageSquareText,
    title: "Buyer-supplier communication",
    text: "Clarify requests and open points so both sides are working from the same written understanding.",
  },
];

const whatYouBring = [
  "Part, product, BOM, or drawing",
  "Supplier or quote under review",
  "Quantity, timeline, and destination",
  "Quality or document requirements",
];

const whatYouReceive = [
  "Available records and source dates",
  "Commercial and technical open questions",
  "Claims that still need confirmation",
  "A recommended next verification step",
];

export default function AppleHome() {
  useSeo(
    "Asivanta | Buyer-Side Korea Sourcing Review",
    "Asivanta helps global buyers review Korean suppliers, RFQs, and open questions before tooling, deposits, or a purchase order.",
  );

  return (
    <div className="asv-apple-home min-h-screen overflow-x-hidden bg-white text-[#1d1d1f] selection:bg-[#0071e3] selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-medium focus:text-black focus:shadow-xl"
      >
        Skip to main content
      </a>
      <AppleNavbar />

      <main id="main-content">
        <section className="relative flex min-h-[760px] items-center overflow-hidden bg-black px-6 pb-40 pt-24 text-left text-white md:min-h-[820px] md:pb-24 md:pt-32">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.3]"
          />
          <div
            className="absolute inset-0 bg-[#06142a]/60"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-6xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#69aafc]">
              <span className="h-px w-6 bg-[#69aafc]" aria-hidden="true" />
              Seoul, South Korea
            </p>
            <h1 className="mt-7 max-w-5xl text-[3rem] font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[4.75rem]">
              <span className="block">
                Transparent <span className="text-[#69aafc]">Korea</span>{" "}
                sourcing{" "}
              </span>
              <span className="block">
                across <span className="text-[#69aafc]">Asia</span>.
              </span>
            </h1>
            <p className="mt-7 text-xl font-semibold text-white md:text-2xl">
              No hidden costs. No cultural gaps. No surprises.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#c7c7cc] md:text-lg md:leading-8">
              We help global buyers verify Korean suppliers, compare quotes, and
              negotiate with local context before money, timelines, or quality
              are put at risk.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="asv-apple-press inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0071e3] px-7 font-medium text-white transition-colors duration-150 hover:bg-[#0077ed] sm:w-auto"
              >
                Start a Sourcing Review
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#deliverable"
                className="asv-apple-press inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/40 px-7 font-medium text-white transition-colors duration-150 hover:bg-white hover:text-black sm:w-auto"
              >
                See What the Review Covers
              </a>
            </div>
          </div>
        </section>

        <section
          className="bg-[#111] px-6 pb-16 text-white"
          aria-label="Operating principles"
        >
          <div className="mx-auto grid max-w-5xl border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {operatingPrinciples.map(([title, text]) => (
              <div
                key={title}
                className="border-b border-white/15 px-5 py-7 lg:border-b-0 lg:border-r last:lg:border-r-0"
              >
                <p className="text-lg font-semibold tracking-tight">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#a1a1a6]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-14 bg-[#f5f5f7] px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold text-[#0071e3]">
              A clearer decision
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              From a sourcing question to an evidence-aware next step.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6e6e73] md:text-xl">
              The review is scoped to what can be checked—and what still needs
              specialist, supplier, or on-site evidence.
            </p>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {reviewSteps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-3xl bg-white p-8 md:min-h-72"
                >
                  <p className="text-sm font-semibold text-[#0071e3]">
                    {step.number}
                  </p>
                  <h3 className="mt-12 text-2xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-7 text-[#6e6e73]">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="scroll-mt-14 bg-white px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-sm font-semibold text-[#0071e3]">
                  What a review can cover
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-5xl">
                  Focused support for the decision in front of you.
                </h2>
                <p className="mt-6 text-lg leading-8 text-[#6e6e73]">
                  Scope is agreed before work begins. Some questions can be
                  reviewed from available records; others require direct or
                  specialist verification.
                </p>
              </div>

              <div className="divide-y divide-black/10 border-y border-black/10">
                {reviewCoverage.map((item) => (
                  <article
                    key={item.title}
                    className="grid gap-4 py-7 sm:grid-cols-[auto_1fr]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#0071e3]">
                      <item.icon
                        className="h-5 w-5"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 leading-7 text-[#6e6e73]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="deliverable"
          className="scroll-mt-14 bg-black px-6 py-24 text-white md:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold text-[#2997ff]">
              The review layer
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              A useful record before the PO.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#a1a1a6] md:text-xl">
              The review organizes your decision without pretending that desktop
              research proves factory reality.
            </p>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {[
                ["What you bring", whatYouBring],
                ["What the review organizes", whatYouReceive],
              ].map(([title, items]) => (
                <article
                  key={title as string}
                  className="rounded-3xl bg-[#1c1c1e] p-8 md:p-10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                    {title as string}
                  </p>
                  <ul className="mt-7">
                    {(items as string[]).map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 border-t border-white/10 py-4 text-[#d2d2d7]"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#2997ff]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="industries"
          className="scroll-mt-14 bg-[#f5f5f7] px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold text-[#0071e3]">
              Prepared to review
            </p>
            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              Products, parts, suppliers, and RFQs with a clear buyer question.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6e6e73] md:text-xl">
              Electronics, industrial components, consumer products, and OEM/ODM
              requests can be considered when the scope, evidence, and limits
              are clear.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-11 items-center text-lg font-medium text-[#0071e3] hover:underline"
            >
              Ask whether your request fits
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="bg-white px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-[#0071e3]">
                  Trust is a method
                </p>
                <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
                  Evidence, scope, date, and limits.
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6e6e73] md:text-xl">
                  A useful conclusion should show what was reviewed, where the
                  information came from, what was not checked, and what remains
                  unresolved.
                </p>
              </div>
              <div className="rounded-3xl bg-[#f5f5f7] p-8">
                <ShieldCheck
                  className="h-9 w-9 text-[#0071e3]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="mt-6 leading-7 text-[#6e6e73]">
                  Supplier success, savings, quality, compliance, price, stock,
                  customs outcomes, and delivery are not guaranteed by a review.
                </p>
                <Link
                  href="/trust-assurance"
                  className="mt-6 inline-flex min-h-11 items-center font-medium text-[#0071e3] hover:underline"
                >
                  Read the trust approach
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f5f7] px-6 py-24 text-center md:py-32">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              Have a sourcing decision to review?
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6e6e73] md:text-xl">
              Send the part, supplier, RFQ, or sourcing question. Asivanta can
              help clarify what should be checked before you commit.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="asv-apple-press inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0071e3] px-7 font-medium text-white transition-colors duration-150 hover:bg-[#0077ed] sm:w-auto"
              >
                Start a Sourcing Review
              </Link>
              <Link
                href="/instant-quote"
                className="asv-apple-press inline-flex min-h-12 w-full items-center justify-center rounded-full border border-black/25 px-7 font-medium text-[#1d1d1f] transition-colors duration-150 hover:bg-black hover:text-white sm:w-auto"
              >
                Quote Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AppleFooter />
    </div>
  );
}
