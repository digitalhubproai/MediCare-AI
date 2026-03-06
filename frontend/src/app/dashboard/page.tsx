"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"
import Logo from "@/components/Logo"
import {
  Brain, FileText, Settings, LogOut, MessageCircle,
  Activity, Heart, Bell,
  Search, Calendar, CheckCircle, Star, ChevronRight,
  Microscope, Pill, Users, Menu, Home,
  Thermometer, Droplets, Moon, RefreshCw, ArrowUpRight, Zap, Shield,
  TrendingUp, TrendingDown, Clock, Award, Target,
  ChevronDown, Plus, MoreHorizontal, CalendarDays, Timer,
  Syringe, Stethoscope, User, HelpCircle, LogOut as LogOutIcon,
  Sparkles, BarChart3, PieChart, LineChart as LineChartIcon,
  AlertCircle, Check, X, Play, Pause, SkipForward
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [medicationIndex, setMedicationIndex] = useState(0)
  const [medicationPlaying, setMedicationPlaying] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    animate('.dashboard-card', {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(80, { start: 100 }),
      duration: 500,
      ease: 'easeOutExpo'
    })
  }, [])

  const getInitials = () => {
    if (session?.user?.name) {
      const names = session.user.name.split(' ')
      return names.length >= 2 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : session.user.name.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const userName = session?.user?.name?.split(' ')[0] || 'User'

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", section: "Main" },
    { icon: MessageCircle, label: "AI Chatbot", href: "/chatbot", badge: "New", section: "Main" },
    { icon: Microscope, label: "Reports", href: "/reports", section: "Health" },
    { icon: Pill, label: "Medications", href: "/medications", section: "Health" },
    { icon: Heart, label: "Wellness", href: "/wellness", section: "Health" },
    { icon: Users, label: "Family", href: "/family", section: "Health" },
    { icon: Brain, label: "Second Opinion", href: "/second-opinion", section: "Advanced" },
    { icon: FileText, label: "History", href: "/history", section: "Advanced" },
  ]

  const stats = [
    { title: "AI Consultations", value: "12", change: "+2.4%", trend: "up", icon: MessageCircle, color: "blue" },
    { title: "Reports Analyzed", value: "04", change: "+12.5%", trend: "up", icon: FileText, color: "purple" },
    { title: "Health Score", value: "94", change: "+5.2%", trend: "up", icon: Heart, color: "emerald" },
    { title: "Active Meds", value: "03", change: "On track", trend: "stable", icon: Pill, color: "amber" },
  ]

  const colorConfig: Record<string, { bg: string; text: string; gradient: string; light: string; ring: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500", light: "bg-blue-50/50", ring: "stroke-blue-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", gradient: "from-purple-500 to-pink-500", light: "bg-purple-50/50", ring: "stroke-purple-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500", light: "bg-emerald-50/50", ring: "stroke-emerald-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", gradient: "from-amber-500 to-orange-500", light: "bg-amber-50/50", ring: "stroke-amber-500" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", gradient: "from-rose-500 to-red-500", light: "bg-rose-50/50", ring: "stroke-rose-500" },
  }

  const recentActivities = [
    { icon: MessageCircle, title: "AI Consultation", desc: "Discussed fever and headache", time: "2h ago", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: FileText, title: "Blood Test Report", desc: "Complete blood count analyzed", time: "1d ago", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Pill, title: "Medication Taken", desc: "Paracetamol 500mg", time: "2d ago", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Activity, title: "Wellness Check-in", desc: "Mood: Good, Sleep: 7.5h", time: "3d ago", color: "text-pink-600", bg: "bg-pink-50" },
  ]

  const notifications = [
    { icon: Bell, title: "Medication Reminder", desc: "Time to take your medicine", time: "5m ago", unread: true },
    { icon: CheckCircle, title: "Report Ready", desc: "Your blood test results are ready", time: "1h ago", unread: true },
    { icon: Star, title: "Achievement", desc: "7-day medication streak!", time: "1d ago", unread: false },
  ]

  const healthMetrics = [
    { icon: Thermometer, label: "Temperature", value: "98.6", unit: "°F", trend: "Normal", trendValue: 0, color: "emerald", min: 97, max: 99, current: 98.6 },
    { icon: Activity, label: "Heart Rate", value: "72", unit: "bpm", trend: "Normal", trendValue: 0, color: "blue", min: 60, max: 100, current: 72 },
    { icon: Droplets, label: "Hydration", value: "75", unit: "%", trend: "+12%", trendValue: 12, color: "cyan", min: 0, max: 100, current: 75 },
    { icon: Moon, label: "Sleep", value: "7.5", unit: "hrs", trend: "+5%", trendValue: 5, color: "purple", min: 0, max: 12, current: 7.5 },
  ]

  const healthTrends = [
    { day: "Mon", score: 88, consultations: 2 },
    { day: "Tue", score: 92, consultations: 1 },
    { day: "Wed", score: 89, consultations: 3 },
    { day: "Thu", score: 94, consultations: 1 },
    { day: "Fri", score: 91, consultations: 2 },
    { day: "Sat", score: 96, consultations: 0 },
    { day: "Sun", score: 94, consultations: 1 },
  ]

  const medications = [
    { name: "Paracetamol", dosage: "500mg", time: "8:00 AM", taken: true, color: "emerald" },
    { name: "Vitamin D3", dosage: "1000 IU", time: "12:00 PM", taken: false, color: "amber" },
    { name: "Omega-3", dosage: "1000mg", time: "8:00 PM", taken: false, color: "blue" },
  ]

  const appointments = [
    { doctor: "Dr. Sarah Wilson", specialty: "Cardiologist", date: "Mar 10, 2026", time: "10:00 AM", status: "upcoming", image: "SW" },
    { doctor: "Dr. James Chen", specialty: "General Physician", date: "Mar 15, 2026", time: "2:30 PM", status: "upcoming", image: "JC" },
    { doctor: "Dr. Emily Brown", specialty: "Dermatologist", date: "Feb 28, 2026", time: "11:00 AM", status: "completed", image: "EB" },
  ]

  const aiInsights = [
    { 
      type: "recommendation", 
      title: "Sleep Quality Improvement", 
      desc: "Your sleep patterns show improvement. Consider maintaining your current bedtime routine.",
      icon: Moon,
      color: "purple"
    },
    { 
      type: "alert", 
      title: "Hydration Reminder", 
      desc: "You're drinking less water than recommended. Aim for 8 glasses daily.",
      icon: Droplets,
      color: "blue"
    },
    { 
      type: "achievement", 
      title: "Medication Streak", 
      desc: "Great job! You've taken your medications on time for 7 consecutive days.",
      icon: Award,
      color: "emerald"
    },
  ]

  const quickActions = [
    { icon: MessageCircle, label: "Ask AI", href: "/chatbot", color: "blue" },
    { icon: Microscope, label: "Upload Report", href: "/reports", color: "purple" },
    { icon: Calendar, label: "Book Appointment", href: "/doctors", color: "emerald" },
    { icon: Pill, label: "Medications", href: "/medications", color: "amber" },
    { icon: User, label: "AI Doctors", href: "/ai-doctors", color: "rose", badge: "New" },
  ]

  const weeklyActivityData = [45, 52, 38, 65, 48, 72, 55]
  const maxActivity = Math.max(...weeklyActivityData)

  const CircularProgress = ({ value, max, color, size = 120, strokeWidth = 10 }: { value: number; max: number; color: string; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const progress = value / max
    const dashoffset = circumference - progress * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${colorConfig[color as keyof typeof colorConfig]?.ring || 'stroke-blue-500'} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-900">{value}</span>
        </div>
      </div>
    )
  }

  const MedicationProgress = ({ medications }: { medications: typeof medications }) => {
    const taken = medications.filter(m => m.taken).length
    const progress = (taken / medications.length) * 100

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Daily Progress</span>
          <span className="text-sm font-bold text-slate-900">{taken}/{medications.length}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          />
        </div>
        <div className="flex items-center gap-2 pt-2">
          {medications.map((med, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                med.taken 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {med.taken ? <Check className="w-4 h-4" /> : <Pill className="w-4 h-4" />}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 z-50 flex flex-col shadow-2xl"
            >
              {/* Logo */}
              <div className="p-6 border-b border-slate-100/50">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <Logo
                    iconContainerClassName="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
                    textClassName="text-lg font-bold text-slate-900"
                    aiClassName="text-blue-600"
                  />
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                {["Main", "Health", "Advanced"].map((section) => (
                  <div key={section}>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
                      {section}
                    </h3>
                    <div className="space-y-1">
                      {navItems.filter(item => item.section === section).map((item) => (
                        <motion.button
                          key={item.label}
                          whileHover={{ x: 4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push(item.href)}
                          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${
                            item.label === "Dashboard"
                              ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                              : "text-slate-600 hover:bg-slate-50 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.label === "Dashboard" ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              item.label === "Dashboard" 
                                ? "bg-white/20 text-white" 
                                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-slate-100/50">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                      {getInitials()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-slate-900">{userName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        Premium Member
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-700">
                            <User className="w-4 h-4" />
                            Profile
                          </button>
                          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-700">
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>
                          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-700">
                            <HelpCircle className="w-4 h-4" />
                            Help & Support
                          </button>
                        </div>
                        <div className="p-2 border-t border-slate-100">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-sm text-red-600">
                            <LogOutIcon className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </motion.button>
            
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
              <p className="text-xs text-slate-500">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-3 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full border-2 border-white" />
                </motion.button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Mark all read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.04)' }}
                            className={`p-4 border-b border-slate-50 cursor-pointer ${notification.unread ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                notification.unread ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-slate-100'
                              }`}>
                                <notification.icon className={`w-5 h-5 ${notification.unread ? 'text-white' : 'text-slate-600'}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                                <p className="text-xs text-slate-500 mt-1">{notification.desc}</p>
                                <p className="text-[10px] text-slate-400 mt-2">{notification.time}</p>
                              </div>
                              {notification.unread && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2" />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-lg shadow-blue-500/30">
                {getInitials()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {userName}! 👋</h1>
                <p className="text-slate-600">Here's your comprehensive health overview for today</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                Quick Action
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="dashboard-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4 relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorConfig[stat.color].gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                    stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                    stat.trend === 'down' ? 'bg-red-50 text-red-600' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : stat.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid - Row 1 */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Health Trends Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Health Trends</h3>
                  <p className="text-sm text-slate-500">Weekly health score overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-all">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-all">
                    <LineChartIcon className="w-5 h-5 text-slate-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-all">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
              
              {/* Chart */}
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {healthTrends.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${(item.score / 100) * 100}%`, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full relative flex-1 flex items-end">
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                          className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 rounded-t-xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ transformOrigin: 'bottom' }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                          {item.score}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{item.day}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Medication Tracker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Medications</h3>
                  <p className="text-sm text-slate-500">Today's schedule</p>
                </div>
                <button 
                  onClick={() => router.push("/medications")}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <MedicationProgress medications={medications} />

              <div className="mt-6 space-y-3">
                {medications.map((med, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      med.taken 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          med.taken 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                            : `bg-gradient-to-br from-${med.color}-500 to-${med.color}-400`
                        }`}>
                          {med.taken ? <Check className="w-5 h-5 text-white" /> : <Pill className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${med.taken ? 'text-emerald-900' : 'text-slate-900'}`}>{med.name}</p>
                          <p className="text-xs text-slate-500">{med.dosage} • {med.time}</p>
                        </div>
                      </div>
                      {!med.taken && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Grid - Row 2 */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Recent Activity</h3>
                  <p className="text-sm text-slate-500">Your last 30 days</p>
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white hover:from-blue-50 hover:to-white border border-transparent hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${activity.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <activity.icon className={`w-6 h-6 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400">{activity.time}</span>
                      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Appointments</h3>
                  <p className="text-sm text-slate-500">Upcoming & recent</p>
                </div>
                <button 
                  onClick={() => router.push("/doctors")}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <CalendarDays className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                {appointments.map((apt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      apt.status === 'upcoming' 
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                        apt.status === 'upcoming' 
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-500' 
                          : 'bg-slate-400'
                      }`}>
                        {apt.image}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{apt.doctor}</p>
                        <p className="text-xs text-slate-500 mb-2">{apt.specialty}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {apt.date}
                          <span className="mx-1">•</span>
                          <Clock className="w-3 h-3" />
                          {apt.time}
                        </div>
                      </div>
                      {apt.status === 'upcoming' && (
                        <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600 text-[10px] font-bold">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/doctors")}
                className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Book New Appointment
              </motion.button>
            </motion.div>
          </div>

          {/* Main Grid - Row 3 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl shadow-blue-500/20 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">AI Health Insights</h3>
                      <p className="text-sm text-white/80">Personalized recommendations</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/30 transition-all"
                  >
                    View All
                  </motion.button>
                </div>

                <div className="space-y-3">
                  {aiInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0`}>
                          <insight.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-sm">{insight.title}</p>
                          <p className="text-xs text-white/80 mt-1">{insight.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions & Health Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Quick Actions</h3>
                  <p className="text-sm text-slate-500">Frequently used features</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(action.href)}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${colorConfig[action.color].gradient} text-white shadow-lg transition-all relative`}
                  >
                    <action.icon className="w-6 h-6 mb-3" />
                    <p className="font-bold text-sm">{action.label}</p>
                    {action.badge && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-white text-red-600 text-[10px] font-bold shadow-lg">
                        {action.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Mini Health Metrics */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-slate-900">Vitals Overview</h4>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View Details</button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {healthMetrics.slice(0, 4).map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <metric.icon className={`w-4 h-4 mx-auto mb-2 ${colorConfig[metric.color as keyof typeof colorConfig]?.text || 'text-blue-600'}`} />
                      <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                      <p className="text-[10px] text-slate-500">{metric.unit}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Weekly Activity</h3>
                <p className="text-sm text-slate-500">Your health engagement this week</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">This Week</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Summary Cards */}
              <div className="lg:col-span-1 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">53</p>
                      <p className="text-xs text-slate-500">Total Activities</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">89%</p>
                      <p className="text-xs text-slate-500">Completion Rate</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">12</p>
                      <p className="text-xs text-slate-500">Achievements</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Bars */}
              <div className="lg:col-span-3">
                <div className="h-48 flex items-end justify-between gap-3">
                  {weeklyActivityData.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${(value / maxActivity) * 100}%`, opacity: 1 }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full relative group">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 rounded-t-xl opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                          style={{ height: '192px' }}
                        />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {value} activities
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Upgrade Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-2xl shadow-blue-500/30"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Star className="w-8 h-8 fill-yellow-300 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl">Upgrade to Premium</h3>
                    <p className="text-sm text-white/80">Unlock the full potential of MediCare AI</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                    <span className="text-sm font-medium">Unlimited Report Analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                    <span className="text-sm font-medium">Priority 24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                    <span className="text-sm font-medium">Family Access (5 members)</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-base shadow-xl hover:shadow-2xl transition-all"
                >
                  Upgrade Now - $40/month
                </motion.button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-24 h-24 text-white/60" />
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
