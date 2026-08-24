import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const sections = [
  {
    title: "Website use",
    paragraphs: ["asivanta.com provides general information about Asivanta and an inquiry channel. You may use the site only for lawful purposes and must not interfere with its operation or attempt unauthorized access."],
  },
  {
    title: "Inquiry is not an engagement",
    paragraphs: ["Submitting an inquiry does not create an advisory engagement, duty, representation, or obligation to respond. Advisory work begins only after scope and terms are agreed separately in writing."],
  },
  {
    title: "Service boundaries",
    paragraphs: ["Website content and educational guides are general information. They are not legal, financial, engineering, regulatory, trade-compliance, or other specialist advice.", "A sourcing review is limited to its agreed scope and available information. Desktop research and document review do not prove factory reality. Success, savings, stock, quality, and delivery are not guaranteed."],
  },
  {
    title: "Information you submit",
    paragraphs: ["You are responsible for ensuring that inquiry information is accurate and that you are permitted to share it. Do not send confidential or sensitive material through the initial inquiry form."],
  },
  {
    title: "Intellectual property",
    paragraphs: ["Unless stated otherwise, the text, visual design, brand elements, and educational content on this site belong to Asivanta or their respective rights holders. You may link to the site and quote short excerpts with attribution, but may not republish substantial content without permission."],
  },
  {
    title: "Availability and changes",
    paragraphs: ["The site may be changed, interrupted, or withdrawn. Content may become outdated as supplier, market, or regulatory conditions change."],
  },
  {
    title: "Contact",
    paragraphs: ["Questions about these terms may be sent to hello@asivanta.com."],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="terms" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Legal</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Terms of Service</h1>
            <p className="mt-5 text-sm text-slate-500">Effective August 24, 2026</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">These terms govern use of asivanta.com and requests for advisory work.</p>
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
            <div className="border-t border-slate-200 pt-8 text-slate-600">Contact: <a className="font-semibold text-blue-700 hover:text-blue-900" href="mailto:hello@asivanta.com">hello@asivanta.com</a></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
