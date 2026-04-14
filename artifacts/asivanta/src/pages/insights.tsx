import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const articles = [
  {
    id: 1,
    title: "How to Verify a Korean Supplier Before Commitment",
    preview: "What to check before you send payment or sign terms.",
    readTime: "6 min read",
    date: "March 2026",
    category: "Supplier Verification",
    body: [
      "Sending a wire transfer to a supplier you have never physically visited is one of the highest-risk moments in cross-border sourcing. In Korea, where business culture relies heavily on relationships and trust built over time, foreign buyers are at a structural disadvantage from the start.",
      "Before committing capital or signing any binding terms, buyers should complete a minimum due-diligence checklist that goes well beyond reviewing a supplier's website or trade-show booth.",
      "Start with corporate registration verification. Every legitimate Korean manufacturer is registered with the Korean Fair Trade Commission and holds a Business Registration Number. Cross-reference this against publicly available databases. If the supplier cannot or will not provide this, walk away.",
      "Next, request audited financial statements for the most recent two fiscal years. Korean accounting standards (K-IFRS) are aligned with international norms, making it straightforward to assess solvency, debt ratios, and revenue consistency. A supplier that resists sharing financials is a supplier with something to hide.",
      "Conduct a physical factory visit — or engage a local advisory firm to do so on your behalf. During the visit, verify production capacity against the supplier's claims. Check equipment age, workforce size, quality management certifications (ISO 9001, IATF 16949 for automotive), and environmental compliance.",
      "Finally, request customer references from at least two existing export clients. Contact them directly and ask about on-time delivery rates, defect ratios, and responsiveness to quality claims. A supplier with strong references will be happy to share them.",
      "Verification is not a sign of distrust — it is a standard business practice that reputable Korean manufacturers expect and respect from serious international buyers."
    ]
  },
  {
    id: 2,
    title: "MOQ, Lead Time, and Payment Terms: What Buyers Miss",
    preview: "Where most sourcing mistakes begin.",
    readTime: "5 min read",
    date: "February 2026",
    category: "Commercial Strategy",
    body: [
      "The three variables that derail more sourcing relationships than quality defects combined are minimum order quantities, lead times, and payment terms. Each one is negotiable — but only if you understand how Korean suppliers think about them.",
      "Minimum Order Quantities (MOQs) in Korea are often higher than buyers expect, particularly for specialty materials and precision components. This is not arbitrary — it reflects setup costs, raw material procurement cycles, and the supplier's own margin structure. Pushing for dramatically lower MOQs without understanding these constraints signals inexperience and erodes trust.",
      "A more effective approach: negotiate a trial order at a modestly higher unit price, with a written agreement that pricing will step down once volumes reach the supplier's standard MOQ threshold. This gives both parties a low-risk entry point.",
      "Lead times in Korea are generally reliable by global standards, but they are not infinitely flexible. Most manufacturers plan production 4-8 weeks out. Requesting rush orders repeatedly marks you as a difficult client. Instead, build a rolling forecast relationship: share your projected demand quarterly, and the supplier can pre-position raw materials accordingly.",
      "Payment terms are where cultural misunderstandings cause the most friction. Korean suppliers strongly prefer T/T (telegraphic transfer) with a deposit structure — typically 30% upfront, 70% before shipment. Letters of Credit (L/C) are accepted but considered slow and bureaucratic. Net-30 or Net-60 terms are rarely offered to new foreign clients.",
      "The key insight: all three variables are interconnected. A buyer who commits to higher volumes can negotiate better payment terms. A buyer who provides reliable forecasts earns shorter lead times. Approach these as a package, not as isolated line items."
    ]
  },
  {
    id: 3,
    title: "Reducing Supplier Risk in Korea: A Practical Approach",
    preview: "How to move from uncertainty to confidence.",
    readTime: "7 min read",
    date: "January 2026",
    category: "Risk Management",
    body: [
      "Supplier risk in Korea is not higher or lower than in other manufacturing economies — it is different. Understanding the specific risk profile of Korean suppliers allows buyers to mitigate effectively rather than reactively.",
      "The first category of risk is financial. Korean manufacturers, particularly mid-sized firms, often carry higher leverage ratios than their Western counterparts. This is partly structural — Korean banks have historically extended generous credit lines to manufacturing firms — but it means that a supplier's apparent stability can mask underlying financial stress. Annual financial reviews should be non-negotiable.",
      "The second category is operational. Korea's manufacturing sector is highly concentrated geographically. A single natural disaster, labor action, or infrastructure disruption in the Gyeongsang or Chungcheong provinces could affect dozens of suppliers simultaneously. Diversifying across regions — or at minimum, maintaining a qualified backup supplier — is essential.",
      "The third category is relational. In Korean business culture, relationships carry contractual weight. A supplier who feels disrespected or undervalued may deprioritize your orders in favor of domestic clients or longer-standing partners. This is not malice — it is the natural consequence of a relationship-driven business environment.",
      "Practical mitigation starts with structured communication. Establish a regular cadence of calls or visits — quarterly at minimum. Assign a dedicated point of contact rather than rotating through procurement staff. Learn the basics of Korean business etiquette: exchanging business cards with both hands, addressing counterparts by title, and understanding that \"we will review\" often means \"no.\"",
      "Invest in a local presence or partnership. Having a Korean-speaking representative who can visit factories, attend industry events, and maintain relationships between orders is the single most effective risk-reduction strategy available to foreign buyers.",
      "Risk is never eliminated — it is managed. The buyers who succeed in Korea are those who treat supplier relationships as long-term investments, not transactional conveniences."
    ]
  }
];

export default function Insights() {
  const [activeArticle, setActiveArticle] = useState<number | null>(null);
  const selected = articles.find((a) => a.id === activeArticle);

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
              Insights
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-gray-500 font-light max-w-xl mb-16">
              Practical perspectives on sourcing, supplier risk, and Korea market execution.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {articles.map((article) => (
              <motion.article
                key={article.id}
                variants={fadeIn}
                className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveArticle(article.id)}
              >
                <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]" />
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-medium text-[#3B82F6] bg-blue-50 px-2.5 py-1 rounded-full">{article.category}</span>
                    <span className="text-xs text-gray-400">{article.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-[#0F172A] leading-snug mb-3 group-hover:text-[#3B82F6] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 font-light text-sm leading-relaxed mb-6 flex-1">
                    {article.preview}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      {article.readTime}
                    </span>
                    <span className="text-sm font-medium text-[#3B82F6] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-12 px-4"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-t-2xl" />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-medium text-[#3B82F6] bg-blue-50 px-2.5 py-1 rounded-full">{selected.category}</span>
                  <span className="text-xs text-gray-400">{selected.date}</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {selected.readTime}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] leading-tight mb-8">
                  {selected.title}
                </h1>

                <div className="space-y-5">
                  {selected.body.map((paragraph, i) => (
                    <p key={i} className="text-gray-600 font-light leading-relaxed text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <Link href="/contact">
                    <Button className="rounded-full h-11 px-6 hover:-translate-y-0.5 transition-all duration-300">
                      Get in Touch
                    </Button>
                  </Link>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
