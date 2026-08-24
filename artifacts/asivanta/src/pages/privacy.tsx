import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const sections = [
  {
    title: "Information you provide",
    paragraphs: [
      "When you send an inquiry, we receive the name, company, email address, sourcing subject, and clarification request that you enter in the form.",
      "Please do not send confidential drawings, personal identification, payment details, or other sensitive information through the initial inquiry form.",
    ],
  },
  {
    title: "How inquiry information is used",
    paragraphs: [
      "We use inquiry information to understand the request, decide whether it fits, reply, and—if work starts—deliver the agreed work.",
      "Submitting an inquiry does not create an advisory engagement.",
    ],
  },
  {
    title: "Service providers and technical data",
    paragraphs: [
      "The website hosting and email-delivery providers used to operate this site may process basic technical information and the content needed to transmit an inquiry. Their handling is governed by their own terms and privacy practices.",
      "Cloudflare may process technical data from the inquiry form's abuse-prevention check for abuse prevention.",
      "This site does not currently use advertising trackers or behavioral analytics.",
    ],
  },
  {
    title: "Retention",
    paragraphs: [
      "We keep inquiry records only as long as needed to respond and, if work starts, to deliver that work. Records may be kept longer where reasonably needed for legal, accounting, security, or dispute purposes.",
    ],
  },
  {
    title: "Your request",
    paragraphs: [
      "You may ask about, correct, or request deletion of inquiry information by emailing hello@asivanta.com. A request may be limited where information must be kept for legal or operational reasons.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="privacy" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Legal</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Privacy Policy</h1>
            <p className="mt-5 text-sm text-slate-500">Effective August 24, 2026</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">This policy explains how Asivanta handles information submitted through asivanta.com.</p>
          </div>
        </section>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl space-y-12 px-5 sm:px-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              </section>
            ))}
            <div className="border-t border-slate-200 pt-8 text-slate-600">Questions about this policy? <a className="font-semibold text-blue-700 hover:text-blue-900" href="mailto:hello@asivanta.com">hello@asivanta.com</a></div>
            <Link href="/contact" className="inline-block font-semibold text-blue-700 hover:text-blue-900">Return to Contact</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
