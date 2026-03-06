"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import { Stethoscope, FileText, CheckCircle, AlertCircle, Shield, DollarSign, ChevronDown } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

export default function TermsPage() {
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
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: `By accessing or using MediCare AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms apply to all users of the Service, including users who are contributors, browsers, customers, and/or vendors.

We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through prominent notices on the Service.`
    },
    {
      icon: AlertCircle,
      title: "2. Medical Disclaimer",
      content: `IMPORTANT: MediCare AI is not a substitute for professional medical advice, diagnosis, or treatment.

• The information provided by MediCare AI is for informational and educational purposes only.
• Always seek the advice of qualified healthcare providers with questions about medical conditions.
• Never disregard professional medical advice or delay seeking treatment because of information from MediCare AI.
• In case of emergency, call your local emergency services immediately.
• MediCare AI does not provide medical advice, diagnosis, or treatment recommendations.
• All health information should be verified with qualified healthcare professionals.`
    },
    {
      icon: CheckCircle,
      title: "3. User Accounts",
      content: `To use certain features of the Service, you must create an account:

• You must be at least 18 years old to use the Service.
• You are responsible for maintaining the confidentiality of your account credentials.
• You are responsible for all activities that occur under your account.
• You must provide accurate and complete registration information.
• You must notify us immediately of any unauthorized use of your account.
• We reserve the right to terminate accounts that violate these Terms.`
    },
    {
      icon: Shield,
      title: "4. Acceptable Use",
      content: `You agree not to:

• Use the Service for any illegal purpose or in violation of any laws.
• Attempt to gain unauthorized access to the Service or its systems.
• Interfere with or disrupt the Service or servers.
• Use the Service to transmit malware, viruses, or harmful code.
• Impersonate any person or entity or misrepresent your affiliation.
• Use the Service to harass, abuse, or harm others.
• Attempt to reverse engineer or copy the Service.
• Use automated systems to access the Service without permission.
• Share your account credentials with others.`
    },
    {
      icon: DollarSign,
      title: "5. Payments & Subscriptions",
      content: `Payment Terms:

• Subscription fees are billed in advance on a monthly or annual basis.
• Fees are non-refundable except as required by law.
• We may change fees with 30 days' notice.
• Your subscription will automatically renew unless cancelled.
• You can cancel at any time; cancellation takes effect at the end of the billing period.
• Free trials may be offered; unused portions are forfeited upon purchase.
• All payments are processed through secure third-party payment processors.`
    },
    {
      icon: FileText,
      title: "6. Intellectual Property",
      content: `The Service and its original content, features, and functionality are owned by MediCare AI and are protected by international copyright, trademark, and other intellectual property laws.

• You retain ownership of content you submit to the Service.
• You grant us a license to use your content to provide the Service.
• You may not use our trademarks without written permission.
• We respect intellectual property rights and will respond to infringement notices.
• The Service may contain open-source software subject to separate licenses.`
    },
    {
      icon: AlertCircle,
      title: "7. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

• MediCare AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
• Our total liability shall not exceed the amount you paid us in the past 12 months.
• We do not guarantee that the Service will be uninterrupted, secure, or error-free.
• We are not responsible for the accuracy of health information provided.
• You use the Service at your own risk.
• Some jurisdictions do not allow certain limitations, so some limitations may not apply to you.`
    },
    {
      icon: Shield,
      title: "8. Termination",
      content: `We may terminate or suspend your account and access to the Service:

• For violation of these Terms
• For fraudulent or illegal activities
• For non-payment of fees
• At our discretion with 30 days' notice

Upon termination:
• Your right to use the Service will immediately cease.
• We may delete your account and associated data as permitted by law.
• Provisions that should survive termination will remain in effect.`
    },
    {
      icon: FileText,
      title: "9. Contact Information",
      content: `For questions about these Terms of Service, please contact us:

Email: legal@medicareai.com
Address: 123 Healthcare Avenue, San Francisco, CA 94102
Phone: +1 (555) 123-4567

We will respond to inquiries within 5 business days.`
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
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Terms of Service</span>
            </motion.div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Terms of Service</h1>
            <p className="text-xl text-slate-600">
              Please read these terms carefully before using MediCare AI. These terms govern your use of our platform and services.
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

      {/* Important Notice */}
      <section className="py-12 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 border border-amber-100 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Important Medical Disclaimer</h2>
                <p className="text-slate-700 mb-4">
                  MediCare AI provides health information and insights powered by artificial intelligence. However, this information is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    Always consult with qualified healthcare providers for medical concerns
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    Call emergency services immediately for medical emergencies
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    Verify all health information with medical professionals
                  </li>
                </ul>
              </div>
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
