import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const values = [
  {
    icon: Shield,
    title: "Due Diligence Before Everything",
    desc: "We verify every supplier before we present them. No shortlists built from directories. No recommendations without on-site assessment. Our clients never inherit our blind spots."
  },
  {
    icon: Globe,
    title: "Native Commercial Fluency",
    desc: "Our team operates in Korean and English across every stage of an engagement — from initial supplier outreach through final negotiation. The language and cultural gaps that cost foreign buyers money are gaps we close before they open."
  },
  {
    icon: Users,
    title: "Aligned Incentives, Full Transparency",
    desc: "We charge advisory fees. We do not take supplier commissions, referral payments, or hidden markups. Our incentive is your outcome — not the size of the deal or who pays us on the other side."
  },
  {
    icon: MapPin,
    title: "Seoul-Based. Actually On the Ground.",
    desc: "Our team is based in Seoul, with direct access to manufacturing clusters across Gyeonggi, Chungcheong, and Gyeongsang provinces. We visit factories in person. That is not standard practice in this industry — it is our standard practice."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-24 bg-[#f9fafb]">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="mb-4">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-light text-[#0F172A] tracking-tight mb-4">
              About ASIVANTA
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-gray-500 font-light max-w-2xl mb-16">
              A Seoul-based procurement advisory firm. We give global companies the in-country expertise, cultural intelligence, and commercial discipline they need to source from Korea without surprises.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid lg:grid-cols-2 gap-16 mb-20">
            <motion.div variants={fadeIn}>
              <h2 className="text-2xl font-medium text-[#0F172A] mb-6">Who We Are</h2>
              <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                <p>
                  ASIVANTA is a procurement and sourcing advisory firm headquartered in Seoul, South Korea. Our team brings over 20 years of combined experience working directly inside the Korean manufacturing sector — not advising from a distance, but operating within it. We understand how Korean suppliers think, how they price, and how they negotiate.
                </p>
                <p>
                  We work exclusively on behalf of buyers. Our clients are typically US and European companies that need verified Korean or Asian manufacturers but lack the on-the-ground presence to find them, assess them, and negotiate with them effectively. We fill that gap — from initial supplier identification through delivery.
                </p>
                <p>
                  We are not a trading company. We do not mark up supplier prices or take commissions from manufacturers. Our fees are transparent, our scope is defined upfront, and our loyalty is to the client. That is how we operate. That is all we do.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h2 className="text-2xl font-medium text-[#0F172A] mb-6">Why This Matters</h2>
              <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                <p>
                  South Korea is a world-class manufacturing economy — precision components, electronics, industrial equipment, advanced materials. The capability is there. The access is not. For most foreign buyers, Korea is a black box: the language is difficult, the business culture is relationship-driven, and the pricing logic is opaque without local context.
                </p>
                <p>
                  The result is predictable. Buyers overpay. They accept terms that disadvantage them. They miss quality signals that any experienced local operator would catch. And by the time problems surface — at the factory audit, during production, or at delivery — the cost of fixing them is already significant.
                </p>
                <p>
                  ASIVANTA exists to prevent those outcomes. We bring the market knowledge, language capability, and supplier relationships that take years to build — so our clients don't have to build them from scratch, and don't have to make expensive mistakes while they learn.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h2 variants={fadeIn} className="text-2xl font-medium text-[#0F172A] mb-10">How We Work</motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeIn}
                  className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] p-8 flex gap-5"
                >
                  <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                    <v.icon className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A] mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mt-20 text-center">
            <Link href="/contact">
              <Button size="lg" className="rounded-full h-14 px-10 text-base hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
