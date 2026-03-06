"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Logo from "@/components/Logo"
import {
  Plus, Pill, Clock, Trash2, Edit2, CheckCircle, X, AlertTriangle,
  FlaskConical, Calendar, Bell
} from "lucide-react"

interface Medication {
  id: string
  medicine_name: string
  dosage: string
  frequency: string
  instructions: string
  is_active: boolean
}

export default function MedicationsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [medications, setMedications] = useState<Medication[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showInteractionChecker, setShowInteractionChecker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newMeds, setNewMeds] = useState({
    medicine_name: "",
    dosage: "",
    frequency: "Once daily",
    instructions: ""
  })
  const [medicinesToCheck, setMedicinesToCheck] = useState("")
  const [interactions, setInteractions] = useState<any[]>([])

  useEffect(() => {
    fetchMedications()
  }, [])

  const fetchMedications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medications`, {
        headers: {
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setMedications(data)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const addMedication = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        },
        body: JSON.stringify(newMeds)
      })
      
      if (res.ok) {
        setShowAddModal(false)
        fetchMedications()
        setNewMeds({ medicine_name: "", dosage: "", frequency: "Once daily", instructions: "" })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMedication = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        }
      })
      
      if (res.ok) {
        fetchMedications()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const checkInteractions = async () => {
    const medicines = medicinesToCheck.split(",").map(m => m.trim()).filter(m => m)
    if (medicines.length < 2) {
      alert("Please enter at least 2 medicines to check")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        },
        body: JSON.stringify({ medicines })
      })
      
      if (res.ok) {
        const data = await res.json()
        setInteractions(data.interactions)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const frequencies = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "As needed", "Before bed"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-600" />
            </button>
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20"
              textClassName="text-lg text-slate-900"
              aiClassName="text-blue-600"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowInteractionChecker(!showInteractionChecker)}
              className="px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 transition-colors text-sm"
            >
              Check Interactions
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Medicine
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Interaction Checker */}
        {showInteractionChecker && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-600" />
              Medicine Interaction Checker
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Enter medicines (comma-separated)
                </label>
                <textarea
                  value={medicinesToCheck}
                  onChange={(e) => setMedicinesToCheck(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  rows={3}
                  placeholder="Aspirin, Warfarin, Metformin, etc."
                />
              </div>
              <button
                onClick={checkInteractions}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Checking..." : "Check Interactions"}
              </button>
              
              {interactions.length > 0 && (
                <div className="space-y-3 mt-4">
                  {interactions.map((interaction, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 ${
                        interaction.severity === "high"
                          ? "bg-red-50 border-red-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          interaction.severity === "high" ? "text-red-600" : "text-amber-600"
                        }`} />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">
                            {interaction.medicine_1} + {interaction.medicine_2}
                          </p>
                          <p className="text-sm text-slate-700 mt-1">{interaction.description}</p>
                          <p className="text-sm text-slate-600 mt-2 font-semibold">
                            💡 {interaction.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medications List */}
        {medications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
              <Pill className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No medications yet</h2>
            <p className="text-slate-600 mb-6">Add your first medication to start tracking</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Add Medication
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{med.medicine_name}</h3>
                      <p className="text-sm text-slate-500">{med.dosage}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>{med.frequency}</span>
                  </div>
                  {med.instructions && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                      💡 {med.instructions}
                    </p>
                  )}
                </div>
                
                {med.is_active && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Medication</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Medicine Name</label>
                <input
                  type="text"
                  value={newMeds.medicine_name}
                  onChange={(e) => setNewMeds({ ...newMeds, medicine_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Paracetamol"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Dosage</label>
                <input
                  type="text"
                  value={newMeds.dosage}
                  onChange={(e) => setNewMeds({ ...newMeds, dosage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Frequency</label>
                <select
                  value={newMeds.frequency}
                  onChange={(e) => setNewMeds({ ...newMeds, frequency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {frequencies.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Instructions</label>
                <textarea
                  value={newMeds.instructions}
                  onChange={(e) => setNewMeds({ ...newMeds, instructions: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="e.g., Take after meals"
                />
              </div>

              <button
                onClick={addMedication}
                disabled={loading || !newMeds.medicine_name || !newMeds.dosage}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Medication"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
