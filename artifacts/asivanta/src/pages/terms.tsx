import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const sections = [
  {
    title: "1. Agreement to Terms",
    body: [
      "By accessing or using the ASIVANTA Advisory website (asivanta.com), submitting an inquiry through our contact form, or engaging our advisory services, you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.",
      "These Terms apply to all visitors, prospects, and clients. Use of advisory services is additionally governed by a separate engagement agreement executed between ASIVANTA Advisory and the client."
    ]
  },
  {
    title: "2. Services Description",
    body: [
      "ASIVANTA Advisory provides procurement and sourcing advisory services, including supplier identification, factory verification, commercial negotiation support, and production oversight for companies sourcing from Korean and Asian manufacturers.",
      "This website is an informational platform and intake channel. It is not a marketplace, trading platform, or transactional service. ASIVANTA does not operate as a broker, trading company, or reseller. We represent the buyer's interests as an independent advisor.",
      "Access to the Client Portal is provided to active clients only, under the terms of their engagement agreement. Portal access does not constitute a standalone service agreement."
    ]
  },
  {
    title: "3. Use of This Website",
    body: [
      "You may use this website for lawful purposes only. You agree not to:",
      "• Submit false, misleading, or fraudulent information through any form on this site\n• Attempt to gain unauthorized access to any part of the site, including the admin or client portal\n• Use automated tools (scrapers, bots, crawlers) to extract content from this site without permission\n• Upload files containing malware, viruses, or malicious code\n• Interfere with or disrupt the operation of the site or its infrastructure\n• Violate any applicable law or regulation in connection with your use of this site",
      "We reserve the right to block access to users who violate these terms."
    ]
  },
  {
    title: "4. Contact Form Submissions",
    body: [
      "Submitting an inquiry through our contact form does not create an advisory engagement or any contractual obligation on the part of ASIVANTA. It is an expression of interest only.",
      "By submitting a form, you represent that the information you provide is accurate, that you have the authority to make procurement inquiries on behalf of any company you represent, and that any files you attach do not contain malicious code and do not violate third-party intellectual property rights.",
      "We will respond to inquiries at our discretion and within the timeframe indicated on the Contact page. We do not guarantee a response to every submission."
    ]
  },
  {
    title: "5. Intellectual Property",
    body: [
      "All content on this website — including text, graphics, articles, methodology descriptions, layout, and brand elements — is the intellectual property of ASIVANTA Advisory and is protected by applicable copyright, trademark, and other intellectual property laws.",
      "You may not reproduce, republish, distribute, or create derivative works from any content on this site without prior written permission from ASIVANTA Advisory.",
      "The Insights articles published on this site are provided for informational purposes. Brief quotation with attribution is permitted for non-commercial use. Full reproduction is not permitted without written consent."
    ]
  },
  {
    title: "6. Disclaimers",
    body: [
      "The information on this website is provided for general informational purposes only. It does not constitute professional procurement, legal, financial, or trade compliance advice.",
      "ASIVANTA Advisory makes no representations or warranties that the content on this site is complete, accurate, or current. Market conditions, supplier capabilities, and regulatory environments change — information in our Insights articles reflects the state of knowledge at the time of publication.",
      "This website and its content are provided \"as is\" without warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement."
    ]
  },
  {
    title: "7. Limitation of Liability",
    body: [
      "To the fullest extent permitted by applicable law, ASIVANTA Advisory and its personnel shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website, including damages for loss of business, revenue, data, or goodwill.",
      "ASIVANTA's total liability for any claims arising from use of this website (not covered by a separate engagement agreement) shall not exceed USD 100.",
      "Nothing in these Terms limits liability for fraud, willful misconduct, or any matter that cannot be limited under applicable law."
    ]
  },
  {
    title: "8. Third-Party Links",
    body: [
      "This website may contain links to third-party websites or resources. ASIVANTA Advisory does not endorse, control, or assume responsibility for the content, privacy practices, or availability of any third-party site. Accessing third-party links is at your own risk."
    ]
  },
  {
    title: "9. Privacy",
    body: [
      "Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review the Privacy Policy to understand how we collect, use, and protect your information."
    ]
  },
  {
    title: "10. Governing Law and Jurisdiction",
    body: [
      "These Terms of Service are governed by the laws of the Republic of Korea, without regard to conflict of law principles. Any disputes arising from or relating to these Terms or your use of this website shall be subject to the exclusive jurisdiction of the courts located in Seoul, South Korea.",
      "If you are accessing this website from outside Korea, you do so at your own initiative and are responsible for compliance with any applicable local laws."
    ]
  },
  {
    title: "11. Changes to These Terms",
    body: [
      "We may revise these Terms from time to time. Changes will be effective upon posting to this page with an updated effective date. Your continued use of the website following changes constitutes acceptance of the revised Terms.",
      "We recommend reviewing this page periodically, particularly before submitting sensitive information or engaging with our services."
    ]
  },
  {
    title: "12. Contact",
    body: [
      "For questions regarding these Terms of Service, please contact us:",
      "Email: advisory@asivanta.com\nLocation: Seoul, South Korea"
    ]
  }
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-24 bg-[#f9fafb]">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="mb-4">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-light text-[#0F172A] tracking-tight mb-4">
              Terms of Service
            </motion.h1>
            <motion.p variants={fadeIn} className="text-sm text-gray-400 font-light mb-2">
              Effective date: January 1, 2025
            </motion.p>
            <motion.p variants={fadeIn} className="text-lg text-gray-500 font-light max-w-2xl mb-16">
              Please read these Terms carefully before using our website or submitting any inquiry. They govern your access to and use of asivanta.com and our advisory services.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-12">
            {sections.map((section) => (
              <motion.div key={section.title} variants={fadeIn}>
                <h2 className="text-xl font-semibold text-[#0F172A] mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-gray-600 font-light leading-relaxed whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-20 pt-10 border-t border-gray-100"
          >
            <p className="text-sm text-gray-400 font-light">
              Questions about these terms?{" "}
              <a href="mailto:advisory@asivanta.com" className="text-blue-600 hover:underline">
                advisory@asivanta.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
