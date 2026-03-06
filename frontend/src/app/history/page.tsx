"use client"

import { useState } from "react"
import Logo from "@/components/Logo"
import {
  History, FileText, MessageCircle, Clock, TrendingUp, TrendingDown,
  Calendar, Activity, Heart, ArrowLeft, Search, Filter,
  ChevronRight, CheckCircle, AlertCircle
} from "lucide-react"

const mockConsultations = [
  {
    id: "1",
    date: "2025-01-15",
    symptoms: "Headache, fever, body pain",
    diagnosis: "Viral Fever",
    medicines: ["Paracetamol 500mg", "Vitamin C"],
    status: "completed",
    doctor: "AI Assistant",
    duration: "15 min"
  },
  {
    id: "2",
    date: "2025-01-10",
    symptoms: "Stomach pain, nausea",
    diagnosis: "Acid Reflux",
    medicines: ["Omeprazole 20mg"],
    status: "completed",
    doctor: "AI Assistant",
    duration: "12 min"
  },
  {
    id: "3",
    date: "2025-01-05",
    symptoms: "Cough, cold, sore throat",
    diagnosis: "Common Cold",
    medicines: ["Cetirizine 10mg"],
    status: "completed",
    doctor: "AI Assistant",
    duration: "10 min"
  },
]

const mockReports = [
  { id: "1", type: "Blood Test (CBC)", date: "2025-01-12", urgency: "low", category: "Blood", icon: "🩸" },
  { id: "2", type: "Lipid Profile", date: "2025-01-08", urgency: "medium", category: "Blood", icon: "📊" },
  { id: "3", type: "X-Ray Chest", date: "2024-12-20", urgency: "low", category: "Imaging", icon: "📷" },
  { id: "4", type: "ECG", date: "2024-12-15", urgency: "high", category: "Cardiac", icon: "💓" },
]

const healthMetrics = [
  { label: "Consultations", value: "4", change: "+2", trend: "up", icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Reports", value: "4", change: "+1", trend: "up", icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Avg Response", value: "14m", change: "-3m", trend: "down", icon: Clock, color: "text-cyan-600", bg: "bg-cyan-100" },
  { label: "Health Score", value: "85", change: "+5", trend: "up", icon: Heart, color: "text-rose-600", bg: "bg-rose-100" },
]

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "consultations" | "reports">("overview")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-soft/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => window.history.back()} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20"
              textClassName="text-lg text-slate-900"
              aiClassName="text-blue-600"
            />
          </div>

          {/* Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl border-2 border-slate-200">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "consultations", label: "Consultations", icon: MessageCircle },
              { id: "reports", label: "Reports", icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-soft text-blue-600 shadow-lg shadow-black/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metrics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-soft shadow-lg shadow-black/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center ${metric.color}`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                      metric.trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"
                    }`}>
                      <TrendingUp className="h-3 w-3" />
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-slate-600">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-soft shadow-lg shadow-black/20">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[...mockConsultations.slice(0, 2), ...mockReports.slice(0, 2)].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      {'diagnosis' in item ? <MessageCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{'diagnosis' in item ? item.diagnosis : item.type}</p>
                      <p className="text-sm text-slate-500">{item.date}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "consultations" && (
          <div className="space-y-4">
            {mockConsultations.map((consultation, index) => (
              <div
                key={consultation.id}
                className="p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-soft shadow-lg shadow-black/20 hover:shadow-lg shadow-black/20-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{consultation.diagnosis}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {consultation.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {consultation.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-2 font-semibold">Symptoms</p>
                    <p className="text-sm text-slate-700">{consultation.symptoms}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-2 font-semibold">Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {consultation.medicines.map((med, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white shadow-soft border border-slate-200 text-xs font-medium text-slate-700">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid md:grid-cols-2 gap-4">
            {mockReports.map((report, index) => {
              const urgencyConfig: Record<string, { color: string; bg: string; label: string }> = {
                critical: { color: "text-rose-600", bg: "bg-rose-100", label: "Critical" },
                high: { color: "text-orange-600", bg: "bg-orange-100", label: "High" },
                medium: { color: "text-amber-600", bg: "bg-amber-100", label: "Medium" },
                low: { color: "text-emerald-600", bg: "bg-emerald-100", label: "Normal" }
              }
              const config = urgencyConfig[report.urgency] || urgencyConfig.low

              return (
                <div
                  key={report.id}
                  className="p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-soft shadow-lg shadow-black/20 hover:shadow-lg shadow-black/20-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{report.icon}</div>
                      <div>
                        <h3 className="font-bold text-slate-900">{report.type}</h3>
                        <p className="text-sm text-slate-500">{report.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.color} border border-current border-opacity-20`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 font-semibold">Category</p>
                      <p className="text-sm font-semibold text-slate-700">{report.category}</p>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 font-semibold">Status</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
