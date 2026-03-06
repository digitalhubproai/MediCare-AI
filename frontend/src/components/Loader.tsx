"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Sparkles, Heart, Shield, Zap } from "lucide-react"

interface LoaderProps {
  onLoaded?: () => void
}

export default function Loader({ onLoaded }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Optimized progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 150)

    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoaded?.()
    }, 1000) // Reduced from 2500ms to 1000ms

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onLoaded])

  // Memoized particles to prevent re-renders
  const particles = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: i * 0.1
    })),
  [])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 flex items-center justify-center z-[9999] overflow-hidden"
      >
        {/* Simplified Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Particles - Optimized */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-sm"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3 + particle.id * 0.2,
                repeat: Infinity,
                delay: particle.delay
              }}
            />
          ))}
        </div>

        {/* Simplified Animated Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[350px] h-[350px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
        />

        {/* Main Content - Simplified */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl font-bold text-slate-900 mb-1"
          >
            MediCare<span className="text-blue-600">AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-xs text-slate-500 uppercase tracking-widest mb-6"
          >
            Healthcare Intelligence
          </motion.p>

          {/* Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600">Loading...</span>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "240px" }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative"
          >
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Initializing</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
