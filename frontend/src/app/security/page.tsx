"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import {
  Stethoscope, Shield, Lock, Key, Eye, Server, Database,
  CheckCircle, AlertTriangle, Fingerprint, FileCheck, Award, Clock
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function SecurityPage() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const securityFeatures = useMemo(() => [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      desc: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption, the same standard used by banks and healthcare institutions.",
      details: ["TLS 1.3 for data in transit", "AES-256 for data at rest", "Perfect forward secrecy"]
    },
    {
      icon: Shield,
      title: "HIPAA Compliance",
      desc: "Our platform is fully HIPAA compliant, implementing all required administrative, physical, and technical safeguards for protected health information (PHI).",
      details: ["HIPAA certified", "Regular compliance audits", "BAAs available"]
    },
    {
      icon: Fingerprint,
      title: "Multi-Factor Authentication",
      desc: "Protect your account with optional multi-factor authentication. We support TOTP apps, SMS, and email verification codes.",
      details: ["TOTP support", "SMS verification", "Email verification", "Backup codes"]
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      desc: "Hosted on enterprise-grade cloud infrastructure with SOC 2 Type II certification, ensuring the highest standards of security and availability.",
      details: ["SOC 2 Type II certified", "99.9% uptime SLA", "Geographic redundancy"]
    },
    {
      icon: Eye,
      title: "Access Controls",
      desc: "Strict role-based access controls ensure only authorized personnel can access your data. All access is logged and audited.",
      details: ["Role-based access", "Audit logging", "Session management", "IP restrictions"]
    },
    {
      icon: Database,
      title: "Data Isolation",
      desc: "Your data is logically isolated from other customers. We use separate encryption keys per customer for additional security.",
      details: ["Logical isolation", "Per-customer encryption keys", "Database segmentation"]
    },
  ], [])

  const certifications = [
    { name: "HIPAA Compliant", icon: Award, desc: "Health Insurance Portability and Accountability Act" },
    { name: "SOC 2 Type II", icon: FileCheck, desc: "Service Organization Control 2" },
    { name: "GDPR Ready", icon: Shield, desc: "General Data Protection Regulation" },
    { name: "TLS 1.3", icon: Lock, desc: "Transport Layer Security Protocol" },
  ]

  const securityMeasures = [
    { category: "Network Security", measures: ["DDoS protection", "Web application firewall", "Intrusion detection", "Network segmentation"] },
    { category: "Application Security", measures: ["Regular penetration testing", "Code security reviews", "Vulnerability scanning", "Bug bounty program"] },
    { category: "Data Protection", measures: ["Automated backups", "Disaster recovery", "Data loss prevention", "Secure deletion"] },
    { category: "Monitoring", measures: ["24/7 security monitoring", "Real-time alerting", "Log analysis", "Incident response"] },
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
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Security</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Enterprise-Grade<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Security</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your health data is protected with the highest security standards in the industry. We're committed to keeping your information safe and private.
            </p>
          </motion.div>

          {/* Certifications */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-xl text-center shadow-sm border border-slate-200"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  <cert.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold text-slate-900 mb-1">{cert.name}</div>
                <div className="text-xs text-slate-500">{cert.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Security Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive security measures to protect your data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Security Measures</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Multiple layers of protection for comprehensive security
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {securityMeasures.map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.measures.map((measure, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {measure}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Incident Response</h2>
                <p className="text-slate-700">
                  In the unlikely event of a security incident, we have a comprehensive response plan:
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Detection", desc: "24/7 monitoring detects anomalies" },
                { step: "2", title: "Response", desc: "Immediate containment and assessment" },
                { step: "3", title: "Notification", desc: "Affected users notified within 72 hours" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Security Questions?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Our security team is available to answer your questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:security@medicareai.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all">
                <Shield className="w-5 h-5" />
                security@medicareai.com
              </a>
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
