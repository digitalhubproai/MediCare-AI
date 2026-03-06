"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Logo from "@/components/Logo"
import {
  Phone, MapPin, Heart, Shield, AlertTriangle, CheckCircle,
  Edit2, Save, X, Hospital, User, Droplet, Clock
} from "lucide-react"

export default function EmergencyPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    blood_group: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    allergies: "",
    medical_conditions: ""
  })

  useEffect(() => {
    fetchEmergencyProfile()
  }, [])

  const fetchEmergencyProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergency-profile`, {
        headers: {
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setProfile({
          blood_group: data.blood_group || "",
          emergency_contact_name: data.emergency_contact?.name || "",
          emergency_contact_phone: data.emergency_contact?.phone || "",
          emergency_contact_relation: data.emergency_contact?.relation || "",
          allergies: data.allergies || "",
          medical_conditions: data.medical_conditions || ""
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergency-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.user?.token}`
        },
        body: JSON.stringify(profile)
      })
      
      if (res.ok) {
        setIsEditing(false)
        alert("Emergency profile updated successfully!")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  const callEmergency = () => {
    window.location.href = "tel:911"
  }

  const callContact = () => {
    if (profile.emergency_contact_phone) {
      window.location.href = `tel:${profile.emergency_contact_phone}`
    }
  }

  const findHospitals = () => {
    window.open(`https://www.google.com/maps/search/hospitals+near+me`, "_blank")
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b border-red-200 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-red-50">
              <X className="h-5 w-5 text-red-600" />
            </button>
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 shadow-md shadow-red-500/20"
              textClassName="text-lg text-red-900"
              aiClassName="text-red-600"
              iconClassName="w-5 h-5 text-white"
            />
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            {isEditing ? <X className="h-5 w-5 text-red-600" /> : <Edit2 className="h-5 w-5 text-red-600" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Emergency Call Button */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 text-white text-center shadow-2xl shadow-red-600/30">
          <Phone className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-black mb-2">Emergency?</h2>
          <p className="text-red-100 mb-6">Call emergency services immediately</p>
          <button
            onClick={callEmergency}
            className="px-12 py-4 bg-white text-red-600 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl"
          >
            Call 911
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={callContact}
            disabled={!profile.emergency_contact_phone}
            className="p-6 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-blue-900">Call Contact</p>
            <p className="text-sm text-blue-600">{profile.emergency_contact_name || "Not set"}</p>
          </button>
          
          <button
            onClick={findHospitals}
            className="p-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <Hospital className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-emerald-900">Nearby Hospitals</p>
            <p className="text-sm text-emerald-600">Find help near you</p>
          </button>
        </div>

        {/* Medical Profile */}
        <div className="bg-white rounded-2xl border-2 border-red-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
              Medical Profile
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-red-600 font-semibold hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Blood Group */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Blood Group</label>
              {isEditing ? (
                <select
                  value={profile.blood_group}
                  onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
                  <Droplet className="h-6 w-6 text-red-600" />
                  <span className="text-2xl font-bold text-red-900">{profile.blood_group || "Not specified"}</span>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Contact Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.emergency_contact_name}
                    onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{profile.emergency_contact_name || "Not set"}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Contact Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.emergency_contact_phone}
                    onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                    placeholder="+1234567890"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{profile.emergency_contact_phone || "Not set"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Relation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergency_contact_relation}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_relation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  placeholder="Spouse, Parent, etc."
                />
              ) : (
                <p className="text-slate-900 font-medium">{profile.emergency_contact_relation || "Not set"}</p>
              )}
            </div>

            {/* Allergies */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Allergies</label>
              {isEditing ? (
                <textarea
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  rows={3}
                  placeholder="List any allergies (medications, food, etc.)"
                />
              ) : (
                <p className="text-slate-900 font-medium">{profile.allergies || "None specified"}</p>
              )}
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Medical Conditions</label>
              {isEditing ? (
                <textarea
                  value={profile.medical_conditions}
                  onChange={(e) => setProfile({ ...profile, medical_conditions: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none"
                  rows={3}
                  placeholder="Diabetes, Hypertension, Asthma, etc."
                />
              ) : (
                <p className="text-slate-900 font-medium">{profile.medical_conditions || "None specified"}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveProfile}
                disabled={loading}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Save Profile
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Tips
          </h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              Keep this information updated at all times
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              Share your emergency contact with family members
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              In case of severe symptoms, call 911 immediately
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              Keep a printed copy of your medical profile
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
