import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const guides = [
  {
    title: "How to review a Korean supplier before commitment",
    preview: "Separate corporate identity, supplied evidence, and factory reality instead of treating them as one question.",
    paragraphs: [
      "Begin with the legal entity name, registration details, addresses, bank beneficiary, and the people communicating with you. Differences are not automatically wrongdoing, but they are questions to resolve before payment.",
      "Treat certificates, catalogues, references, and website statements as supplied evidence—not final proof. Confirm the issuer, scope, dates, and whether each record belongs to the same entity.",
      "Desktop checks cannot establish current factory conditions or capacity. Where the decision depends on physical reality, use samples, testing, direct confirmation, a specialist, or an on-site check.",
    ],
  },
  {
    title: "MOQ, lead time, and payment terms: what buyers miss",
    preview: "Read commercial terms as connected assumptions, not isolated numbers.",
    paragraphs: [
      "A minimum order quantity may depend on material purchasing, setup, packaging, or production scheduling. Ask what changes when volume changes rather than comparing the number alone.",
      "A stated lead time should identify when the clock starts, what buyer inputs are required, and whether it covers production only or also inspection, export, and delivery.",
      "Payment language should match the named legal entity, currency, milestone, bank beneficiary, and remedy if the scope changes. Escalate legal or trade-finance questions to a qualified specialist.",
    ],
  },
  {
    title: "Reducing supplier risk in Korea: a practical approach",
    preview: "Make the next decision smaller, documented, and proportionate to the evidence.",
    paragraphs: [
      "Define the decision first: whether to request a sample, continue discussion, issue tooling, pay a deposit, or place an order. Each step needs a different level of evidence.",
      "Keep an open-questions list with an owner and source for each answer. A claim repeated in several emails is still one unconfirmed claim if it comes from the same source.",
      "Use staged commitments where practical. Samples, limited tests, specialist review, and explicit approval gates can expose problems before a larger commitment, but they do not eliminate risk.",
    ],
  },
  {
    title: "Comparing RFQs before you compare price",
    preview: "Normalize scope, exclusions, and assumptions before ranking the total.",
    paragraphs: [
      "Confirm that each quote covers the same part revision, material, tolerance, finish, inspection basis, packaging, quantity, and delivery term. A lower total may simply contain less scope.",
      "List exclusions and open items beside the price: tooling ownership, sample cost, testing, certificates, tax, freight, payment milestones, validity, and change handling.",
      "Do not fill gaps with assumptions. Send the same clarification questions to each supplier and preserve the written answers with the quote version they relate to.",
    ],
  },
];

export default function Insights() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="insights" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Insights</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Korea sourcing guides for pre-commitment questions.</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">Buyer-side notes on suppliers, documents, RFQs, and the boundaries of desktop review.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl space-y-5 px-5 sm:px-8">
            {guides.map((guide, index) => (
              <details key={guide.title} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm open:border-blue-200 sm:p-8">
                <summary className="flex cursor-pointer list-none items-start gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 sm:flex"><BookOpen className="h-5 w-5" /></div>
                  <div className="flex-1"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">Guide 0{index + 1}</p><h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{guide.title}</h2><p className="mt-3 leading-7 text-slate-600">{guide.preview}</p></div>
                  <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
                </summary>
                <div className="ml-0 mt-7 space-y-4 border-t border-slate-200 pt-7 text-base leading-7 text-slate-600 sm:ml-16">{guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-[#0e2a4d] py-18 text-white">
          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-8 px-5 py-2 sm:px-8 md:flex-row md:items-center">
            <div><h2 className="text-3xl font-semibold tracking-tight">Send one supplier, quote, or question.</h2><p className="mt-3 text-slate-300">Tell us what you are evaluating and what remains unclear.</p></div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#081226] hover:bg-blue-50">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
