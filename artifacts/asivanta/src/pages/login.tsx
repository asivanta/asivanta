import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-new-transparent.png";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
          <h1 className="text-2xl font-light text-white tracking-tight mb-2">Client Portal Login</h1>
          <p className="text-gray-400 text-sm font-light">Access your sourcing dashboard and project documents.</p>
        </motion.div>

        <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#0F172A]">Password</label>
                <button type="button" className="text-xs text-[#3B82F6] hover:text-blue-700 transition-colors">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" size="lg" className="w-full rounded-xl h-12 text-sm font-medium group">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Lock className="h-3 w-3" />
              Secured with end-to-end encryption
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="text-center mt-8">
          <p className="text-gray-500 text-sm font-light">
            Need access?{" "}
            <Link href="/contact" className="text-[#3B82F6] hover:text-blue-300 transition-colors font-medium">
              Contact our team
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
