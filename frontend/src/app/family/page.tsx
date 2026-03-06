"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Logo from "@/components/Logo"
import {
  Users, Plus, X, Edit2, Trash2, Heart, Droplet, Pill,
  Calendar, User, Save
} from "lucide-react"

interface FamilyMember {
  id: string
  name: string
  relation: string
  blood_group?: string
  medical_conditions?: string
  allergies?: string
  date_of_birth?: string
}

export default function FamilyPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    relation: "Spouse",
    blood_group: "",
    date_of_birth: "",
    gender: "male",
    medical_conditions: "",
    allergies: "",
    medications: ""
  })

  const relations = ["Spouse", "Child", "Parent", "Sibling", "Grandparent", "Other"]
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/family`, {
        headers: {
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setMembers(data)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const addMember = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setShowAddModal(false)
        fetchMembers()
        resetForm()
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      relation: "Spouse",
      blood_group: "",
      date_of_birth: "",
      gender: "male",
      medical_conditions: "",
      allergies: "",
      medications: ""
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-600" />
            </button>
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 shadow-md shadow-purple-500/20"
              textClassName="text-lg text-slate-900"
              aiClassName="text-purple-600"
            />
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {members.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No family members yet</h2>
            <p className="text-slate-600 mb-6">Add your first family member to track medical history</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Add Family Member
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl font-bold text-purple-600">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.relation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {member.blood_group && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Droplet className="h-4 w-4 text-red-500" />
                      <span>{member.blood_group}</span>
                    </div>
                  )}
                  {member.medical_conditions && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <Heart className="h-4 w-4 text-pink-500 mt-0.5" />
                      <span>{member.medical_conditions}</span>
                    </div>
                  )}
                  {member.allergies && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <Pill className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>{member.allergies}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Family Member</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Relation</label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  >
                    {relations.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Blood Group</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "other"].map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                        formData.gender === g
                          ? "border-purple-500 bg-purple-50 text-purple-600"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Medical Conditions</label>
                <textarea
                  value={formData.medical_conditions}
                  onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  rows={2}
                  placeholder="Diabetes, Hypertension, Heart disease, etc."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Allergies</label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  rows={2}
                  placeholder="Peanuts, Penicillin, etc."
                />
              </div>

              <button
                onClick={addMember}
                disabled={loading || !formData.name}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Family Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
