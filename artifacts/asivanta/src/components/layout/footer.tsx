import { Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#081226] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-18">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Asivanta home">
              <span className="text-lg font-semibold tracking-[0.24em] text-white">ASIVANTA</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              Seoul-based, buyer-side procurement and sourcing advisory for overseas buyers reviewing Korean suppliers, RFQs, documents, and open questions before commitment.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-400" /> Seoul, South Korea</p>
              <a href="mailto:hello@asivanta.com" className="flex items-center gap-2 transition hover:text-white"><Mail className="h-4 w-4 text-blue-400" /> hello@asivanta.com</a>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/report" className="hover:text-white">Services</Link></li>
              <li><Link href="/insights" className="hover:text-white">Insights</Link></li>
              <li><Link href="/trust-assurance" className="hover:text-white">Trust & Assurance</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Legal</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Asivanta. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
