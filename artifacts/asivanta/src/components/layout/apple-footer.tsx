import { Link } from "wouter";

export function AppleFooter() {
  return (
    <footer className="bg-[#f5f5f7] px-6 py-12 text-[#6e6e73]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 border-b border-black/10 pb-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[#1d1d1f]">
              ASIVANTA
            </p>
            <p className="mt-4 max-w-md text-sm leading-6">
              Buyer-side sourcing support for global teams evaluating Korean
              suppliers, RFQs, and pre-commitment questions.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1d1d1f]">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                href="/report"
                className="flex min-h-11 items-center hover:text-[#1d1d1f]"
              >
                The Shortlist Report
              </Link>
              <Link
                href="/trust-assurance"
                className="flex min-h-11 items-center hover:text-[#1d1d1f]"
              >
                Trust Approach
              </Link>
              <Link
                href="/insights"
                className="flex min-h-11 items-center hover:text-[#1d1d1f]"
              >
                Insights
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1d1d1f]">Contact</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                href="/contact"
                className="flex min-h-11 items-center hover:text-[#1d1d1f]"
              >
                Start a Review
              </Link>
              <a
                href="mailto:contact@asivanta.com"
                className="flex min-h-11 items-center hover:text-[#1d1d1f]"
              >
                contact@asivanta.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ASIVANTA Advisory. Seoul, South Korea.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="flex min-h-11 items-center px-2 hover:text-[#1d1d1f]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="flex min-h-11 items-center px-2 hover:text-[#1d1d1f]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
