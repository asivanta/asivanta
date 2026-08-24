import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | Asivanta";
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,follow";
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-5 pt-20 text-center">
        <div><p className="text-sm font-semibold text-blue-700">404</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1><p className="mt-4 text-slate-600">The page you requested is not part of the public Asivanta site.</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#081226] px-5 py-3 font-semibold text-white"><ArrowLeft className="h-4 w-4" /> Return home</Link></div>
      </main>
      <Footer />
    </div>
  );
}
