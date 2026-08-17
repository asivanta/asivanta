import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-new-transparent.png";
import { useSeo } from "@/hooks/use-seo";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Login() {
  useSeo(
    "Client Portal | Asivanta",
    "The Asivanta client portal is still in development. Until it launches, our team handles RFQs, supplier reports and order updates directly by email.",
  );

  return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={fadeIn} className="text-center mb-10">
          <Link href="/">
            <img src={logo} alt="ASIVANTA" className="h-16 mx-auto mb-6 brightness-0 invert" />
          </Link>
          <h1 className="text-2xl font-light text-white tracking-tight mb-2">Client Portal</h1>
          <p className="text-gray-400 text-sm font-light">Sign-in is not available yet.</p>
        </motion.div>

        <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-center">
          <div className="h-12 w-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-5">
            <Clock className="h-5 w-5 text-[#3B82F6] stroke-[1.5]" />
          </div>

          <h2 className="text-lg font-semibold text-[#0F172A] mb-3">Client portal is coming soon</h2>
          <p className="text-sm text-gray-600 font-light leading-relaxed mb-7">
            We are still building the online portal for sourcing dashboards and project documents.
            Until it launches, our team handles RFQs, supplier reports and order updates directly by email.
          </p>

          <Link href="/contact">
            <Button size="lg" className="w-full rounded-xl h-12 text-sm font-medium group">
              Contact our team
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-light">
              Existing client? Reach your usual contact at ASIVANTA and we will send your latest status update.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="text-center mt-8">
          <p className="text-gray-500 text-sm font-light">
            Want a preview?{" "}
            <Link href="/portal" className="text-[#3B82F6] hover:text-blue-300 transition-colors font-medium">
              See the portal preview
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
