import React, { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Building2,
  FileText,
  Globe2,
  Briefcase,
  Factory,
  Cpu,
  Zap,
  PackageSearch,
  Lock,
  LineChart,
  FileBox,
  Users,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Images
import heroBg from "../assets/hero-bg.png";
import factoryAbstract from "../assets/factory-abstract.png";
import logisticsAbstract from "../assets/logistics-abstract.png";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative flex h-[90vh] min-h-[600px] items-center justify-center overflow-hidden bg-[#0a1128] md:h-screen"
      >
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Abstract Supply Chain"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_12%,rgba(96,165,250,0.22),transparent_30%),linear-gradient(to_bottom,rgba(10,17,40,0.38),rgba(10,17,40,0.48),#0a1128)]"></div>
          <div className="asv-liquid-sheen absolute inset-0"></div>
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="max-w-4xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div
                  variants={fadeIn}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="h-px w-8 bg-blue-400"></div>
                  <span className="text-blue-400 uppercase tracking-widest text-xs font-semibold">
                    Seoul, South Korea
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeIn}
                  className="mb-6 max-w-full overflow-hidden text-[2.38rem] font-light leading-[1.15] tracking-tight text-white min-[520px]:text-6xl md:text-7xl md:leading-[1.1]"
                >
                  <span className="md:hidden">
                    Transparent
                    <br />
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">
                      Korea
                    </span>{" "}
                    sourcing
                    <br />
                    across{" "}
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
                      Asia
                    </span>
                    <br />
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
                      supply chains.
                    </span>
                  </span>
                  <span className="hidden md:inline">
                    Transparent{" "}
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">
                      Korea
                    </span>{" "}
                    sourcing
                    <br />
                    across{" "}
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
                      Asia supply chains.
                    </span>
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeIn}
                  className="max-w-[20rem] text-xl font-medium tracking-tight text-white mb-6 min-[430px]:max-w-none md:text-2xl"
                >
                  No hidden costs. No cultural gaps. No
                  <br className="md:hidden" /> surprises.
                </motion.p>

                <motion.p
                  variants={fadeIn}
                  className="max-w-[17.5rem] text-base font-light leading-relaxed text-gray-300/80 mb-10 min-[520px]:max-w-2xl md:text-lg"
                >
                  We help global buyers verify Korean suppliers, compare quotes,
                  and negotiate with local context before money, timelines, or
                  quality are put at risk.
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="asv-glass-button h-14 rounded-full px-8 text-base text-[#0a1128] transition-all duration-300 group hover:-translate-y-0.5 hover:bg-white"
                    >
                      Start a Sourcing Review
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/instant-quote">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 rounded-full border-white/30 bg-white/8 px-8 text-lg font-semibold text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_16px_44px_rgba(37,99,235,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/14 hover:text-white"
                    >
                      Quote Now
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.28,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="asv-glass-panel asv-glass-panel-dark hidden rounded-[2.25rem] p-5 text-white lg:block"
              aria-label="ASIVANTA sourcing workflow preview"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200/80">
                    Review Layer
                  </p>
                  <h2 className="mt-1 text-2xl font-light tracking-tight">
                    Before the PO.
                  </h2>
                </div>
                <div className="asv-glass-icon asv-glass-icon-dark h-12 w-12 rounded-2xl">
                  <ShieldCheck className="h-6 w-6 stroke-[1.5]" />
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  {
                    icon: <Search />,
                    label: "Supplier check",
                    value: "Factory reality",
                  },
                  {
                    icon: <FileText />,
                    label: "Quote review",
                    value: "Hidden-cost scan",
                  },
                  {
                    icon: <Building2 />,
                    label: "Local context",
                    value: "Seoul-side clarity",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-[1.35rem] border border-white/14 bg-white/8 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl"
                  >
                    <div className="asv-glass-icon asv-glass-icon-dark h-11 w-11 shrink-0 rounded-2xl">
                      {React.cloneElement(
                        item.icon as React.ReactElement<{ className?: string }>,
                        { className: "h-5 w-5 stroke-[1.5]" },
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-blue-100/62">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/10 bg-[#0a1128]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            ["Seoul-based", "Local Korean supplier communication"],
            ["Buyer-side", "Independent advisory, not a trading desk"],
            ["Pre-PO", "Verification before commitment"],
            ["Cross-border", "Language, culture, and commercial alignment"],
          ].map(([label, desc]) => (
            <div
              key={label}
              className="asv-glass-panel asv-glass-panel-dark rounded-3xl px-4 py-5 md:px-5 md:py-6"
            >
              <p className="text-lg font-semibold tracking-tight text-white md:text-xl">
                {label}
              </p>
              <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-blue-100/65 md:text-sm">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. THE PROBLEM / WHY ASIVANTA */}
      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] py-28 md:py-36"
        id="why-asivanta"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-[2.75rem] md:leading-[1.2] font-light text-[#0F172A] mb-6 tracking-tight"
            >
              The gap between{" "}
              <span className="font-semibold">expectation and reality</span> in
              cross-border procurement.
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-500 leading-relaxed font-light max-w-2xl mx-auto"
            >
              Sourcing from Korea offers strong manufacturing capability and
              quality. But without local presence, buyers often face pricing
              gaps, unverified supplier claims, and cultural misalignment that
              lead to delays and costly mistakes.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: (
                  <Search className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                ),
                title: "Supplier Transparency",
                desc: "Without on-the-ground verification, it's difficult to confirm whether a supplier is a true manufacturer or a trading intermediary.",
              },
              {
                icon: (
                  <Globe2 className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                ),
                title: "Cultural Misalignment",
                desc: "Unspoken assumptions, unclear expectations, and indirect communication often lead to rework, delays, and quality issues.",
              },
              {
                icon: (
                  <ShieldCheck className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                ),
                title: "Commercial Risk",
                desc: "Signing terms without understanding local practices can result in overpayment, weak protection, and limited control.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.12,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    },
                  },
                }}
                className="asv-glass-panel rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1 md:p-10 group"
              >
                <div className="asv-glass-icon mb-7 h-12 w-12 rounded-2xl text-[#3B82F6]">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. CAPABILITIES / SERVICES */}
      <section
        className="relative overflow-hidden border-y border-white/60 bg-[linear-gradient(180deg,#eef5ff_0%,#f7fbff_52%,#ffffff_100%)] py-24"
        id="services"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-6 bg-blue-600"></div>
                <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold">
                  Our Capabilities
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">
                End-to-end advisory for <br />
                <span className="font-medium text-[#0a1128]">
                  complex procurement.
                </span>
              </h2>
            </div>
            <Link href="/contact">
              <Button
                variant="ghost"
                className="group text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
              >
                Discuss Your Requirements{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe2 />,
                title: "Supplier Sourcing",
                desc: "Identification and shortlisting of qualified Korean manufacturing partners based on technical requirements and commercial fit.",
              },
              {
                icon: <ShieldCheck />,
                title: "Manufacturer Verification",
                desc: "Deep due diligence to verify facility legitimacy, production capacity, financial health, and export history.",
              },
              {
                icon: <FileText />,
                title: "Pricing & Term Negotiation",
                desc: "Strategic negotiation bridging local pricing logic and global expectations to secure sustainable commercial terms.",
              },
              {
                icon: <Factory />,
                title: "Factory Readiness Review",
                desc: "On-site assessment of quality management systems, ESG compliance, and production readiness before PO issuance.",
              },
              {
                icon: <LineChart />,
                title: "Quote Comparison Guidance",
                desc: "Analytical breakdown of competing quotes, identifying hidden costs and analyzing landed-cost implications.",
              },
              {
                icon: <Users />,
                title: "Market Communication",
                desc: "Ongoing alignment between buyer and supplier to prevent specification drift and manage production milestones.",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.1, duration: 0.5 },
                  },
                }}
                className="asv-glass-panel rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="asv-glass-icon mb-6 h-14 w-14 rounded-3xl text-blue-600">
                  {React.cloneElement(
                    service.icon as React.ReactElement<{ className?: string }>,
                    { className: "h-7 w-7 stroke-[1.5]" },
                  )}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3B. ENGAGEMENT OPTIONS */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-24">
        <div className="container mx-auto px-6">
          <div className="mb-14 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-6 bg-blue-600"></div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Ways to engage
              </span>
            </div>
            <h2 className="text-3xl font-light tracking-tight text-gray-900 md:text-5xl">
              Choose the level of control your sourcing decision requires.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Supplier Shortlist",
                desc: "Market scan, initial outreach, and qualified supplier options for a defined part, product, or capability.",
                items: [
                  "Requirement intake",
                  "Supplier mapping",
                  "Initial fit screening",
                ],
              },
              {
                title: "Verification Review",
                desc: "Pre-commitment diligence to reduce risk before sample payment, tooling, deposit, or purchase order.",
                items: [
                  "Manufacturer legitimacy",
                  "Capability validation",
                  "Commercial risk notes",
                ],
              },
              {
                title: "Managed Sourcing",
                desc: "Ongoing buyer-side support across supplier communication, quote comparison, negotiation, and milestones.",
                items: [
                  "Quote comparison",
                  "Negotiation context",
                  "Production milestone tracking",
                ],
              },
            ].map((option) => (
              <div
                key={option.title}
                className="asv-glass-panel rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="mb-3 text-xl font-medium tracking-tight text-[#0F172A]">
                  {option.title}
                </h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-gray-500">
                  {option.desc}
                </p>
                <ul className="space-y-3">
                  {option.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Methodology) */}
      <section
        className="bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] py-24"
        id="how-it-works"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight">
              A rigorous methodology for{" "}
              <span className="font-semibold text-[#0a1128]">
                risk reduction.
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              We replace guesswork with a structured, step-by-step verification
              process designed for enterprise procurement standards.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Define",
                  desc: "Aligning on technical specifications, target pricing, and compliance requirements.",
                },
                {
                  step: "02",
                  title: "Identify",
                  desc: "Mapping the supplier landscape and shortlisting verified capable facilities.",
                },
                {
                  step: "03",
                  title: "Verify",
                  desc: "Conducting commercial, operational, and site-level due diligence.",
                },
                {
                  step: "04",
                  title: "Execute",
                  desc: "Supporting negotiation, sampling, and ongoing production risk management.",
                },
              ].map((phase, i) => (
                <div
                  key={i}
                  className="asv-glass-panel rounded-[1.75rem] p-6 text-center"
                >
                  <div className="asv-glass-icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0a1128]/90 text-sm font-semibold text-white shadow-lg font-mono">
                    {phase.step}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light">
                    {phase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FACTORY READINESS HIGHLIGHT */}
      <section className="relative overflow-hidden bg-[#0a1128] py-24 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={factoryAbstract}
            alt="Factory"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-[#0a1128]/86 to-transparent"></div>
          <div className="asv-liquid-sheen absolute inset-0"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight text-white">
              Trust, but{" "}
              <span className="font-medium text-blue-400">
                verify on the ground.
              </span>
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed mb-8">
              A polished website doesn't guarantee production capability. Our
              Seoul-based team conducts rigorous factory readiness reviews,
              assessing quality management systems, equipment condition, and
              actual capacity before you issue a Purchase Order.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "On-site facility legitimacy checks",
                "Quality Management System (QMS) audits",
                "Machine capability and capacity validation",
                "Sub-tier supplier mapping",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-200">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <Button
                size="lg"
                className="h-12 rounded-full border border-white/25 bg-blue-500/70 px-8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_44px_rgba(37,99,235,0.28)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Request Verification Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRIES SERVED */}
      <section
        className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-24"
        id="industries"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Industries &{" "}
              <span className="font-medium text-[#0a1128]">Expertise</span>
            </h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              We serve global procurement teams across technically demanding
              sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                icon: <Cpu />,
                name: "Electronics & Semiconductors",
              },
              {
                icon: <Building2 />,
                name: "Industrial Components",
              },
              {
                icon: <PackageSearch />,
                name: "Consumer Products",
              },
              {
                icon: <Zap />,
                name: "OEM/ODM Projects",
              },
            ].map((ind, i) => (
              <div
                key={i}
                className="asv-glass-panel rounded-[2rem] p-8 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-5 flex justify-center">
                  <div className="asv-glass-icon h-14 w-14 rounded-3xl text-blue-600">
                    {React.cloneElement(
                      ind.icon as React.ReactElement<{ className?: string }>,
                      { className: "h-7 w-7 stroke-[1.5]" },
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">{ind.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLIENT PORTAL TEASER */}
      <section className="relative overflow-hidden border-t border-white/70 bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] py-24">
        {/* Decorative background element */}
        <div className="asv-liquid-sheen absolute inset-0 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wider mb-6">
                <Lock className="h-3 w-3" /> SECURE ACCESS
              </div>
              <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
                Your supply chain, <br />
                <span className="font-medium text-[#0a1128]">centralized.</span>
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                Our secure client portal gives you real-time visibility into
                your Korean sourcing operations. Track supplier interactions,
                manage documents, and compare quotes in one unified workspace.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Secure File Exchange",
                  "Centralized Quote Requests",
                  "Audit Report Archive",
                  "Project Tracking & Milestones",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckIcon />
                    <span className="text-gray-700 font-medium text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/portal">
                <Button
                  variant="outline"
                  className="rounded-full h-12 px-6 border-gray-300 text-gray-700 hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Access Client Portal
                </Button>
              </Link>
            </div>

            {/* Abstract UI Mockup */}
            <div className="relative">
              <div className="asv-glass-panel flex aspect-[4/3] transform flex-col overflow-hidden rounded-[2rem] transition-transform duration-500 hover:rotate-0 lg:rotate-2">
                <div className="flex h-12 items-center gap-2 border-b border-white/50 bg-white/35 px-4 backdrop-blur-xl">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="ml-4 h-6 w-48 rounded-full border border-white/50 bg-white/50"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 w-48 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-blue-600/20 rounded"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="asv-glass-panel h-24 flex-1 rounded-2xl p-4">
                      <div className="h-3 w-16 bg-gray-200 rounded mb-3"></div>
                      <div className="h-6 w-24 bg-blue-100 rounded"></div>
                    </div>
                    <div className="asv-glass-panel h-24 flex-1 rounded-2xl p-4">
                      <div className="h-3 w-16 bg-gray-200 rounded mb-3"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="asv-glass-panel mt-2 flex-1 rounded-2xl p-4">
                    <div className="h-4 w-full bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                  <div className="asv-glass-panel flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-gray-800">
                    <Lock className="h-4 w-4" /> ASIVANTA Portal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GLOBAL LOGISTICS ABSTRACT */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={logisticsAbstract}
            alt="Logistics Network"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#0a1128]/76 backdrop-blur-sm z-10"></div>
        <div className="asv-liquid-sheen absolute inset-0 z-10"></div>

        <div className="container relative z-20 mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-8 tracking-tight max-w-3xl mx-auto">
            Your trusted bridge between global headquarters and{" "}
            <span className="font-medium text-blue-400">
              Korean manufacturing reality.
            </span>
          </h2>
          <Link href="/about">
            <Button
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-white/8 px-8 text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl hover:bg-white/14 hover:text-white"
            >
              Learn About Our Firm
            </Button>
          </Link>
        </div>
      </section>

      {/* 9. INSIGHTS & RESOURCES */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-light text-gray-900 tracking-tight">
                Sourcing <span className="font-medium">Insights</span>
              </h2>
              <p className="text-gray-500 font-light mt-2">
                Expert perspectives on managing risk in Korea.
              </p>
            </div>
            <Link
              href="/insights"
              className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All Articles <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                type: "Article",
                title: "How to verify a Korean supplier before signing",
                desc: "A step-by-step guide to conducting commercial due diligence on manufacturers.",
              },
              {
                type: "Video",
                title: "MOQ, lead time, and payment terms: what buyers miss",
                desc: "Understanding the unwritten rules of negotiating with Korean factories.",
              },
              {
                type: "Report",
                title: "How to reduce sourcing mistakes in Korea",
                desc: "The most common blind spots for foreign buyers and how to avoid them.",
              },
            ].map((insight, i) => (
              <Link key={i} href="/insights" className="group cursor-pointer">
                <div className="asv-glass-panel flex h-full flex-col rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-blue-600">
                      {insight.type}
                    </span>
                    {insight.type === "Video" ? (
                      <PlayCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-light mt-auto">
                    {insight.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="relative overflow-hidden border-t border-blue-900/30 bg-[#0a1128] py-24 text-center">
        <div className="asv-liquid-sheen absolute inset-0"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
              Ready to secure your supply chain?
            </h2>
            <p className="text-gray-300 font-light mb-10 text-lg">
              Send the part, supplier, RFQ, or sourcing challenge you are
              evaluating. We will help you decide what to verify before you
              commit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="asv-glass-button h-14 w-full rounded-full px-10 text-base font-medium text-[#0a1128] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:w-auto"
                >
                  Get in Touch
                </Button>
              </Link>
              <Link href="/instant-quote">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full rounded-full border-white/30 bg-white/8 px-8 text-lg font-semibold text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_16px_44px_rgba(37,99,235,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white sm:w-auto"
                >
                  Quote Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
      <svg
        className="w-3 h-3 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
}
