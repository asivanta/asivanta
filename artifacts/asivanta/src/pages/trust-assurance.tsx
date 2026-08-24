import { ArrowRight, Check, CircleAlert, X } from "lucide-react";
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
