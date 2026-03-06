"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import {
  Stethoscope, Sparkles, ArrowRight, Heart, Users, Zap,
  Brain, Target, Award, Globe, Briefcase, Code, BarChart3,
  CheckCircle, MapPin, Clock, TrendingUp
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function CareersPage() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const benefits = useMemo(() => [
    { icon: Heart, title: "Health & Wellness", desc: "Comprehensive health coverage including medical, dental, and vision" },
    { icon: TrendingUp, title: "Growth Opportunities", desc: "Continuous learning budget and career development programs" },
    { icon: Clock, title: "Flexible Work", desc: "Remote-first culture with flexible hours and unlimited PTO" },
    { icon: Award, title: "Competitive Pay", desc: "Top-tier salary with equity packages and performance bonuses" },
    { icon: Users, title: "Amazing Team", desc: "Work with passionate experts from leading tech and healthcare companies" },
    { icon: Zap, title: "Cutting-Edge Tech", desc: "Access to the latest tools and technologies to do your best work" },
  ], [])

  const jobs = useMemo(() => [
    { id: 1, title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-time", tags: ["React", "Next.js", "TypeScript"] },
    { id: 2, title: "Machine Learning Engineer", department: "AI/ML", location: "San Francisco / Remote", type: "Full-time", tags: ["Python", "TensorFlow", "Healthcare AI"] },
    { id: 3, title: "Product Designer", department: "Design", location: "Remote", type: "Full-time", tags: ["Figma", "UX/UI", "Healthcare"] },
    { id: 4, title: "Backend Engineer", department: "Engineering", location: "Remote", type: "Full-time", tags: ["Python", "FastAPI", "PostgreSQL"] },
    { id: 5, title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time", tags: ["AWS", "Kubernetes", "CI/CD"] },
    { id: 6, title: "Data Scientist", department: "AI/ML", location: "San Francisco / Remote", type: "Full-time", tags: ["Python", "Statistics", "Healthcare"] },
  ], [])

  const departments = [
    { name: "Engineering", icon: Code, count: 12, color: "blue" },
    { name: "AI/ML Research", icon: Brain, count: 8, color: "purple" },
    { name: "Product & Design", icon: Target, count: 6, color: "pink" },
    { name: "Medical Affairs", icon: Stethoscope, count: 5, color: "emerald" },
    { name: "Operations", icon: Briefcase, count: 4, color: "amber" },
    { name: "Data & Analytics", icon: BarChart3, count: 4, color: "cyan" },
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
              <span className="text-xs font-semibold text-blue-700 uppercase">Careers</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Join Us in<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Transforming Healthcare</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Be part of a team that's using AI to make quality healthcare accessible to everyone. Work on challenging problems that impact millions of lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Teams</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore opportunities across different departments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${dept.color}-500 to-${dept.color}-600 flex items-center justify-center mb-6 shadow-lg`}>
                  <dept.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-slate-600">{dept.count} open positions</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Benefits & Perks</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We take care of our team so they can take care of others
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find your next opportunity
            </p>
          </motion.div>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, j) => (
                        <span key={j} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
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
                Don't See the Right Role?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Submit Your Resume
              </motion.button>
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
