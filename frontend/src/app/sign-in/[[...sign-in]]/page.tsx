"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stethoscope, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, CheckCircle, Github } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Logo from "@/components/Logo"
import { motion } from "framer-motion"

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      signIn(email, email.split("@")[0])
      setLoading(false)
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Logo />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mb-6">
              <Lock className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h1>
            <p className="text-slate-600">Sign in to access your health dashboard</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-11"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Password
                </label>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-11 pr-11"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12"
            >
              {loading ? "Signing in..." : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                <span>256-bit SSL</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </motion.form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-slate-500 text-xs font-semibold uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <button className="btn-secondary h-12 justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
            <button className="btn-secondary h-12 justify-center">
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8 text-slate-600"
          >
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 font-semibold hover:underline">
              Sign up for free
            </Link>
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Animated Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-16">
          {/* Logo */}
          <div className="flex flex-col items-start gap-1">
            <Logo
              textClassName="text-2xl text-white"
              aiClassName="text-cyan-300"
              iconContainerClassName="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25"
              iconClassName="w-7 h-7 text-white"
            />
            <span className="text-[10px] text-blue-200 uppercase tracking-widest ml-[72px] mt-1 font-semibold">Healthcare Intelligence</span>
          </div>

          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-medium text-white">Welcome Back to Your Health Hub</span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight">
              Continue Your <br />
              <span className="text-cyan-300">Wellness Journey</span>
            </h1>

            <p className="text-lg text-blue-100 max-w-md">
              Access your personalized health dashboard with AI-powered insights, reports, and specialist connections.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "10K+", label: "Active Users" },
                { value: "99%", label: "Accuracy Rate" },
                { value: "24/7", label: "AI Support" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white/90 mb-4 leading-relaxed">
              &quot;As a physician, I recommend MediCare AI to all my patients. It&apos;s transformed how they understand their health.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
                DR
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Dr. Michael Chen</p>
                <p className="text-blue-200 text-xs">Physician</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
