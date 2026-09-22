import { ArrowRight, Check, CheckCircle2, CircleAlert, ClipboardList, ListOrdered, X } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const canReview = [
  "Whether names, dates, registration details, and supplied records are internally consistent",
  "Whether quotes appear to cover the same scope, terms, and exclusions",
  "Which supplier statements are supported by supplied documents and which remain open",
  "What should be confirmed directly, tested, checked on-site, or escalated to a specialist",
];

const cannotProve = [
  "Current factory conditions, capacity, stock, or production readiness from desktop material alone",
  "Future quality, savings, commercial success, shipment timing, or delivery",
  "Authenticity merely because a document or certificate was supplied",
  "Legal, financial, engineering, regulatory, or trade-compliance conclusions",
];

const evidenceStages = [
  {
    title: "Desktop consistency and scope review",
    text: "Compare names, registration details, quotes, and supplied documents against the decision you are trying to make. This stage clarifies what the paper trail can support and what it leaves open.",
  },
  {
    title: "Sample or limited test with written acceptance criteria",
    text: "A controlled sample or limited test can reduce uncertainty about fit, finish, or process—only when the acceptance criteria are written down before the result arrives.",
  },
  {
    title: "Specialist, laboratory, or on-site check when the decision warrants it",
    text: "When the commercial exposure is higher, escalate to a proportionate specialist, laboratory, or on-site check. Desktop review does not replace that step.",
  },
];

const reviewPrep = [
  "Supplier legal names and any English trading names used on quotes or websites",
  "Business registration number, if known",
  "Quote or RFQ with scope, quantities, exclusions, and named Incoterms",
  "Certificates, catalogues, photos, or other records the supplier has already provided",
  "Open questions you want clarified before samples, tooling, deposits, or a purchase order",
];

export default function TrustAssurance() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="trust" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Trust & Assurance</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Know what a sourcing review can—and cannot—establish.</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-600">A useful review separates available evidence from open claims before samples, tooling, deposits, or a purchase order.</p>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-7 sm:p-9">
              <Check className="h-8 w-8 text-emerald-700" />
              <h2 className="mt-6 text-2xl font-semibold">What a defined review can check</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                {canReview.map((item) => <li key={item} className="flex gap-3 leading-7"><Check className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />{item}</li>)}
              </ul>
            </article>
            <article className="rounded-3xl border border-amber-200 bg-amber-50/60 p-7 sm:p-9">
              <X className="h-8 w-8 text-amber-800" />
              <h2 className="mt-6 text-2xl font-semibold">What the review does not prove</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                {cannotProve.map((item) => <li key={item} className="flex gap-3 leading-7"><CircleAlert className="mt-1 h-5 w-5 shrink-0 text-amber-800" />{item}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex items-start gap-4">
              <ListOrdered className="mt-1 h-7 w-7 shrink-0 text-blue-700" aria-hidden="true" />
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Evidence stages</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                  Each stage answers different questions. A lower price does not replace a missing stage. The aim is to reduce uncertainty and clarify the next decision—not to claim zero risk, guaranteed quality, savings, delivery, authenticity, or approval.
                </p>
              </div>
            </div>
            <ol className="mt-12 space-y-5">
              {evidenceStages.map((stage, index) => (
                <li key={stage.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081226] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold">{stage.title}</h3>
                      <p className="mt-3 leading-7 text-slate-600">{stage.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex items-start gap-4">
              <ClipboardList className="mt-1 h-7 w-7 shrink-0 text-blue-700" aria-hidden="true" />
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What to send for a defined review</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                  Preparing the material below helps a review start from the same facts you already have. It is helpful preparation, not a requirement that creates an engagement.
                </p>
              </div>
            </div>
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
              <ul className="space-y-4">
                {reviewPrep.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-7 text-slate-700">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Related reading</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Short notes for buyers who want more context before sending material.
            </p>
            <ul className="mt-8 space-y-4">
              <li>
                <Link href="/insights" className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">
                  Insights <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
              <li>
                <Link href="/insights/korea-supplier-review-before-commitment" className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">
                  Korea supplier review before commitment <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Confidence should match the evidence.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Where the available information is not enough, the review should say so and name the next check rather than imply certainty.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#081226] px-6 py-3.5 font-semibold text-white hover:bg-[#102b52]">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
