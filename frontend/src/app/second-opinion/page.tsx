"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Logo from "@/components/Logo"
import {
  FileText, Plus, X, Brain, CheckCircle, Clock, AlertCircle,
  Send, Upload, Sparkles
} from "lucide-react"

export default function SecondOpinionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [opinions, setOpinions] = useState<any[]>([])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    original_diagnosis: "",
    prescribed_medications: "",
    symptoms: "",
    medical_reports: ""
  })

  useEffect(() => {
    fetchOpinions()
  }, [])

  const fetchOpinions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/second-opinion`, {
        headers: {
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setOpinions(data)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const submitOpinion = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/second-opinion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setShowRequestModal(false)
        fetchOpinions()
        setFormData({
          original_diagnosis: "",
          prescribed_medications: "",
          symptoms: "",
          medical_reports: ""
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-emerald-100 text-emerald-700"
      case "analyzing": return "bg-amber-100 text-amber-700"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-600" />
            </button>
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20"
              textClassName="text-lg text-slate-900"
              aiClassName="text-indigo-600"
            />
          </div>
          
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Request Opinion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {opinions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
              <Brain className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Get a Second Opinion</h2>
            <p className="text-slate-600 mb-6">Upload your diagnosis and get AI-powered analysis</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Request First Opinion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {opinions.map((opinion) => (
              <div
                key={opinion.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Diagnosis Review</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(opinion.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(opinion.status)}`}>
                    {opinion.status === "analyzing" && <Clock className="h-4 w-4 inline mr-1" />}
                    {opinion.status === "completed" && <CheckCircle className="h-4 w-4 inline mr-1" />}
                    {opinion.status.charAt(0).toUpperCase() + opinion.status.slice(1)}
                  </span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Original Diagnosis:</p>
                  <p className="text-slate-600">{opinion.original_diagnosis}</p>
                </div>
                
                {opinion.ai_analysis ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <p className="font-bold text-indigo-900">AI Analysis</p>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{opinion.ai_analysis}</p>
                    {opinion.ai_recommendations && (
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        <p className="font-bold text-indigo-900 mb-2">Recommendations:</p>
                        <p className="text-slate-700">{opinion.ai_recommendations}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                    <p className="text-amber-800 font-medium">
                      AI is analyzing your diagnosis. This usually takes 2-5 minutes.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Request Second Opinion</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Original Diagnosis *
                </label>
                <textarea
                  value={formData.original_diagnosis}
                  onChange={(e) => setFormData({ ...formData, original_diagnosis: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
                  rows={3}
                  placeholder="What diagnosis did your doctor give?"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Current Symptoms *
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe your symptoms in detail"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Prescribed Medications (if any)
                </label>
                <textarea
                  value={formData.prescribed_medications}
                  onChange={(e) => setFormData({ ...formData, prescribed_medications: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
                  rows={2}
                  placeholder="List medications prescribed by your doctor"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Medical Reports (optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Upload lab reports, test results, or prescriptions</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-indigo-900 text-sm">What to expect</p>
                    <ul className="text-xs text-indigo-700 mt-2 space-y-1">
                      <li>• AI will analyze your diagnosis within 2-5 minutes</li>
                      <li>• You'll receive a detailed second opinion</li>
                      <li>• Recommendations for next steps</li>
                      <li>• This does NOT replace professional medical advice</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={submitOpinion}
                disabled={loading || !formData.original_diagnosis || !formData.symptoms}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? "Submitting..." : "Submit for Analysis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
