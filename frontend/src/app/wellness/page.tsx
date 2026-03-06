"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Logo from "@/components/Logo"
import {
  Heart, Droplets, Moon, Activity, Smile, Frown, Meh,
  TrendingUp, Calendar, X, Plus, Award, Star
} from "lucide-react"

export default function WellnessPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [wellnessHistory, setWellnessHistory] = useState<any[]>([])
  const [showLogModal, setShowLogModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [todayScore, setTodayScore] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    mood: "good",
    sleep_hours: 7,
    water_intake: 6,
    exercise_minutes: 30,
    stress_level: 5,
    notes: ""
  })

  const moods = [
    { value: "excellent", icon: Smile, label: "Excellent" },
    { value: "good", icon: Smile, label: "Good" },
    { value: "okay", icon: Meh, label: "Okay" },
    { value: "bad", icon: Frown, label: "Bad" }
  ]

  useEffect(() => {
    fetchWellness()
  }, [])

  const fetchWellness = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wellness?days=7`, {
        headers: {
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setWellnessHistory(data)
        // Check if today is logged
        const today = new Date().toISOString().split('T')[0]
        const todayData = data.find((d: any) => d.date === today)
        if (todayData) {
          setTodayScore(todayData.score)
        }
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const logWellness = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wellness`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setTodayScore(data.score)
        setShowLogModal(false)
        fetchWellness()
        setFormData({
          mood: "good",
          sleep_hours: 7,
          water_intake: 6,
          exercise_minutes: 30,
          stress_level: 5,
          notes: ""
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-100"
    if (score >= 60) return "text-amber-600 bg-amber-100"
    return "text-red-600 bg-red-100"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Attention"
  }

  const avgScore = wellnessHistory.length > 0
    ? Math.round(wellnessHistory.reduce((acc, w) => acc + w.score, 0) / wellnessHistory.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-600" />
            </button>
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-emerald-600 to-blue-600 shadow-md shadow-emerald-500/20"
              textClassName="text-lg text-slate-900"
              aiClassName="text-emerald-600"
            />
          </div>
          
          {!todayScore && (
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Log Today
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Today's Score */}
        {todayScore ? (
          <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-emerald-100 mb-2">Today's Wellness Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black">{todayScore}</span>
                  <span className="text-2xl text-emerald-100">/100</span>
                </div>
                <p className="text-emerald-100 mt-2 font-semibold">{getScoreLabel(todayScore)}</p>
              </div>
              <Award className="h-32 w-32 text-emerald-200 opacity-50" />
            </div>
            
            <button
              onClick={() => setShowLogModal(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              Update Score
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 text-center shadow-sm">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Log Your Day</h2>
            <p className="text-slate-600 mb-6">Track your sleep, water, exercise, and mood</p>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Start Tracking
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {wellnessHistory.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 text-center">
              <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{avgScore}</p>
              <p className="text-sm text-slate-500">Weekly Average</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 text-center">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{wellnessHistory.length}</p>
              <p className="text-sm text-slate-500">Days Logged</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 text-center">
              <Star className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{Math.max(...wellnessHistory.map(w => w.score))}</p>
              <p className="text-sm text-slate-500">Best Score</p>
            </div>
          </div>
        )}

        {/* History Chart */}
        {wellnessHistory.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              This Week
            </h3>
            
            <div className="flex items-end justify-between gap-2 h-48">
              {wellnessHistory.slice(0, 7).reverse().map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-xl transition-all ${getScoreColor(day.score)}`}
                    style={{ height: `${(day.score / 100) * 100}%`, minHeight: '20px' }}
                  />
                  <p className="text-xs text-slate-500 font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History List */}
        {wellnessHistory.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Logs</h3>
            <div className="space-y-3">
              {wellnessHistory.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${getScoreColor(day.score)}`}>
                      {day.score}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      <p className="text-sm text-slate-500">Mood: {day.mood}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    {day.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Log Wellness Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg my-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Log Your Wellness</h2>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Mood */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">How's your mood?</label>
                <div className="grid grid-cols-4 gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setFormData({ ...formData, mood: m.value })}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                        formData.mood === m.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <m.icon className={`h-6 w-6 ${
                        formData.mood === m.value ? "text-emerald-600" : "text-slate-400"
                      }`} />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Sleep hours: {formData.sleep_hours}h
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Water */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Water intake: {formData.water_intake} glasses
                </label>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={formData.water_intake}
                  onChange={(e) => setFormData({ ...formData, water_intake: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Exercise */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Exercise: {formData.exercise_minutes} minutes
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={formData.exercise_minutes}
                  onChange={(e) => setFormData({ ...formData, exercise_minutes: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Stress */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Stress level: {10 - formData.stress_level}/10 (10 = no stress)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.stress_level}
                  onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  rows={2}
                  placeholder="How are you feeling today?"
                />
              </div>

              <button
                onClick={logWellness}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Logging..." : "Log Wellness"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
