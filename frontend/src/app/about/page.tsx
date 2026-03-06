"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import {
  Heart, Target, Users, Award, Globe, Sparkles,
  Stethoscope, Brain, Shield, CheckCircle, ArrowRight,
  Zap, TrendingUp, Clock, FileText
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function AboutPage() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const values = useMemo(() => [
    { icon: Heart, title: "Patient First", desc: "Every decision we make is guided by what's best for patients and their health outcomes." },
    { icon: Shield, title: "Trust & Privacy", desc: "We protect your health data with enterprise-grade security and strict privacy standards." },
    { icon: Zap, title: "Innovation", desc: "We continuously push the boundaries of what's possible with AI in healthcare." },
    { icon: Users, title: "Accessibility", desc: "Quality healthcare should be accessible to everyone, everywhere, at any time." },
  ], [])

  const stats = useMemo(() => [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "99.2%", label: "Accuracy Rate", icon: Target },
    { value: "50K+", label: "Reports Analyzed", icon: FileText },
    { value: "24/7", label: "AI Available", icon: Clock },
  ], [])

  const team = useMemo(() => [
    { name: "Dr. Sarah Chen", role: "CEO & Co-Founder", bio: "Former Chief of Digital Health at Stanford Medicine", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Dr. Michael Roberts", role: "Chief Medical Officer", bio: "20+ years in clinical practice, Harvard Medical School", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Emily Zhang", role: "CTO & Co-Founder", bio: "Ex-Google AI, PhD in Machine Learning from MIT", image: "https://i.pravatar.cc/150?img=9" },
    { name: "James Wilson", role: "VP of Engineering", bio: "Previously led engineering at leading health-tech startups", image: "https://i.pravatar.cc/150?img=13" },
  ], [])

  const milestones = [
    { year: "2024", title: "Founded", desc: "MediCare AI was born from a vision to make quality healthcare accessible to all" },
    { year: "2025", title: "AI Launch", desc: "Launched our clinical-grade AI diagnostic engine with 99.2% accuracy" },
    { year: "2025", title: "HIPAA Certified", desc: "Achieved HIPAA compliance and SOC 2 Type II certification" },
    { year: "2026", title: "10K Users", desc: "Reached 10,000+ active users trusting us with their healthcare" },
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
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">About Us</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Revolutionizing<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Healthcare with AI</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're on a mission to make quality healthcare accessible, accurate, and available to everyone, everywhere.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-xl text-center shadow-sm border border-slate-200"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At MediCare AI, we believe everyone deserves access to quality healthcare. Our AI-powered platform combines cutting-edge technology with medical expertise to provide instant, accurate health insights.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We're building a future where healthcare is proactive, not reactive. Where prevention is prioritized, and where every person has a personal health assistant available 24/7.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Clinically Validated</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">99.2% Accuracy</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-8 rounded-2xl shadow-2xl shadow-blue-500/25">
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">AI-Powered Insights</h3>
                      <p className="text-sm text-slate-500">Processing millions of data points</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Diagnostic Accuracy", value: 99.2 },
                      { label: "User Satisfaction", value: 98 },
                      { label: "Response Time", value: 95 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-medium text-slate-900">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-lg text-slate-600">Key milestones in our mission</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`relative flex items-center mb-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-sm font-bold text-blue-600">{milestone.year}</span>
                    <h3 className="text-xl font-semibold text-slate-900 mt-1 mb-2">{milestone.title}</h3>
                    <p className="text-slate-600">{milestone.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 border-4 border-white shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experienced healthcare and technology leaders driving innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-50"
                />
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-slate-600">{member.bio}</p>
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
                Join Us in Transforming Healthcare
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Experience the future of healthcare today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link href="/careers">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                  >
                    View Careers
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
