"use client"

import { useState } from "react"
import Logo from "@/components/Logo"
import {
  Search, Star, MapPin, Calendar, Clock, Filter,
  ChevronDown, Video, MessageCircle, Phone,
  ArrowLeft, CheckCircle, DollarSign, Award
} from "lucide-react"

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    specialization: "Cardiologist",
    qualification: "MBBS, FCPS",
    experience: 15,
    location: "New York, NY",
    rating: 4.9,
    reviews: 487,
    fee: 5000,
    nextAvailable: "Today, 2:00 PM",
    image: "👩‍⚕️",
    verified: true
  },
  {
    id: 2,
    name: "Dr. Muhammad Khan",
    specialization: "Neurologist",
    qualification: "MBBS, MD",
    experience: 12,
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 356,
    fee: 4500,
    nextAvailable: "Tomorrow, 10:00 AM",
    image: "👨‍⚕️",
    verified: true
  },
  {
    id: 3,
    name: "Dr. Fatima Ali",
    specialization: "Dermatologist",
    qualification: "MBBS, FCPS",
    experience: 10,
    location: "Chicago, IL",
    rating: 4.9,
    reviews: 521,
    fee: 4000,
    nextAvailable: "Today, 3:00 PM",
    image: "👩‍⚕️",
    verified: true
  },
  {
    id: 4,
    name: "Dr. Hassan Raza",
    specialization: "Orthopedic Surgeon",
    qualification: "MBBS, MS Ortho",
    experience: 18,
    location: "Houston, TX",
    rating: 4.7,
    reviews: 298,
    fee: 5500,
    nextAvailable: "Wed, 2:00 PM",
    image: "👨‍⚕️",
    verified: true
  },
  {
    id: 5,
    name: "Dr. Ayesha Malik",
    specialization: "Gynecologist",
    qualification: "MBBS, FCPS",
    experience: 14,
    location: "Phoenix, AZ",
    rating: 4.9,
    reviews: 612,
    fee: 4500,
    nextAvailable: "Today, 11:00 AM",
    image: "👩‍⚕️",
    verified: true
  },
  {
    id: 6,
    name: "Dr. Usman Tariq",
    specialization: "General Physician",
    qualification: "MBBS, MCPS",
    experience: 8,
    location: "Philadelphia, PA",
    rating: 4.6,
    reviews: 234,
    fee: 2500,
    nextAvailable: "Today, 9:00 AM",
    image: "👨‍⚕️",
    verified: true
  },
]

const specializations = ["All", "Cardiologist", "Neurologist", "Dermatologist", "Orthopedic Surgeon", "Gynecologist", "General Physician"]

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = selectedSpecialization === "All" || doctor.specialization === selectedSpecialization
    return matchesSearch && matchesSpecialization
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
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

          {/* Search */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all font-semibold ${
                showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-6 rounded-2xl border-2 border-slate-200 bg-white">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Specialization</label>
                  <div className="relative">
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer font-medium"
                    >
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> doctors
            </p>
          </div>
        </div>
      </header>

      {/* Doctors Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-slate-100 mb-6">
              <Search className="h-16 w-16 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No doctors found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function DoctorCard({ doctor, index }: { doctor: any; index: number }) {
  return (
    <div
      className="group p-6 rounded-3xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Verified Badge */}
      {doctor.verified && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Verified</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-full blur-xl" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-slate-200 flex items-center justify-center text-5xl shadow-lg">
            {doctor.image}
          </div>
        </div>

        {/* Info */}
        <h3 className="text-lg font-bold text-slate-900 mb-1">{doctor.name}</h3>
        <p className="text-blue-600 font-semibold mb-1">{doctor.specialization}</p>
        <p className="text-sm text-slate-500 mb-4">{doctor.qualification}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 w-full justify-center">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm text-slate-700">{doctor.rating}</span>
            <span className="text-xs text-slate-500">({doctor.reviews})</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-700">{doctor.experience}y</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-700">{doctor.fee}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{doctor.location}</span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-medium">Next: {doctor.nextAvailable}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <button className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Book
          </button>
          <button className="p-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors">
            <Phone className="h-4 w-4 text-slate-600" />
          </button>
          <button className="p-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors">
            <Video className="h-4 w-4 text-slate-600" />
          </button>
          <button className="p-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors">
            <MessageCircle className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
