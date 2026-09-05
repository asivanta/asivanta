import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const sources = [
  {
    label: "National Tax Service Hometax",
    href: "https://www.hometax.go.kr",
    use: "Business registration status and taxpayer identity checks for a named Korean entity.",
  },
  {
    label: "Supreme Court Internet Registry (IROS)",
    href: "https://www.iros.go.kr",
    use: "Corporate registry particulars such as legal name, officers, and registered office when a registry extract is available.",
  },
  {
    label: "Korea Industrial Complex Corporation Factory On",
    href: "https://www.factoryon.go.kr/main/main.do",
    use: "Public factory-registration records where a manufacturing site is claimed.",
  },
  {
    label: "Government24 factory-registration certificate guidance",
    href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=14100000262&HighCtgCD=A03007&tp_seq=01",
    use: "What a factory-registration certificate is issued to show, and what to compare against a quote.",
  },
  {
    label: "IAF CertSearch",
    href: "https://www.iafcertsearch.org/verify-certificates",
    use: "Independent lookup of some accredited management-system certificates by issuer, scope, and site.",
  },
  {
    label: "ICC Incoterms 2020",
    href: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/",
    use: "Named delivery terms should be read as a defined allocation of cost, risk, and documents—not as a shipping slogan.",
  },
];

const identityChecks = [
  "Korean legal name and any English trading name used on the quote",
  "Business registration number and current business status",
  "Registered office versus the factory or warehouse address being quoted",
  "Names on the quote, invoice, contract, and bank beneficiary",
  "Who is authorised to confirm commercial and bank details",
];

const evidenceChecks = [
  "Who issued the document, on what date, and for which legal entity",
  "The site, product, process, or certificate scope actually named",
  "Whether the record is current, expired, or limited to a sample or model",
  "Whether photos, catalogues, or videos identify a date, location, and owner",
];

const rfqChecks = [
  "Part revision, material, tolerance, finish, and inspection basis",
  "Quantity, packaging, and the named delivery term",
  "Tooling ownership, sample cost, testing, and certificate exclusions",
  "Payment milestone, currency, validity, and change-handling language",
];

const nextChecks = [
  "A sample or limited test with written acceptance criteria",
  "Direct confirmation of bank and legal-entity details through a second channel",
  "A specialist, laboratory, or on-site check proportionate to the decision",
  "A delay on tooling, deposits, or a purchase order until named gaps are closed",
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function KoreaSupplierReviewBeforeCommitment() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="supplierReview" />
      <Navbar />
      <main className="pt-20">
        <article>
          <header className="bg-slate-50 py-20 sm:py-28">
            <div className="mx-auto max-w-3xl px-5 sm:px-8">
              <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
                <ArrowLeft className="h-4 w-4" /> Insights
              </Link>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Buyer-side guide</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Korea supplier review before commitment</h1>
              <p className="mt-6 text-xl leading-8 text-slate-600">
                Identity, evidence, RFQ scope, and the next direct checks before samples, deposits, tooling, or a purchase order.
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-3xl space-y-12 px-5 py-16 sm:px-8">
            <section className="space-y-4 text-base leading-7 text-slate-600">
              <p>
                A Korean supplier review is not one question. Corporate identity, supplied documents, quote scope, and factory
                reality are different checks. Mixing them together makes a lower price look safer than it is.
              </p>
              <p>
                This note is a desktop method for overseas buyers. It organizes public and supplier-provided information and
                names what still needs confirmation. It does not prove factory reality, qualify a supplier, or guarantee
                savings, quality, stock, or delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">1. Identity</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Start with the legal entity, not the website or the person on email. Korea’s National Tax Service operates
                Hometax for business-registration status. The Supreme Court Internet Registry can show corporate particulars
                when a registry extract is available. Differences across names, addresses, and bank details are not automatic
                proof of wrongdoing, but they are questions to resolve before payment.
              </p>
              <Checklist items={identityChecks} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">2. Evidence</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Treat certificates, catalogues, references, and website statements as supplied evidence—not final proof.
                Factory On and factory-registration certificates can support a claimed manufacturing site. IAF CertSearch can
                confirm some accredited certificate records. None of these sources, by themselves, establish current capacity
                or that a specific lot will meet specification.
              </p>
              <Checklist items={evidenceChecks} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">3. RFQ scope</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Compare quotes only after the scope is the same. A lower total may simply omit tooling, testing, packaging,
                inspection, or delivery responsibility. Where a quote uses a named Incoterms rule, read the ICC definition
                rather than assuming it includes freight, insurance, or import clearance.
              </p>
              <Checklist items={rfqChecks} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">4. Next direct checks</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Desktop review stops where physical, legal, or laboratory confirmation begins. Choose the next step that
                matches the decision at hand. A sample, specialist, or on-site check can expose problems before a larger
                commitment; it does not eliminate risk.
              </p>
              <Checklist items={nextChecks} />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight">Limits</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Public records and supplier documents can be incomplete, outdated, or about a different entity, site, or
                model. This guide does not prove factory reality, replace legal, customs, or testing advice, or create an
                Asivanta engagement. Inclusion of a source does not mean Asivanta verified any supplier against it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Sources</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Links below were reachable on 3 September 2026. Use the live official page; do not rely on this article as a
                substitute for the source.
              </p>
              <ul className="mt-6 space-y-4">
                {sources.map((source) => (
                  <li key={source.href} className="rounded-2xl border border-slate-200 p-5">
                    <a
                      className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
                      href={source.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {source.label} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{source.use}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <section className="bg-[#0e2a4d] py-16 text-white">
          <div className="mx-auto flex max-w-3xl flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Send one supplier, quote, or question.</h2>
              <p className="mt-3 text-slate-300">Tell us what you are evaluating and what remains unclear.</p>
            </div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#081226] hover:bg-blue-50">
              Send an inquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
