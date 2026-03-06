"use client"

import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import Loader from "@/components/Loader"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import {
  Stethoscope, Brain, FileText, Shield, Target, Clock,
  Heart, MessageCircle, Sparkles, Users,
  Star, ShieldCheck, ScanLine, LogOut, UserCircle,
  FileCheck, UserCheck, BarChart3,
  Cpu, Lock, ArrowRight, CheckCircle, Zap, Award,
  ChevronRight, ChevronDown, Activity, Microscope, Thermometer,
  TrendingUp, Calendar, Bell, Play, HelpCircle
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

export default function Home() {
  const { user, signOut, isAuthenticated } = useAuth()
  const [showLoader, setShowLoader] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Optimized scroll handler with throttle
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Memoized features data
  const features = useMemo(() => [
    {
      icon: Brain,
      title: "AI Diagnostics",
      desc: "Clinical-grade AI powered by advanced neural networks for accurate health assessments",
      color: "blue"
    },
    {
      icon: ScanLine,
      title: "Report Analysis",
      desc: "Instant analysis of blood tests, X-rays & medical reports with 99.2% accuracy",
      color: "purple"
    },
    {
      icon: UserCheck,
      title: "Specialist Match",
      desc: "Connect with verified doctors based on your specific health needs",
      color: "emerald"
    },
    {
      icon: ShieldCheck,
      title: "HIPAA Compliant",
      desc: "Enterprise-grade security with end-to-end encryption for your data",
      color: "amber"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      desc: "Round-the-clock AI assistance for all your queries",
      color: "pink"
    },
    {
      icon: BarChart3,
      title: "Health Tracking",
      desc: "Monitor long-term health trends with detailed analytics",
      color: "cyan"
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

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "99.2%", label: "Accuracy Rate", icon: Target },
    { value: "24/7", label: "AI Available", icon: Clock },
    { value: "50K+", label: "Reports Analyzed", icon: FileCheck },
  ]

  const testimonials = [
    {
      quote: "The AI analysis helped me understand my blood test results instantly. Incredible technology that saved me multiple doctor visits!",
      author: "Sarah Johnson",
      role: "Patient",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5
    },
    {
      quote: "As a doctor, I find MediCare AI to be an excellent tool for preliminary assessments. It's accurate and saves valuable time.",
      author: "Dr. Michael Chen",
      role: "Physician",
      image: "https://i.pravatar.cc/150?img=11",
      rating: 5
    },
    {
      quote: "Finally, healthcare that's accessible, accurate, and available whenever I need it. This is the future of medicine.",
      author: "Emily Rodriguez",
      role: "Patient",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5
    },
  ]

  const howItWorks = [
    { icon: FileText, title: "Upload Data", desc: "Share your medical reports securely in seconds", step: 1 },
    { icon: Cpu, title: "AI Processing", desc: "Our models analyze for anomalies and patterns", step: 2 },
    { icon: Brain, title: "Deep Analysis", desc: "Cross-reference millions of medical data points", step: 3 },
    { icon: Heart, title: "Get Insights", desc: "Receive comprehensive health reports instantly", step: 4 },
  ]

  const faqs = [
    {
      question: "Is MediCare AI a substitute for professional medical advice?",
      answer: "No. MediCare AI is designed to provide health insights and information, but it should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI models have been trained on millions of medical records and achieve 99.2% accuracy in preliminary assessments. However, results should always be verified by healthcare professionals."
    },
    {
      question: "Is my medical data secure and private?",
      answer: "Absolutely. We use enterprise-grade 256-bit encryption and are HIPAA compliant. Your data is stored securely and is only accessible to you and authorized healthcare providers you choose to share with."
    },
    {
      question: "How many free consultations can I get?",
      answer: "The Free plan includes 3 AI consultations per month with basic health reports. Upgrade to Pro for unlimited consultations and advanced features."
    },
    {
      question: "Can I upload multiple medical reports?",
      answer: "Yes! Free users can upload up to 3 reports per month. Pro users get unlimited uploads with access for family members."
    },
    {
      question: "What types of reports can I upload?",
      answer: "We support blood tests, X-rays, MRI scans, CT scans, ultrasound reports, and most standard medical test reports in PDF, JPG, or PNG format."
    },
    {
      question: "How do I upgrade to a paid plan?",
      answer: "You can upgrade anytime from your dashboard. We accept all major credit cards and offer a 7-day free trial for Pro plans."
    },
  ]

  return (
    <>
      {showLoader && <Loader />}

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="relative overflow-hidden bg-white min-h-screen">

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg"
            : "py-6 bg-transparent"
            }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center">
              <Logo />

              <div className="hidden lg:flex items-center gap-8">
                {["Features", "How It Works", "About", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                      <UserCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">{user.name}</span>
                    </motion.button>
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 z-50"
                        >
                          <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          <div className="p-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all" onClick={() => setShowUserMenu(false)}>
                              <Brain className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-slate-700">Dashboard</span>
                            </Link>
                            <Link href="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all" onClick={() => setShowUserMenu(false)}>
                              <FileText className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-slate-700">History</span>
                            </Link>
                          </div>
                          <div className="p-2 border-t border-slate-100">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { signOut(); setShowUserMenu(false) }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all text-red-600"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="font-medium">Sign Out</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        Sign In
                      </motion.button>
                    </Link>
                    <Link href="/sign-up">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all"
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

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 min-h-screen flex items-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-left"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-md mb-6"
                  >
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-slate-700">AI-Powered Healthcare Platform</span>
                  </motion.div>

                  <motion.h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Healthcare.<br />
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Reimagined for You.</span>
                  </motion.h1>

                  <motion.p
                    className="text-xl text-slate-600 mb-8 leading-relaxed max-w-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Experience clinical-grade AI analysis that delivers instant, accurate health insights. Your personal medical assistant, available 24/7.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <Link href="/sign-up">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                      >
                        Start Free Assessment
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </motion.div>

                  <motion.div
                    className="flex flex-wrap gap-6 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {[
                      { icon: Shield, text: "HIPAA Compliant" },
                      { icon: Lock, text: "End-to-End Encrypted" },
                      { icon: CheckCircle, text: "Clinically Validated" },
                    ].map((badge, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 text-slate-600"
                      >
                        <badge.icon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">{badge.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Trust indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex items-center gap-4 pt-6 border-t border-slate-200"
                  >
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?img=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">Trusted by <span className="font-semibold text-slate-900">10,000+</span> users</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Hero Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative">
                    {/* Main Card */}
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 overflow-hidden">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">AI Health Analysis</h3>
                          <p className="text-sm text-slate-500">Processing your data securely</p>
                        </div>
                        <div className="ml-auto">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: "Blood Test Analysis", progress: 95, color: "blue" },
                          { label: "X-Ray Detection", progress: 87, color: "purple" },
                          { label: "Health Score", progress: 94, color: "emerald" },
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-600">{item.label}</span>
                              <span className="font-medium text-slate-900">{item.progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 1.5, delay: 0.8 + i * 0.3 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                        {[
                          { label: "Accuracy", value: "99.2%" },
                          { label: "Speed", value: "<30s" },
                          { label: "Reports", value: "50K+" },
                        ].map((stat, i) => (
                          <div key={i} className="text-center">
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-4 -right-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-xl shadow-emerald-500/25"
                    >
                      <div className="flex items-center gap-2 text-white">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Clinically Validated</span>
                      </div>
                    </motion.div>

                    {/* Floating Element Top */}
                    <motion.div
                      animate={{ y: [-8, 8, -8] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Microscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Analysis Complete</p>
                          <p className="text-sm font-semibold text-slate-900">Blood Test Report</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-xl text-center shadow-sm border border-slate-200 hover:shadow-xl transition-all"
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

          {/* Features Section */}
          <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  Everything You Need for Better Health
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Advanced AI technology designed to provide accurate, reliable healthcare insights whenever you need them
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    className="hero-feature bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorConfig[feature.color].gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">{feature.desc}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase">How It Works</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  Get Started in 4 Simple Steps
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Our streamlined process makes healthcare accessible and efficient
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {howItWorks.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className="relative"
                  >
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-center group h-full">
                      {/* Step Number */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <span className="text-white font-bold text-lg">{step.step}</span>
                      </div>

                      {/* Connector Line */}
                      {i < howItWorks.length - 1 && (
                        <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-cyan-200 -z-10" />
                      )}

                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <step.icon className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section id="about" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  What We Do
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Revolutionizing healthcare with AI-powered diagnostics and personalized care
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Brain, title: "AI Diagnostics", desc: "Advanced neural networks analyze your health data with 99.2% accuracy", stat: "99.2%" },
                  { icon: Users, title: "Patient Care", desc: "Connecting patients with verified healthcare professionals 24/7", stat: "10K+" },
                  { icon: Shield, title: "Data Security", desc: "HIPAA compliant platform with end-to-end encryption for your privacy", stat: "100%" },
                  { icon: TrendingUp, title: "Health Insights", desc: "Comprehensive analytics to track and improve your health over time", stat: "50K+" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-center group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{item.stat}</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mission Statement */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-16 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-8 md:p-12 rounded-2xl text-center text-white shadow-xl shadow-blue-500/25"
              >
                <Heart className="w-12 h-12 mx-auto mb-4 text-white" />
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg text-white/90 max-w-3xl mx-auto">
                  To make quality healthcare accessible to everyone, everywhere. We combine cutting-edge AI technology with medical expertise to provide instant, accurate health insights that empower you to take control of your well-being.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase">Pricing Plans</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Choose the perfect plan for your healthcare needs
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Free</h3>
                    <p className="text-sm text-slate-500">Perfect for getting started</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all mb-6"
                  >
                    Get Started Free
                  </motion.button>
                  <ul className="space-y-3">
                    {[
                      "3 AI consultations/month",
                      "Basic health reports",
                      "7-day history",
                      "Email support",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Pro Plan - Popular */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-8 rounded-2xl shadow-xl shadow-blue-500/25 relative"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-blue-600 rounded-full text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                    <p className="text-sm text-white/80">For regular health tracking</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$40</span>
                    <span className="text-white/70">/month</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-white text-blue-600 font-semibold hover:shadow-lg transition-all mb-6"
                  >
                    Start Pro Trial
                  </motion.button>
                  <ul className="space-y-3">
                    {[
                      "Unlimited AI consultations",
                      "Advanced health reports",
                      "90-day history",
                      "Priority support",
                      "Family member access",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white">
                        <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center mt-12"
              >
                <p className="text-sm text-slate-500 mb-4">Trusted by healthcare providers worldwide</p>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  {[
                    "HIPAA Compliant",
                    "SOC 2 Certified",
                    "GDPR Compliant",
                    "256-bit Encryption",
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  Loved by Thousands
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  See what our users have to say about their experience
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.author}</div>
                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase">FAQ</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Find answers to common questions about our platform
                </p>
              </motion.div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-2 text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center mt-12"
              >
                <p className="text-slate-600 mb-4">Still have questions?</p>
                <Link href="#faq">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all"
                  >
                    <HelpCircle className="w-4 h-4" />
                    View FAQ
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-12 md:p-16 rounded-2xl text-center relative overflow-hidden shadow-2xl shadow-blue-500/25"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      Ready to Get Started?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
                      Experience the accuracy of advanced medical AI instantly. Start your free assessment today.
                    </p>
                  </motion.div>
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
                    >
                      Start Free Assessment
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <p className="text-white/70 text-sm mt-4">No credit card required • Free forever plan available</p>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

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
              <p className="text-sm text-slate-500">
                © 2026 MediCare AI. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
