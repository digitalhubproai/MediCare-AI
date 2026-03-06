"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import { Stethoscope, Shield, Lock, Eye, Database, UserCheck, Mail, ChevronDown } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

export default function PrivacyPage() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [openSection, setOpenSection] = useState<number | null>(0)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content: `We collect information that you provide directly to us, including:

• Account Information: Name, email address, password, and profile information when you create an account.
• Health Information: Medical reports, symptoms, health history, and other health-related information you choose to share.
• Usage Information: How you interact with our platform, including pages visited, features used, and time spent.
• Device Information: IP address, browser type, operating system, and device identifiers.
• Communication Data: Messages you send to us through our support channels.`
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process and analyze your medical reports
• Generate personalized health insights and recommendations
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent security incidents
• Comply with legal obligations`
    },
    {
      icon: Lock,
      title: "3. Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information:

• Encryption: All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
• Access Controls: Strict access controls and authentication mechanisms limit who can access your data.
• Regular Audits: We conduct regular security audits and penetration testing.
• HIPAA Compliance: Our platform is HIPAA compliant and follows healthcare data protection standards.
• Data Minimization: We only collect and retain data necessary for providing our services.
• Backup & Recovery: Regular backups ensure your data can be recovered in case of incidents.`
    },
    {
      icon: UserCheck,
      title: "4. Your Rights & Choices",
      content: `You have the following rights regarding your personal information:

• Access: Request a copy of the personal information we hold about you.
• Correction: Request correction of inaccurate or incomplete information.
• Deletion: Request deletion of your personal information, subject to legal obligations.
• Portability: Request transfer of your data to another service provider.
• Opt-Out: Opt-out of marketing communications at any time.
• Restriction: Request restriction of processing in certain circumstances.
• Withdraw Consent: Withdraw consent where processing is based on consent.

To exercise these rights, contact us at privacy@medicareai.com`
    },
    {
      icon: Shield,
      title: "5. Data Sharing & Disclosure",
      content: `We do not sell your personal information. We may share your information only in the following circumstances:

• With Your Consent: When you explicitly consent to sharing.
• Service Providers: With vendors who perform services on our behalf (hosting, analytics, customer support).
• Healthcare Providers: With healthcare providers you choose to connect with.
• Legal Requirements: When required by law or to protect rights and safety.
• Business Transfers: In connection with a merger, acquisition, or sale of assets.

All third parties are bound by confidentiality obligations and data protection requirements.`
    },
    {
      icon: Mail,
      title: "6. Contact Us",
      content: `If you have questions about this Privacy Policy or our data practices, please contact us:

Email: privacy@medicareai.com
Address: 123 Healthcare Avenue, San Francisco, CA 94102
Phone: +1 (555) 123-4567

Our Data Protection Officer is available to address your concerns and questions about how we handle your personal information.`
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25"
                  >
                    Dashboard
                  </motion.button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Privacy Policy</span>
            </motion.div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Your Privacy Matters</h1>
            <p className="text-xl text-slate-600">
              We're committed to protecting your personal and health information. This policy explains how we collect, use, and safeguard your data.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => setOpenSection(openSection === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-slate-900">{section.title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: openSection === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-blue-600" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openSection === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">HIPAA Compliance</h2>
            <p className="text-slate-600 mb-4">
              MediCare AI is HIPAA compliant. We implement administrative, physical, and technical safeguards to protect your health information in accordance with the Health Insurance Portability and Accountability Act.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600 border border-blue-200">HIPAA Certified</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600 border border-blue-200">SOC 2 Type II</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600 border border-blue-200">End-to-End Encrypted</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">MediCare<span className="text-blue-600">AI</span></span>
              </div>
              <p className="text-sm text-slate-600">
                Advanced AI-powered healthcare platform for accurate, instant health insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/features" className="hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-blue-600 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2026 MediCare AI. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
