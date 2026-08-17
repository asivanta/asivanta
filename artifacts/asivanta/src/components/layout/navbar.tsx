import React, { useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import logoImage from "../../assets/logo-nav.png";
import { useNavigationBackgroundTone } from "./use-navigation-background-tone";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isLightBackground = useNavigationBackgroundTone(headerRef);
  const navigationShadow = {
    filter: isLightBackground
      ? "drop-shadow(0 1px 2px rgba(0, 45, 110, 1)) drop-shadow(0 0 8px rgba(0, 113, 227, 0.95))"
      : "drop-shadow(0 1px 2px rgba(0, 0, 0, 1)) drop-shadow(0 0 5px rgba(0, 0, 0, 0.65))",
  };
  const logoTreatment = {
    filter: isLightBackground
      ? "drop-shadow(0 1px 2px rgba(0, 45, 110, 1)) drop-shadow(0 0 8px rgba(0, 113, 227, 0.75))"
      : "brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 1))",
  };

  return (
    <>
      <style>{`
        @keyframes asivantaQuoteNowPulse {
          0%, 82%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(96, 165, 250, 0); }
          88% { transform: scale(1.045); box-shadow: 0 0 22px rgba(96, 165, 250, 0.22); }
          92% { transform: scale(1.015); }
        }
        @media (prefers-reduced-motion: reduce) {
          .asivanta-quote-now-link { animation: none !important; }
        }
      `}</style>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 border-b border-transparent bg-transparent py-1"
        data-background-tone={isLightBackground ? "light" : "dark"}
      >
        <div className="w-full px-6 md:px-10 lg:px-12 flex items-center">
          <Link href="/" className="flex items-center z-50 relative shrink-0">
            <img
              src={logoImage}
              alt="ASIVANTA"
              className={`h-16 object-contain md:h-24 ${
                mobileMenuOpen ? "brightness-0" : ""
              }`}
              style={mobileMenuOpen ? undefined : logoTreatment}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-8 lg:gap-12 xl:gap-16 ml-10 lg:ml-20">
            <a
              href="#services"
              className="text-sm font-medium text-white transition-opacity hover:opacity-75"
              style={navigationShadow}
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-white transition-opacity hover:opacity-75"
              style={navigationShadow}
            >
              How It Works
            </a>
            <a
              href="#industries"
              className="text-sm font-medium text-white transition-opacity hover:opacity-75"
              style={navigationShadow}
            >
              Industries
            </a>
            <Link
              href="/report"
              className="text-sm font-medium text-white transition-opacity hover:opacity-75"
              style={navigationShadow}
            >
              The Report
            </Link>
            <Link
              href="/insights"
              className="text-sm font-medium text-white transition-opacity hover:opacity-75"
              style={navigationShadow}
            >
              Insights
            </Link>
            <Link
              href="/instant-quote"
              className="asivanta-quote-now-link flex items-center gap-1 rounded-full border border-white/40 bg-black/20 px-4 py-2 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_34px_rgba(15,23,42,0.16)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-100/80 hover:bg-black/30"
              style={{
                animation: "asivantaQuoteNowPulse 6.5s ease-in-out infinite",
              }}
            >
              Quote Now
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-50 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-white" style={navigationShadow} />
            )}
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out flex flex-col pt-24 px-6 ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <nav className="flex flex-col gap-6 text-lg font-medium">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
              >
                Services <ArrowRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
              >
                How It Works <ArrowRight className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="#industries"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
              >
                Industries <ArrowRight className="h-4 w-4 text-gray-400" />
              </a>
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
              >
                The Report <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/insights"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
              >
                Insights <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/instant-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 flex justify-between items-center"
              >
                Quote Now <ArrowRight className="h-4 w-4 text-blue-500" />
              </Link>

              <div className="mt-8">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full" size="lg">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
