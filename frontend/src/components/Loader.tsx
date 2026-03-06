"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"
import { Brain, Sparkles, Heart, Shield, Zap } from "lucide-react"

interface LoaderProps {
  onLoaded?: () => void
}

export default function Loader({ onLoaded }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoaded?.()
    }, 2500)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onLoaded])

  // Anime.js particles animation
  useEffect(() => {
    if (!isLoading || !particlesRef.current) return

    const particles = particlesRef.current.children

    animate(particles, {
      translateX: () => Math.random() * 400 - 200,
      translateY: () => Math.random() * 400 - 200,
      scale: () => Math.random() + 0.5,
      opacity: () => Math.random() * 0.6 + 0.2,
      delay: stagger(100),
      duration: 2000,
      ease: 'easeInOut',
      loop: true,
      alternate: true
    })

    // Logo rotation animation
    animate('.loader-logo', {
      rotate: 360,
      duration: 8000,
      ease: 'linear',
      loop: true
    })

    // Floating animation
    animate('.loader-content', {
      translateY: [-15, 15],
      duration: 2000,
      ease: 'easeInOut',
      loop: true
    })

    // Icon burst animation
    const icons = ['.loader-icon-1', '.loader-icon-2', '.loader-icon-3', '.loader-icon-4']
    icons.forEach((icon, i) => {
      animate(icon, {
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        delay: i * 300,
        duration: 1500,
        ease: 'easeOutExpo',
        loop: true
      })
    })
  }, [isLoading])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 flex items-center justify-center z-[9999] overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Particles */}
        <div ref={particlesRef} className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Animated Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -60, 0],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
        />

        {/* Main Content */}
        <div className="loader-content relative z-10 flex flex-col items-center">
          {/* Logo Container */}
          <div className="relative mb-8">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
            
            {/* Main Logo */}
            <motion.div
              className="loader-logo relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            >
              <Brain className="w-12 h-12 text-white" />
              
              {/* Rotating Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-dashed border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Orbiting Icons */}
            <div className="absolute inset-0 w-40 h-40 -m-8">
              <motion.div
                className="loader-icon-1 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div
                className="loader-icon-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Heart className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div
                className="loader-icon-3 absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div
                className="loader-icon-4 absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              MediCare<span className="text-blue-600">AI</span>
            </h1>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Healthcare Intelligence</p>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"
                  animate={{
                    y: [-5, 5, -5],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600">Initializing AI...</span>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "280px" }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative"
          >
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500 rounded-full relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slide" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Loading AI Models</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {[
              { icon: Brain, text: "AI Diagnostics", color: "from-blue-500 to-cyan-500" },
              { icon: FileText, text: "Report Analysis", color: "from-purple-500 to-pink-500" },
              { icon: Shield, text: "HIPAA Secure", color: "from-emerald-500 to-teal-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15, type: "spring" }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 rounded-full bg-white border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-2"
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-700">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function FileText(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M12 18v-6"/>
      <path d="m9 15 3 3 3-3"/>
    </svg>
  )
}
