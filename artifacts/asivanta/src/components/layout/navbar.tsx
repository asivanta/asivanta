import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import logoImage from "../../assets/logo-nav.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        mobileMenuOpen
          ? "bg-white border-gray-100 py-1 shadow-sm"
          : scrolled
            ? "bg-[#0a1128]/95 backdrop-blur-md border-white/10 py-0.5 shadow-sm"
            : "bg-transparent border-transparent py-1"
      }`}
    >
      <div className="w-full px-6 md:px-10 lg:px-12 flex items-center">
        <Link href="/" className="flex items-center z-50 relative shrink-0">
          <img
            src={logoImage}
            alt="ASIVANTA"
            className={`object-contain transition-all duration-300 ${
              mobileMenuOpen
                ? "h-14 md:h-16 brightness-0"
                : scrolled
                  ? "h-12 md:h-16 brightness-0 invert"
                  : "h-16 md:h-24 brightness-0 invert"
            }`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-end gap-8 lg:gap-12 xl:gap-16 ml-10 lg:ml-20">
          <a
            href="#services"
            className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-300 hover:text-white" : "text-gray-300 hover:text-white"}`}
          >
            Services
          </a>
          <a
            href="#how-it-works"
            className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-300 hover:text-white" : "text-gray-300 hover:text-white"}`}
          >
            How It Works
          </a>
          <a
            href="#industries"
            className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-300 hover:text-white" : "text-gray-300 hover:text-white"}`}
          >
            Industries
          </a>
          <Link
            href="/insights"
            className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-300 hover:text-white" : "text-gray-300 hover:text-white"}`}
          >
            Insights
          </Link>
          <Link
            href="/instant-quote"
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${scrolled ? "text-gray-300 hover:text-white" : "text-gray-300 hover:text-white"}`}
          >
            Instant Quote
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
            <Menu
              className={`h-6 w-6 ${scrolled ? "text-white" : "text-white"}`}
            />
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
              href="/insights"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
            >
              Insights <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              href="/instant-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-900 py-2 border-b border-gray-100 flex justify-between items-center"
            >
              Instant Quote <ArrowRight className="h-4 w-4 text-gray-400" />
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
  );
}
