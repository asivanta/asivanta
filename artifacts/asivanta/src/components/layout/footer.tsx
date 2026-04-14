import React from "react";
import { Link } from "wouter";
import logoImage from "../../assets/logo-new-transparent.png";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a1128] text-white pt-24 pb-12 border-t border-[#1a233a]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-4 flex flex-col">
            <Link href="/" className="mb-6 inline-block">
              <img src={logoImage} alt="ASIVANTA" className="h-12 object-contain brightness-0 invert opacity-90" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Premium sourcing and supply chain advisory for U.S. and global companies working with Korean manufacturers. Bridging capability, culture, and commercial reality.
            </p>
            <div className="flex flex-col gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Seoul, South Korea<br/>Serving Global Procurement Teams</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <a href="mailto:advisory@asivanta.com" className="hover:text-white transition-colors">advisory@asivanta.com</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="font-semibold mb-6 text-gray-100 tracking-wide uppercase text-xs">Advisory</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Methodology</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Industries</a></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Firm</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-6 text-gray-100 tracking-wide uppercase text-xs">Resources</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><Link href="/insights" className="hover:text-white transition-colors">Insights & Articles</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Risk Reports</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-6 text-gray-100 tracking-wide uppercase text-xs">Clients</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li>
                <Link href="/portal" className="group flex items-center gap-2 hover:text-white transition-colors">
                  Client Portal
                </Link>
              </li>
              <li><Link href="/login" className="hover:text-white transition-colors">Secure Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1a233a] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ASIVANTA Advisory. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="mailto:advisory@asivanta.com" className="hover:text-white transition-colors flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Contact Us</span>
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
