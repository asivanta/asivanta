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
  "https://www.asivanta.com/insights/korea-physical-ai-rd-partner-checklist";

const sourceLinks = [
  {
    label: "Global Affairs Canada — Physical AI R&D delegation to Korea",
    href: "https://www.tradecommissioner.gc.ca/en/our-solutions/support-programs/canadian-international-innovation-program/physical-ai-south-korea.html",
  },
  {
    label: "Korea Ministry of Science and ICT — Physical AI initiative",
    href: "https://www.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&nttSeqNo=1178&sCode=eng",
  },
  {
    label: "KOTRA Global Partnership — sourcing and joint R&D pathways",
    href: "https://buykorea.org/gp/kotra/html/en/main/index.do",
  },
  {
    label: "RobotWorld 2026 official website",
    href: "https://eng.robotworld.or.kr/",
  },
  {
    label: "Korea Industrial Complex Corporation Factory On",
    href: "https://www.factoryon.go.kr/main/main.do",
  },
  {
    label: "IAF CertSearch accredited certificate verification",
    href: "https://www.iafcertsearch.org/verify-certificates",
  },
];

const roleDefinitions = [
  {
    role: "Co-development partner",
    evidence:
      "Named engineering owners, work packages, milestones, foreground IP, background IP, and a decision process for technical changes.",
  },
  {
    role: "Manufacturer or contract manufacturer",
    evidence:
      "Legal entity, factory address, internal and subcontracted processes, equipment fit, sample plan, quality ownership, and scale-up limits.",
  },
  {
    role: "System integrator",
    evidence:
      "Integration boundary, supported hardware and software, site responsibility, acceptance test, safety ownership, training, and maintenance scope.",
  },
  {
    role: "Pilot customer or test site",
    evidence:
      "Use case, operating environment, data access, baseline, success metric, test period, site owner, and route from pilot to purchase.",
  },
  {
    role: "Research institute or university",
    evidence:
      "Principal investigator, laboratory capability, available equipment, publication rules, licensing route, project funding, and commercialization owner.",
  },
  {
    role: "Distributor or market partner",
    evidence:
      "Target accounts, territory, technical support, lead ownership, demo responsibility, commercial terms, and performance review date.",
  },
];

const firstMeetingQuestions = [
  "What exact problem will the Korean partner solve, and for which user or production site?",
  "Which organization will own the pilot, the budget, and the go-or-stop decision?",
  "What hardware, model, software, data, process, or manufacturing contribution comes from each side?",
  "Which existing intellectual property stays with each party, and who may use new results?",
  "What data is needed, where may it be stored, and who may access or reuse it?",
  "What safety, cybersecurity, certification, export-control, or site rules apply?",
  "Which process steps happen at the named Korean site, and which are subcontracted?",
  "What measurable result would make the pilot successful?",
  "What happens after success: paid deployment, licence, supply agreement, joint product, or another test?",
  "Which open question must be answered before either side spends money?",
];

const evidencePack = [
  "One-page use case with operating conditions, users, constraints, and the present baseline",
  "Partner-role map showing who supplies, integrates, tests, approves, pays, and supports",
  "Technical interface list covering hardware, software, data, power, network, and site dependencies",
  "Pilot plan with inputs, milestones, acceptance criteria, schedule, cost, and stop conditions",
  "Legal company identity and the exact contracting entity on both sides",
  "Relevant team biographies, project references, patents, certificates, and laboratory or factory evidence",
  "Written IP, confidentiality, publication, data, security, and change-control questions",
  "Commercial path from pilot to repeatable deployment or production",
];

const meetingOutputs = [
  "A named owner on each side",
  "A one-sentence problem and one-sentence proposed role",
  "A list of evidence received, evidence promised, and claims still unverified",
  "One technical next step with a date",
  "One commercial or legal next step with a date",
  "A clear stop rule if the evidence or ownership does not align",
];

const pauseSignals = [
  {
    title: "The partner role keeps changing",
    text: "A manufacturer becomes a broker, or an integrator becomes only an introducer, after detailed questions begin.",
  },
  {
    title: "No one owns the pilot result",
    text: "The meeting is enthusiastic, but no budget owner, test owner, acceptance metric, or purchase path is named.",
  },
  {
    title: "IP and data are postponed indefinitely",
    text: "Both sides plan to exchange models, drawings, source material, or operating data before agreeing who may use them.",
  },
  {
    title: "Factory or laboratory claims cannot be tied to a site",
    text: "Presentations show equipment or facilities, but the legal entity, address, access, process ownership, or current availability remains unclear.",
  },
  {
    title: "A demonstration is treated as production proof",
    text: "A successful demo does not yet show repeatability, safety, maintenance, quality control, capacity, or total deployment cost.",
  },
  {
    title: "The next step is only another general meeting",
    text: "A useful meeting should end with evidence, an owner, a dated action, or an honest decision to stop.",
  },
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

export default function KoreaPhysicalAiRdPartnerChecklist() {
  useSeo(
    "Korea Physical AI R&D Partner Checklist | Asivanta",
    "A practical checklist for overseas robotics, sensing, industrial AI, and automation companies evaluating a Korean R&D, manufacturing, integration, or pilot partner.",
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.asivantaArticle = "korea-physical-ai-rd-partner-checklist";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "Korea Physical AI R&D Partner Checklist: From First Meeting to a Verifiable Pilot",
      description:
        "A buyer-side checklist for defining Korean R&D, manufacturing, system-integration, test-site, and commercial partner roles before a physical-AI pilot or co-development commitment.",
      datePublished: "2026-08-20",
      dateModified: "2026-08-20",
      mainEntityOfPage: articleUrl,
      isAccessibleForFree: true,
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
      citation: sourceLinks.map((source) => source.href),
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
                Physical AI and joint R&D
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Korea physical AI R&amp;D partner checklist: from first meeting
                to a verifiable pilot
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                A good introduction is not yet a partnership. Define the Korean
                partner&apos;s role, evidence, ownership, pilot result, and next
                commercial decision before either side commits time, data, IP,
                or money.
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
                  10-minute guide
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <p className="text-xl leading-9 text-slate-700">
              Physical AI partnerships often cross several boundaries at once:
              software and hardware, laboratory and factory, demonstration and
              deployment, research and commercial ownership. The first job is to
              make those boundaries visible.
            </p>
            <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
              Global Affairs Canada&apos;s 2026 Korea delegation, for example,
              focuses on robotics and autonomous systems, embodied and agentic
              AI, sensing, control, manufacturing automation, validation, and
              joint product development. The official program schedules its
              Seoul activity for 2–5 November 2026 and includes meetings with
              Korean manufacturers, integrators, research organizations, and
              innovation players.
            </p>

            <aside className="my-12 rounded-3xl bg-[#f5f5f7] p-7 md:p-9">
              <p className="text-sm font-semibold text-[#0071e3]">
                The partnership rule
              </p>
              <p className="mt-3 text-2xl font-semibold leading-9 tracking-tight">
                Do not ask only “Is this a good Korean partner?” Ask “Good for
                which role, supported by which evidence, under whose ownership,
                and measured by what result?”
              </p>
            </aside>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">01</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Define the partner role before discussing the company name
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                One Korean organization may be a strong integrator and a weak
                manufacturer, or an excellent research laboratory with no route
                to a purchase order. Write down the role you need and the
                evidence that would support it.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {roleDefinitions.map((item) => (
                  <div
                    key={item.role}
                    className="rounded-2xl border border-black/10 p-6"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {item.role}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">02</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Bring ten questions to the first meeting
              </h2>
              <Checklist items={firstMeetingQuestions} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                These questions are not a contract. They reveal whether the
                parties are discussing the same project and whether a more
                detailed technical, legal, security, or commercial review is
                justified.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">03</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Build an evidence pack—not a larger slide deck
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                KOTRA&apos;s Global Partnership program recognizes sourcing,
                joint R&amp;D, manufacturing services, and investment as
                different cooperation types. Your evidence should match the
                selected type and the decision you expect next.
              </p>
              <Checklist items={evidencePack} />
              <p className="mt-6 text-[1.05rem] leading-8 text-slate-600">
                For a manufacturing role, connect the legal entity to the
                claimed production site and process. Factory On can support a
                Korean factory-record check. For an accredited management
                system, IAF CertSearch can support verification of the covered
                legal entity, site, standard, scope, issuer, and status. Neither
                record proves that your specific robot, sensor, component, or
                deployment will meet requirements.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">04</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Turn a demonstration into a pilot decision
              </h2>
              <p className="mt-5 text-[1.05rem] leading-8 text-slate-600">
                A demonstration shows that something worked once under the
                demonstrated conditions. A pilot should test a written use case
                under conditions that matter to the future customer or site.
              </p>
              <div className="mt-7 overflow-hidden rounded-2xl border border-black/10">
                {[
                  [
                    "Baseline",
                    "Record the present cycle time, accuracy, intervention rate, downtime, cost, or other metric before the pilot.",
                  ],
                  [
                    "Test conditions",
                    "Define the site, users, materials, lighting, network, safety boundary, operating hours, and edge cases.",
                  ],
                  [
                    "Acceptance",
                    "Write the metric, test method, evidence owner, review date, and allowed exceptions before testing begins.",
                  ],
                  [
                    "Failure response",
                    "Agree who investigates, which logs or samples may be shared, how changes are approved, and when testing stops.",
                  ],
                  [
                    "Scale path",
                    "Estimate integration work, hardware availability, production capacity, support, certification, cybersecurity, and total deployment cost.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="grid border-t border-black/10 first:border-t-0 md:grid-cols-[0.35fr_1fr]"
                  >
                    <div className="bg-[#f5f5f7] p-4 font-semibold text-slate-800">
                      {title}
                    </div>
                    <div className="p-4 text-sm leading-6 text-slate-600 md:border-l md:border-black/10">
                      {text}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">05</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Leave every meeting with six written outputs
              </h2>
              <Checklist items={meetingOutputs} />
              <p className="mt-6 font-medium leading-8 text-slate-700">
                “Interesting discussion” is not a next step. A useful meeting
                changes the evidence, ownership, schedule, or decision.
              </p>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">06</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Pause when the structure stays unclear
              </h2>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {pauseSignals.map((signal) => (
                  <div
                    key={signal.title}
                    className="rounded-2xl border border-black/10 p-6"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {signal.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 py-12">
              <p className="text-sm font-semibold text-[#0071e3]">07</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Use a simple 30-day follow-through
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  [
                    "Days 1–3",
                    "Confirm the role, owners, evidence received, open questions, and next meeting in one written note.",
                  ],
                  [
                    "Days 4–14",
                    "Check the legal entity, site, team, references, certificate scope, interfaces, pilot inputs, and ownership questions.",
                  ],
                  [
                    "Days 15–30",
                    "Approve a narrow pilot plan, request missing evidence, change the partner role, or stop before the commitment grows.",
                  ],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-[#f5f5f7] p-6">
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="my-8 rounded-3xl bg-[#07172f] p-8 text-white md:p-12">
              <p className="text-sm font-semibold text-[#69aafc]">
                One-partner Korea review
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Have a Korean R&amp;D, manufacturing, or integration candidate?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Send Asivanta one proposed partner and use case. We can organize
                the role, public and Korean-language evidence, conflicts, open
                questions, and the next check before a pilot or co-development
                commitment.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#0071e3] px-7 font-medium text-white transition-colors hover:bg-[#0077ed]"
              >
                Start a partner review
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            <section className="border-t border-black/10 pt-12">
              <h2 className="text-xl font-semibold tracking-tight">
                Sources and scope
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This independent educational guide is not affiliated with or
                endorsed by Global Affairs Canada, the Embassy of Canada, CIIP,
                KOTRA, RobotWorld, the Korean government, or any event
                participant. It is not legal, IP, tax, grant, export-control,
                sanctions, cybersecurity, certification, safety, or engineering
                advice. Programs, records, and requirements can change. Use the
                responsible authority and qualified specialists for important
                decisions.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {sourceLinks.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#0066cc] hover:underline"
                    >
                      {source.label}
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-black/10 p-6">
                <p className="text-sm font-semibold text-slate-900">
                  Related verification guide
                </p>
                <Link
                  href="/insights/korean-manufacturer-vs-trading-company"
                  className="mt-2 inline-flex items-center gap-2 font-medium text-[#0066cc] hover:underline"
                >
                  Check what Korean business, factory, and certificate records
                  actually prove
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
