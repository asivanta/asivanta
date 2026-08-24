import { ArrowRight, CheckCircle2, FileCheck2, ListChecks, Search, Scale } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const services = [
  {
    icon: Search,
    title: "Supplier and shortlist review",
    text: "Organize candidates, fit, and evidence gaps for one defined requirement.",
  },
  {
    icon: Scale,
    title: "RFQ and quote comparison",
    text: "Compare scope, terms, exclusions, and unanswered questions on quotes you already have.",
  },
  {
    icon: FileCheck2,
    title: "Document and evidence review",
    text: "Check whether records, names, and claims line up, and note where the evidence stops.",
  },
  {
    icon: ListChecks,
    title: "Pre-commitment questions",
    text: "Create a written list of what to ask, verify, delay, or escalate before you proceed.",
  },
];

const boundaries = [
  "Scope is agreed before review work starts.",
  "Desktop research and document review are not proof of factory reality.",
  "Supplier claims may require direct confirmation, a specialist, samples, or an on-site check.",
  "Success, savings, stock, quality, and delivery are not guaranteed.",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="home" />
      <Navbar />

      <main>
        <section className="relative isolate overflow-hidden bg-[#081226] pt-20 text-white">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#081226] via-[#0b1b38]/95 to-[#102b52]/80" />
          <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.3fr_.7fr] lg:py-28">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">Seoul · Buyer-side advisory</p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Buyer-side Korea sourcing review
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
                Asivanta helps overseas buyers review Korean suppliers, RFQs, and open questions before tooling, deposits, or a purchase order.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                We are based in Seoul. We work from the buyer’s side. A review organizes available information and names what still needs confirmation. It does not prove factory reality by itself.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#081226] transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Send an inquiry <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/insights" className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Read the guides
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/12 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur sm:p-9" aria-label="How a review helps">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Before commitment</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Turn a scattered sourcing question into a clear review.</h2>
              <ul className="mt-7 space-y-4 text-sm leading-6 text-slate-300">
                {["Define the requirement and decision at hand", "Separate available evidence from open claims", "Compare RFQ scope, terms, and exclusions", "Leave with a written list of next questions"].map((item) => (
                  <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /> {item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="bg-slate-50 py-24 sm:py-28" id="services">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Available now</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">Focused review before the next sourcing decision.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Each engagement begins with one defined requirement, the material you already have, and the questions that need a clearer answer.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {services.map((service) => (
                <article key={service.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                  <service.icon className="h-7 w-7 text-blue-700" aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
                </article>
              ))}
            </div>
            <Link href="/report" className="mt-9 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">
              See how a review is structured <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="py-24 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Clear boundaries</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">A review should make uncertainty visible, not hide it.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">The useful output is not a promise. It is a more organized view of what is known, what is missing, and what should happen before commitment.</p>
              <Link href="/trust-assurance" className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">Read Trust & Assurance <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ul className="space-y-4">
              {boundaries.map((boundary) => (
                <li key={boundary} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /> {boundary}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#0e2a4d] py-20 text-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Start in writing</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Send one supplier, RFQ, document set, or sourcing question.</h2>
              <p className="mt-4 text-slate-300">We will review whether it fits and reply if we can help.</p>
            </div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#081226] hover:bg-blue-50">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
