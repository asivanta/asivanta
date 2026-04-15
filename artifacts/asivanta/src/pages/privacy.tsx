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
    title: "1. Who We Are",
    body: [
      "ASIVANTA Advisory is a procurement and sourcing advisory firm based in Seoul, South Korea. We provide services to companies seeking to source from Korean and Asian manufacturers. References to \"ASIVANTA,\" \"we,\" \"us,\" or \"our\" in this policy refer to ASIVANTA Advisory.",
      "Our contact email for privacy-related matters is: advisory@asivanta.com"
    ]
  },
  {
    title: "2. Information We Collect",
    body: [
      "We collect information you provide directly to us, including:",
      "• Name and company name when you submit an inquiry\n• Email address and phone number for communication purposes\n• Project details and sourcing requirements you include in your message\n• Documents or files you voluntarily attach to your inquiry (PDF, XLSX, or image formats)\n• IP address and browser metadata for security and spam prevention purposes",
      "We do not collect payment information through this website. We do not use tracking cookies, behavioral advertising, or third-party analytics services."
    ]
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "We use the information you submit solely for the following purposes:",
      "• To respond to your inquiry and provide the advisory services you requested\n• To assess whether your sourcing requirements match our capabilities\n• To communicate with you about an ongoing or prospective engagement\n• To maintain records of client and prospect correspondence\n• To prevent spam and protect the security of our platform",
      "We do not use your information for marketing to unrelated third parties, automated profiling, or any purpose unrelated to your inquiry."
    ]
  },
  {
    title: "4. How We Share Your Information",
    body: [
      "We do not sell, rent, or trade your personal information to any third party.",
      "We may share your information only in the following limited circumstances:",
      "• With service providers who support our operations (such as email delivery and database hosting), who are contractually bound to handle your data securely and only for the purpose of providing those services\n• If required by applicable law, court order, or regulatory authority\n• To protect the rights, safety, or property of ASIVANTA, our clients, or the public",
      "If you are introduced to a prospective supplier as part of an engagement, we will discuss what information is shared with you before doing so. We do not share client details with suppliers without your explicit consent."
    ]
  },
  {
    title: "5. Data Retention",
    body: [
      "We retain contact form submissions and associated files for a period of 24 months from the date of submission. If an advisory engagement is initiated, we retain relevant correspondence and documentation for the duration of the engagement plus 36 months.",
      "You may request deletion of your personal data at any time by contacting us at advisory@asivanta.com. We will process deletion requests within 30 days, subject to any legal or contractual retention obligations."
    ]
  },
  {
    title: "6. Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our platform uses encrypted connections (HTTPS) for all data transmission, and access to stored submissions is restricted to authorized personnel only.",
      "No method of electronic transmission or storage is completely secure. While we implement industry-standard safeguards, we cannot guarantee absolute security."
    ]
  },
  {
    title: "7. Cookies and Tracking",
    body: [
      "This website does not use advertising cookies, third-party tracking scripts, or behavioral analytics tools. We may use basic session cookies necessary for the operation of secure areas of the site (such as the client portal). These cookies are not used to track you across other websites."
    ]
  },
  {
    title: "8. Your Rights",
    body: [
      "Depending on your location, you may have the following rights regarding your personal data:",
      "• Access: Request a copy of the personal information we hold about you\n• Correction: Request correction of inaccurate or incomplete data\n• Deletion: Request that we delete your personal data, subject to retention obligations\n• Objection: Object to our processing of your data in certain circumstances\n• Portability: Request a copy of your data in a structured, machine-readable format",
      "To exercise any of these rights, please contact us at advisory@asivanta.com. We will respond within 30 days. We may need to verify your identity before processing a request."
    ]
  },
  {
    title: "9. International Data Transfers",
    body: [
      "ASIVANTA Advisory operates from Seoul, South Korea. If you are located in the European Economic Area, the United Kingdom, or another jurisdiction with data transfer restrictions, please be aware that your information may be processed in South Korea. We take steps to ensure that your information receives an adequate level of protection consistent with applicable data protection law."
    ]
  },
  {
    title: "10. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the effective date at the top of this page. We encourage you to review this policy periodically. Continued use of this website after changes are posted constitutes acceptance of the updated policy."
    ]
  },
  {
    title: "11. Contact Us",
    body: [
      "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
      "Email: advisory@asivanta.com\nLocation: Seoul, South Korea"
    ]
  }
];

export default function Privacy() {
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
              Privacy Policy
            </motion.h1>
            <motion.p variants={fadeIn} className="text-sm text-gray-400 font-light mb-2">
              Effective date: January 1, 2025
            </motion.p>
            <motion.p variants={fadeIn} className="text-lg text-gray-500 font-light max-w-2xl mb-16">
              ASIVANTA Advisory is committed to protecting the privacy of everyone who contacts us or uses this website. This policy explains what information we collect, how we use it, and what rights you have.
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
              Questions about this policy?{" "}
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
