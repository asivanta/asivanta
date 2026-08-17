import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import logoImage from "../../assets/logo-nav.png";
import { useNavigationBackgroundTone } from "./use-navigation-background-tone";

const navigation = [
  { label: "Process", href: "#how-it-works" },
  { label: "Deliverables", href: "#deliverable" },
  { label: "Trust", href: "/trust-assurance", internal: true },
  { label: "Trade Guides", href: "/insights", internal: true },
];

export function AppleNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const restoreMenuFocusRef = useRef(false);
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

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeMenuAtDesktop = () => {
      if (desktopQuery.matches) setMobileMenuOpen(false);
    };

    desktopQuery.addEventListener("change", closeMenuAtDesktop);
    window.addEventListener("resize", closeMenuAtDesktop);
    return () => {
      desktopQuery.removeEventListener("change", closeMenuAtDesktop);
      window.removeEventListener("resize", closeMenuAtDesktop);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen && restoreMenuFocusRef.current) {
      restoreMenuFocusRef.current = false;
      mobileMenuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        restoreMenuFocusRef.current = true;
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent text-white"
      data-background-tone={isLightBackground ? "light" : "dark"}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="asv-apple-press relative z-50 flex min-h-11 items-center"
          aria-label="ASIVANTA home"
        >
          <img
            src={logoImage}
            alt="ASIVANTA"
            className="h-10 w-auto object-contain"
            style={logoTreatment}
          />
        </Link>

        <nav
          className="hidden items-center gap-3 text-xl text-white/80 lg:flex xl:gap-5"
          aria-label="Primary navigation"
        >
          {navigation.map((item) =>
            item.internal ? (
              <Link
                key={item.label}
                href={item.href}
                className="flex min-h-11 min-w-11 items-center justify-center px-2 text-white transition-opacity duration-150 hover:opacity-75"
                style={navigationShadow}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="flex min-h-11 min-w-11 items-center justify-center px-2 text-white transition-opacity duration-150 hover:opacity-75"
                style={navigationShadow}
              >
                {item.label}
              </a>
            ),
          )}
          <a
            href="#services"
            className="asv-apple-press inline-flex min-h-11 items-center rounded-full bg-[#0071e3] px-5 text-lg font-medium text-white transition-colors duration-150 hover:bg-[#0077ed]"
          >
            Explore Services
          </a>
        </nav>

        <button
          ref={mobileMenuButtonRef}
          type="button"
          className="asv-apple-press relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          style={navigationShadow}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="asivanta-mobile-navigation"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <div
        id="asivanta-mobile-navigation"
        className={`absolute inset-x-0 top-full z-40 h-[calc(100dvh-3.5rem)] overflow-y-auto bg-black px-6 pb-10 pt-8 transition-[opacity,transform] duration-200 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav
          className="mx-auto flex max-w-lg flex-col"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) =>
            item.internal ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-14 items-center border-b border-white/10 text-xl font-medium text-white"
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-14 items-center border-b border-white/10 text-xl font-medium text-white"
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {item.label}
              </a>
            ),
          )}
          <a
            href="#services"
            onClick={closeMenu}
            className="asv-apple-press mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0071e3] px-6 font-medium text-white"
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            Explore Services
          </a>
          <Link
            href="/instant-quote"
            onClick={closeMenu}
            className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-medium text-white"
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            Quote Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
