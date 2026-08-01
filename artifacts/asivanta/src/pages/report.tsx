import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileSearch,
  Handshake,
  Languages,
  ListChecks,
  Scale,
  Search,
  ShieldQuestion,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const chapters = [
  {
    n: "01",
    title: "What you asked for",
    text: "Your requirement written back to you as screening rules — the exact tests a supplier has to pass to reach your shortlist. If we read your need wrong, you see it on page one, not at the end.",
  },
  {
    n: "02",
    title: "How we searched",
    text: "Where we looked, what we checked on each candidate, and what we deliberately did not do. No directory scrape. Every candidate found and checked by hand.",
  },
  {
    n: "03",
    title: "Shortlist at a glance",
    text: "One comparison table. Maker or trader, capability match, fit for your volume, how they answered us, and our overall call — scored on the evidence we actually saw.",
  },
  {
    n: "04",
    title: "Supplier profiles",
    text: "For each recommended supplier: what they are, why they fit you, what to watch, the evidence we saw, what we could not verify, and the open questions to put in your first email.",
  },
  {
    n: "05",
    title: "The ones we screened out",
    text: "Named, with the reason. So you never spend a week rediscovering a candidate we already looked at and passed on.",
  },
  {
    n: "06",
    title: "What this report is not",
    text: "The honest edge of the work, in writing. A screening is not an audit, and we say so inside the report itself — not in small print.",
  },
  {
    n: "07",
    title: "Your next step",
    text: "A 30-day plan you can run yourself: first contact, comparing answers, samples, and a pilot order — plus the payment-safety rules that stop the most common way buyers lose money.",
  },
];

const searchSources = [
  "Korean corporate registry listings and public business-ID records",
  "KOTRA and industry association member lists",
  "Component distributor catalogs that list Korean makers by part number",
  "Datasheet archives — who actually publishes their own datasheets",
  "Korean-language company sites and news, read in Korean",
];

const perSupplierChecks = [
  "Business identity: registration, address, company age, size signals",
  "Capability match: is your exact spec in their real catalog",
  "Maker or trader: own process, own plant photos, own datasheets",
  "Consistency: does the Korean site say the same thing as the English one",
  "Responsiveness: we send one plain technical question and time the reply",
];

const notThis = [
  {
    icon: Eye,
    title: "A screening, not an audit",
    text: "We review public records, catalogs, published documents, and direct replies. We do not visit sites, inspect lines, or test parts as part of this report.",
  },
  {
    icon: Scale,
    title: "No credit or financial check",
    text: "A company can pass everything in this report and still be in financial trouble. Financial diligence is a separate service.",
  },
  {
    icon: ShieldQuestion,
    title: "Certificates are not confirmed live",
    text: "Where a supplier publishes a certificate, we say so. Confirming it is currently in force is a separate step.",
  },
  {
    icon: Users,
    title: "People change",
    text: "The engineer who answered us well may leave next quarter. Re-check contact quality at the start of any real program.",
  },
  {
    icon: ClipboardList,
    title: "Judgment stays judgment",
    text: "The scores are our reasoned opinion on the evidence we saw. We show you that evidence so you can disagree with us.",
  },
];

const packages = [
  {
    name: "Starter Shortlist",
    price: "$299 – $499",
    lead: "You need the right door to knock on.",
    items: [
      "Requirement turned into written screening rules",
      "Five candidates screened, three recommended",
      "Full profile per recommended supplier",
      "The screened-out candidates and why",
      "Ready-to-send first email and question list",
      "30-day next-step plan",
    ],
    cta: "Request a Starter Shortlist",
    highlight: false,
  },
  {
    name: "Deeper Sourcing + Outreach",
    price: "$999 – $1,500",
    lead: "You want us to walk it with you.",
    items: [
      "Everything in the Starter Shortlist",
      "Direct outreach to the shortlist in Korean, on your behalf",
      "Reply handling and translation until you have real quotes",
      "Quote comparison sheet: true landed cost next to unit price",
      "Sample-stage coordination",
      "Payment-safety checklist for your finance team",
    ],
    cta: "Talk about the deeper package",
    highlight: true,
  },
];

const credibility = [
  {
    icon: Building2,
    title: "Fifteen years inside this trade",
    text: "Our team has spent fifteen years in the Korean SMD crystal and oscillator business — quoting it, shipping it, and fixing it when it went wrong. We know which questions make a supplier uncomfortable.",
  },
  {
    icon: Languages,
    title: "We read the Korean side",
    text: "Most of the truth about a Korean maker is on the Korean page, not the English one. The gap between the two is often the finding.",
  },
  {
    icon: Handshake,
    title: "Buyer side only",
    text: "We charge you an advisory fee. We do not take supplier commissions, referral payments, or hidden markups. Nobody on the other side pays us.",
  },
  {
    icon: Ban,
    title: "We will say no",
    text: "If your product is outside what we can screen well, we tell you before you pay instead of writing a thin report.",
  },
];

export default function Report() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a1128] pb-24 pt-32 text-white md:pb-28 md:pt-40">
        <div className="asv-liquid-sheen absolute inset-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(96,165,250,0.22),transparent_28%),linear-gradient(180deg,rgba(10,17,40,0)_0%,rgba(10,17,40,0.55)_100%)]"></div>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-blue-100/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-blue-400"></div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                The core deliverable
              </span>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end"
            >
              <div className="max-w-4xl">
                <h1 className="text-4xl font-light tracking-tight text-white md:text-6xl md:leading-[1.05]">
                  The Korean Supplier{" "}
                  <span className="font-medium text-blue-300">
                    Shortlist Report
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-blue-100/72 md:text-xl">
                  Three to five Korean suppliers for one defined part or
                  capability — screened by hand, scored on evidence, with the
                  gaps and the open questions written down. Weeks of your
                  sourcing work, done in Korea, in Korean.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#inside"
                    className="asv-glass-button inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-[#0a1128] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    See What Is Inside
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center rounded-full border border-white/25 bg-white/8 px-6 text-sm font-semibold text-blue-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/14 hover:text-white"
                  >
                    Request a Report
                  </Link>
                </div>
              </div>

              <div className="asv-glass-panel asv-glass-panel-dark rounded-[2rem] p-6">
                <div className="asv-glass-icon asv-glass-icon-dark mb-5 h-12 w-12 rounded-2xl text-blue-100">
                  <FileSearch className="h-6 w-6 stroke-[1.5]" />
                </div>
                <p className="text-sm font-light leading-relaxed text-blue-100/72">
                  Built for U.S. small and mid-size importers buying industrial
                  parts, electronic components, and OEM/ODM production. One
                  clear scope, one report, one decision — not a retainer you
                  have to grow into.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_45%,#ffffff_100%)] py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="asv-glass-panel rounded-[2rem] p-7 lg:col-span-2">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Who this is for
              </p>
              <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-4xl">
                The buyer who knows the part, but not the country.
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-gray-600">
                You already know your specification, your volume, and your
                deadline. What you do not have is a way to tell a real Korean
                maker from a well-dressed trading company, from twelve time
                zones away, in a language you do not read. That gap is the whole
                job of this report.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  "Industrial parts",
                  "Electronic components",
                  "OEM / ODM production",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-[#0F172A]"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="asv-glass-panel rounded-[2rem] p-7">
              <div className="asv-glass-icon mb-5 h-12 w-12 rounded-2xl text-blue-600">
                <Ban className="h-6 w-6 stroke-[1.5]" />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                What we do not cover
              </p>
              <p className="text-sm font-light leading-relaxed text-gray-600">
                We stay narrow on purpose. Consumer trend goods, cosmetics, and
                fashion sourcing are not our field, and a shallow report in
                someone else's field helps nobody. If your product sits outside
                our range, we say so before you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS INSIDE */}
      <section id="inside" className="scroll-mt-24 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Inside the report
            </p>
            <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-5xl">
              Seven parts. Every one of them decidable.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-gray-600 md:text-lg">
              A summary page, a profile for each recommended supplier, and a
              next-step plan. Nothing in it is there to look impressive — every
              section exists to move you to a decision.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chapters.map((chapter) => (
              <div
                key={chapter.n}
                className="asv-glass-panel flex flex-col rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Section {chapter.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-[#0F172A]">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-600">
                  {chapter.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE MAKE IT */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-20">
        <div className="container mx-auto px-6">
          <div className="asv-glass-panel rounded-[2rem] p-8 md:p-12">
            <div className="mb-10 max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
                How the report is made
              </p>
              <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-4xl">
                Found by hand. Checked one company at a time.
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-gray-600">
                There is no directory scrape and no database export behind this.
                Each candidate is located, read in Korean, and tested with a
                real question before it reaches your shortlist.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[1.6rem] bg-white/70 p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="asv-glass-icon h-11 w-11 rounded-2xl text-blue-600">
                    <Search className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#0F172A]">
                    Where we look
                  </h3>
                </div>
                <ul className="space-y-3">
                  {searchSources.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm font-light leading-relaxed text-gray-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.6rem] bg-white/70 p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="asv-glass-icon h-11 w-11 rounded-2xl text-blue-600">
                    <ListChecks className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#0F172A]">
                    What we check on each one
                  </h3>
                </div>
                <ul className="space-y-3">
                  {perSupplierChecks.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm font-light leading-relaxed text-gray-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS NOT */}
      <section className="bg-[#0a1128] py-20 text-white">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
                The honest edge
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                What this report is not.
              </h2>
              <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-blue-100/70">
                This page says the same thing the report says, because a scope
                limit you only discover after paying is not a scope limit — it
                is a surprise. The report lowers your risk and saves you weeks.
                It does not remove risk, and anyone who promises that is selling
                you something else.
              </p>
            </div>

            <div className="grid gap-3">
              {notThis.map((item) => (
                <div
                  key={item.title}
                  className="asv-glass-panel asv-glass-panel-dark flex items-start gap-4 rounded-2xl p-5"
                >
                  <div className="asv-glass-icon asv-glass-icon-dark h-11 w-11 shrink-0 rounded-2xl text-blue-100">
                    <item.icon className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-blue-50">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-light leading-relaxed text-blue-100/72">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="scroll-mt-24 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Scope and price
            </p>
            <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-5xl">
              Two ways to buy it.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-gray-600 md:text-lg">
              Price moves with how hard the part is to source and how many
              suppliers the market really has. We confirm the exact figure, the
              scope, and the delivery date in writing before you pay anything.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1 ${
                  pkg.highlight
                    ? "border border-blue-100 bg-blue-50/70"
                    : "asv-glass-panel"
                }`}
              >
                <h3 className="text-xl font-semibold tracking-tight text-[#0F172A]">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm font-light text-gray-500">
                  {pkg.lead}
                </p>
                <p className="mt-5 text-3xl font-light tracking-tight text-[#0F172A]">
                  {pkg.price}
                </p>
                <ul className="mt-7 space-y-3">
                  {pkg.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm font-light leading-relaxed text-gray-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button
                    variant={pkg.highlight ? "default" : "outline"}
                    className={`mt-8 h-12 w-full rounded-full ${
                      pkg.highlight
                        ? ""
                        : "border-gray-300 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-20">
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Why our shortlist is worth reading
            </p>
            <h2 className="text-3xl font-light tracking-tight text-[#0F172A] md:text-5xl">
              Anyone can send you five company names.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {credibility.map((item) => (
              <div key={item.title} className="asv-glass-panel rounded-[2rem] p-7">
                <div className="asv-glass-icon mb-5 h-12 w-12 rounded-2xl text-blue-600">
                  <item.icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-[#0F172A]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)] pb-24 pt-4">
        <div className="container mx-auto px-6">
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50/70 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                  Tell us the part. We will tell you if we can help.
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-gray-600">
                  Send the specification, the yearly volume, and the deadline
                  you are working to. You get a straight answer on scope, price,
                  and delivery date before any money moves. Want the background
                  first? Read the{" "}
                  <Link
                    href="/trust-assurance"
                    className="font-semibold text-blue-700 underline underline-offset-4"
                  >
                    buyer trust guide
                  </Link>
                  .
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/contact">
                  <Button className="h-12 rounded-full px-7">
                    Request a Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/instant-quote">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-gray-300 px-7 text-gray-700 hover:bg-white"
                  >
                    Quote Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
