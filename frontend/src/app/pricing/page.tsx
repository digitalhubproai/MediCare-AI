"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import Logo from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import {
  CheckCircle, Stethoscope, Sparkles, ArrowRight,
  Brain, FileText, Heart, Shield, Zap, Award, Clock, Target
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [annual, setAnnual] = useState(true)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const plans = useMemo(() => [
    {
      name: "Free",
      description: "Perfect for getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "3 AI consultations/month",
        "Basic health reports",
        "7-day history",
        "Email support",
        "1 family member",
        "Basic symptom checker",
      ],
      cta: "Get Started Free",
      popular: false,
      color: "slate"
    },
    {
      name: "Pro",
      description: "For regular health tracking",
      monthlyPrice: 40,
      annualPrice: 33,
      features: [
        "Unlimited AI consultations",
        "Advanced health reports",
        "90-day history",
        "Priority support",
        "Up to 5 family members",
        "Advanced symptom checker",
        "Medication tracking",
        "Health trend analytics",
        "Report upload (unlimited)",
      ],
      cta: "Start Pro Trial",
      popular: true,
      color: "blue"
    },
    {
      name: "Enterprise",
      description: "For organizations & clinics",
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        "Everything in Pro",
        "Unlimited family members",
        "Dedicated account manager",
        "Custom integrations",
        "API access",
        "Advanced analytics",
        "White-label options",
        "SLA guarantee",
        "Training & onboarding",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "purple"
    },
  ], [])

  const colorConfig: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
    slate: { gradient: "from-slate-600 to-slate-500", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
    blue: { gradient: "from-blue-600 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    purple: { gradient: "from-purple-600 to-pink-500", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  }

  const compareFeatures = [
    { feature: "AI Consultations", free: "3/month", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Health Reports", free: "Basic", pro: "Advanced", enterprise: "Advanced + Custom" },
    { feature: "History Access", free: "7 days", pro: "90 days", enterprise: "Unlimited" },
    { feature: "Family Members", free: "1", pro: "5", enterprise: "Unlimited" },
    { feature: "Support", free: "Email", pro: "Priority", enterprise: "24/7 Dedicated" },
    { feature: "Report Uploads", free: "3/month", pro: "Unlimited", enterprise: "Unlimited + API" },
    { feature: "Analytics", free: "Basic", pro: "Advanced", enterprise: "Custom Dashboards" },
    { feature: "Integrations", free: "None", pro: "Standard", enterprise: "Custom + API" },
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
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Pricing Plans</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Simple, Transparent<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your healthcare needs. All plans include a 7-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <motion.div
                  animate={{ x: annual ? 28 : 2 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md absolute top-0.5"
                />
              </button>
              <span className={`text-sm font-medium ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
                Annual <span className="text-emerald-600 text-xs font-semibold">(Save 20%)</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 border-blue-500 shadow-xl shadow-blue-500/25'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-blue-600 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    ${annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className={plan.popular ? 'text-white/70' : 'text-slate-500'}>/month</span>
                  {annual && plan.monthlyPrice > 0 && (
                    <p className={`text-xs mt-2 ${plan.popular ? 'text-white/60' : 'text-slate-400'}`}>
                      Billed annually (${plan.annualPrice * 12}/year)
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold mb-6 transition-all ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:shadow-lg'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {plan.cta}
                </motion.button>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm ${plan.popular ? 'text-white' : 'text-slate-600'}`}>
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-emerald-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Compare Plans</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See which plan is right for you
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((row, i) => (
                  <tr key={i} className={i !== compareFeatures.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{row.free}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center bg-blue-50/50 font-medium">{row.pro}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about pricing</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and bank transfers for Enterprise plans." },
              { q: "Is there a free trial?", a: "Yes! All plans come with a 7-day free trial. No credit card required to start." },
              { q: "What happens after my trial ends?", a: "You can choose to continue with a paid plan or downgrade to the Free plan. Your data is always preserved." },
              { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time with no cancellation fees." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 p-6 rounded-xl border border-slate-200"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
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
                Start Your Free Trial Today
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust MediCare AI for their healthcare needs
              </p>
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Get Started Free
                </motion.button>
              </Link>
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
