import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "wouter";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/report", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/trust-assurance", label: "Trust" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeMenuOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false);
    };
    closeMenuOnDesktop();
    desktopQuery.addEventListener("change", closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const backgroundElements = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const backgroundStates = backgroundElements.map((element) => ({ element, previousInert: element.inert }));
    const previousBodyOverflow = document.body.style.overflow;
    backgroundStates.forEach(({ element }) => {
      element.inert = true;
    });
    document.body.style.overflow = "hidden";

    firstMobileLinkRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const toggle = toggleRef.current;
        const menuItems = Array.from(mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? []);
        const focusable = toggle ? [toggle, ...menuItems] : menuItems;
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey && (active === first || !active || !focusable.includes(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !active || !focusable.includes(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      backgroundStates.forEach(({ element, previousInert }) => {
        element.inert = previousInert;
      });
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#081226]/95 text-white shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center" aria-label="Asivanta home" onClick={() => setOpen(false)}>
          <span className="text-lg font-semibold tracking-[0.24em] text-white">ASIVANTA</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#081226] transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Send an inquiry <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 md:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav ref={mobileMenuRef} id="mobile-navigation" className="h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#081226] px-5 pb-6 pt-3 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link, index) => (
              <Link ref={index === 0 ? firstMobileLinkRef : undefined} key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-base text-slate-200">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#081226]">
              Send an inquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
