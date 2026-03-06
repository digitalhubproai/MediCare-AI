"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import {
  Brain, ScanLine, UserCheck, ShieldCheck, MessageCircle, BarChart3,
  Sparkles, ArrowRight, CheckCircle, Stethoscope, FileText, Heart,
  Shield, Lock, Zap, Award, Clock, Target, Microscope, Activity
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function FeaturesPage() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = useMemo(() => [
    {
      icon: Brain,
      title: "AI Diagnostics",
      desc: "Clinical-grade AI powered by advanced neural networks for accurate health assessments. Our models analyze symptoms and provide preliminary diagnoses with 99.2% accuracy.",
      color: "blue",
      benefits: ["Instant analysis", "99.2% accuracy", "24/7 availability", "Continuous learning"]
    },
    {
      icon: ScanLine,
      title: "Report Analysis",
      desc: "Instant analysis of blood tests, X-rays, MRI scans & medical reports. Upload any medical document and get comprehensive insights within seconds.",
      color: "purple",
      benefits: ["All report types", "Results in seconds", "Detailed explanations", "Historical tracking"]
    },
    {
      icon: UserCheck,
      title: "Specialist Match",
      desc: "Connect with verified doctors based on your specific health needs. Our intelligent matching system finds the right specialist for your condition.",
      color: "emerald",
      benefits: ["Verified doctors", "Smart matching", "Easy booking", "Second opinions"]
    },
    {
      icon: ShieldCheck,
      title: "HIPAA Compliant",
      desc: "Enterprise-grade security with end-to-end encryption for your data. Your medical information is protected with the highest security standards.",
      color: "amber",
      benefits: ["256-bit encryption", "HIPAA certified", "Secure storage", "Privacy first"]
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      desc: "Round-the-clock AI assistance for all your health queries. Get instant answers to your medical questions anytime, anywhere.",
      color: "pink",
      benefits: ["Always available", "Instant responses", "Multi-language", "Personalized care"]
    },
    {
      icon: BarChart3,
      title: "Health Tracking",
      desc: "Monitor long-term health trends with detailed analytics and insights. Track vitals, medications, and health metrics over time.",
      color: "cyan",
      benefits: ["Trend analysis", "Visual charts", "Goal tracking", "Health scores"]
    },
  ], [])

  const colorConfig: Record<string, { gradient: string; bg: string; text: string; icon: string }> = {
    blue: { gradient: "from-blue-600 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-600" },
    purple: { gradient: "from-purple-600 to-pink-500", bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-600" },
    emerald: { gradient: "from-emerald-600 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-600" },
    amber: { gradient: "from-amber-600 to-orange-500", bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-600" },
    pink: { gradient: "from-pink-600 to-rose-500", bg: "bg-pink-50", text: "text-pink-600", icon: "text-pink-600" },
    cyan: { gradient: "from-cyan-600 to-blue-500", bg: "bg-cyan-50", text: "text-cyan-600", icon: "text-cyan-600" },
  }

  const advancedFeatures = [
    { icon: Microscope, title: "Lab Integration", desc: "Direct integration with major labs for automatic report uploads" },
    { icon: Activity, title: "Real-time Monitoring", desc: "Continuous health monitoring with smart alerts" },
    { icon: Shield, title: "Data Encryption", desc: "Military-grade encryption for all your health data" },
    { icon: Target, title: "Precision AI", desc: "AI trained on millions of medical records for accuracy" },
    { icon: Clock, title: "Fast Results", desc: "Get analysis results in under 30 seconds" },
    { icon: Award, title: "Certified", desc: "Clinically validated and healthcare certified" },
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
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Features</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Everything You Need for<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Better Healthcare</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Advanced AI technology designed to provide accurate, reliable healthcare insights whenever you need them
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorConfig[feature.color].gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Advanced Capabilities</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features built for modern healthcare needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-12 rounded-3xl text-center relative overflow-hidden shadow-2xl shadow-blue-500/25"
          >
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Experience the Future of Healthcare?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust MediCare AI for their healthcare needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Start Free Trial
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                  >
                    View Demo
                  </motion.button>
                </Link>
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
