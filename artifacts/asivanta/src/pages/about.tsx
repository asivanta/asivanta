import { ArrowRight, Building2, CircleOff, MapPin, ScanSearch } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="about" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">About Asivanta</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">A buyer-side sourcing advisory based in Seoul.</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-600">Asivanta is a Seoul-based procurement and sourcing advisory. We help overseas companies evaluate Korean suppliers and sourcing questions with a clear written scope.</p>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 p-8">
              <Building2 className="h-7 w-7 text-blue-700" />
              <h2 className="mt-6 text-2xl font-semibold">What Asivanta is</h2>
              <p className="mt-4 leading-7 text-slate-600">A Seoul-based advisory that helps overseas buyers organize supplier, RFQ, document, and pre-commitment questions around one defined sourcing requirement.</p>
            </article>
            <article className="rounded-3xl border border-slate-200 p-8">
              <CircleOff className="h-7 w-7 text-blue-700" />
              <h2 className="mt-6 text-2xl font-semibold">What Asivanta is not</h2>
              <p className="mt-4 leading-7 text-slate-600">We are not a trading company, marketplace, or manufacturer. We do not sell parts.</p>
            </article>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr] md:items-start">
              <div>
                <MapPin className="h-7 w-7 text-blue-700" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">A deliberately narrow public claim.</h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-slate-600">
                <p>We do not claim a set team size, years in market, factory-visit standard, or named clients on this site.</p>
                <p>Work is scoped before it starts. Some questions can be reviewed from available records; others need the supplier, a specialist, or an on-site check.</p>
                <p>A written review is designed to expose open questions. It does not replace samples, testing, legal advice, technical specialists, or direct confirmation where those are needed.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <ScanSearch className="h-7 w-7 text-blue-700" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Have a defined supplier, RFQ, or sourcing question?</h2>
              <p className="mt-3 text-slate-600">Send the material you are evaluating and tell us what needs clarification.</p>
            </div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#081226] px-6 py-3.5 font-semibold text-white hover:bg-[#102b52]">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
