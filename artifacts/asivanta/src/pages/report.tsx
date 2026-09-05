import { ArrowRight, FileInput, FileSearch, ListChecks, Scale } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const steps = [
  { icon: FileInput, title: "Define the question", text: "Agree one sourcing requirement, the decision ahead, and the material available for review." },
  { icon: FileSearch, title: "Organize the evidence", text: "Separate supplied records and direct statements from assumptions, missing documents, and unconfirmed claims." },
  { icon: Scale, title: "Compare consistently", text: "Review candidates or RFQs against the same scope, terms, exclusions, and open questions." },
  { icon: ListChecks, title: "Name the next checks", text: "Prepare a written list of what to ask, verify, delay, or escalate before commitment." },
];

export default function Report() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="report" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-[#081226] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Service explanation</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Korea supplier shortlist review</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-300">A defined review organizes supplier options, RFQ details, evidence gaps, and the next questions a buyer should resolve before commitment.</p>
            <Link href="/contact" className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#081226] hover:bg-blue-50">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">A review begins with material you already have.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">That may include supplier names, an RFQ, quotes, registration records, certificates, product documents, email exchanges, or a written sourcing question. The scope determines what can be reviewed.</p>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {steps.map((step, index) => (
                <article key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
                  <div className="flex items-center justify-between"><step.icon className="h-7 w-7 text-blue-700" /><span className="text-sm font-semibold text-slate-400">0{index + 1}</span></div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">What the review can produce</h2>
              <ul className="mt-6 space-y-3 leading-7 text-slate-600">
                <li>• A structured comparison of supplied candidates or quotes</li>
                <li>• A list of available evidence and visible gaps</li>
                <li>• Questions for suppliers or other specialists</li>
                <li>• Items to verify, delay, or escalate</li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">What it does not establish</h2>
              <ul className="mt-6 space-y-3 leading-7 text-slate-600">
                <li>• Factory reality from desktop information alone</li>
                <li>• Guaranteed stock, capacity, quality, savings, or delivery</li>
                <li>• Legal, financial, engineering, or compliance advice</li>
                <li>• An engagement before a written scope is agreed</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="text-3xl font-semibold tracking-tight">Sample review outline (for process clarity)</h2>
            <p className="mt-4 max-w-3xl text-slate-600">Use this structure as a reference only; this is not a real client case.</p>
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
              <ol className="space-y-4 text-slate-700">
                <li><strong>1) Scope and decision:</strong> what is being reviewed and what will happen after this review.</li>
                <li><strong>2) Materials reviewed:</strong> supplier data, RFQs, quotes, documents, and contact records.</li>
                <li><strong>3) Evidence check:</strong> which items appear consistent, uncertain, or unverified.</li>
                <li><strong>4) Risk flags:</strong> quality, schedule, compliance, communication, and hidden assumptions.</li>
                <li><strong>5) Recommendation:</strong> what to confirm next and what to escalate before commitment.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center">
            <div><h2 className="text-3xl font-semibold tracking-tight">Send one defined sourcing question.</h2><p className="mt-3 text-slate-600">Tell us what you are evaluating and what needs clarification.</p></div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#081226] px-6 py-3.5 font-semibold text-white hover:bg-[#102b52]">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
