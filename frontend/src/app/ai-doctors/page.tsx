"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"
import ReactMarkdown from "react-markdown"
import {
  ArrowLeft, Send, Loader2, Phone, MessageCircle,
  CheckCircle, Clock, Star, Shield, FileText, Pill, Calendar,
  ThumbsUp, ThumbsDown, Copy, Check, RotateCcw, User, Heart,
  Brain, Activity, Stethoscope, Sparkles, Mic, MicOff,
  ChevronDown, Download, Share2, MoreVertical, X, Bot,
  HeartPulse, UserRound, AlertCircle, Paperclip, Image as ImageIcon, Trash2, Volume2
} from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative" | null
  attachment?: {
    type: "image" | "file"
    name: string
    text?: string
  }
}

interface AIDoctor {
  id: string
  name: string
  specialization: string
  avatar: string
  color: string
  gradient: string
  description: string
  experience: string
  rating: number
  consultations: number
  systemPrompt: string
  gender: 'male' | 'female'
}

const aiDoctors: AIDoctor[] = [
  {
    id: "general",
    name: "Dr. Sarah Mitchell",
    specialization: "General Physician",
    avatar: "SM",
    color: "blue",
    gradient: "from-blue-600 to-cyan-500",
    description: "Primary care and general health concerns",
    experience: "15+ years",
    rating: 4.9,
    consultations: 12500,
    gender: 'female',
    systemPrompt: `You are Dr. Sarah Mitchell, a compassionate General Physician.

**CONSULTATION FLOW:**
1. Warm introduction
2. Collect: Age, Gender, Allergies/Chronic conditions
3. Ask 3-4 cross-questions about symptoms
4. Provide diagnosis and medicine recommendations

**MEDICINE FORMAT:**
💊 [Medicine Name] (Generic: [name])
   - 🌍 Brand names: US/UK/EU/Asia
   - 💊 Dosage: [dose]
   - ⏰ Duration: [duration]
   - ⚠️ Warnings: [side effects]

Always include: "⚠️ Consult your healthcare provider before starting any medication"`
  },
  {
    id: "cardiologist",
    name: "Dr. James Chen",
    specialization: "Cardiologist",
    avatar: "JC",
    color: "rose",
    gradient: "from-rose-600 to-red-500",
    description: "Heart and cardiovascular health",
    experience: "20+ years",
    rating: 5.0,
    consultations: 8900,
    gender: 'male',
    systemPrompt: `You are Dr. James Chen, Cardiologist with 20+ years experience.

**EXPERTISE:** Chest pain, palpitations, high BP, heart disease

**CONSULTATION:**
1. Professional introduction
2. Cardiac-specific questions
3. Risk assessment
4. Treatment recommendations

🚨 EMERGENCY: For crushing chest pain → "Call emergency services IMMEDIATELY"`
  },
  {
    id: "dermatologist",
    name: "Dr. Emily Rodriguez",
    specialization: "Dermatologist",
    avatar: "ER",
    color: "purple",
    gradient: "from-purple-600 to-pink-500",
    description: "Skin, hair, and nail conditions",
    experience: "12+ years",
    rating: 4.95,
    consultations: 15200,
    gender: 'female',
    systemPrompt: `You are Dr. Emily Rodriguez, Dermatologist.

**EXPERTISE:** Acne, rashes, eczema, hair loss, skin conditions

**CONSULTATION:**
1. Warm, friendly introduction
2. Dermatologic history
3. Treatment plan (topical/oral)
4. Skincare advice`
  },
  {
    id: "pediatrician",
    name: "Dr. Michael Thompson",
    specialization: "Pediatrician",
    avatar: "MT",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    description: "Child and infant healthcare",
    experience: "18+ years",
    rating: 4.98,
    consultations: 22000,
    gender: 'male',
    systemPrompt: `You are Dr. Michael Thompson, Pediatrician.

**EXPERTISE:** Childhood illnesses, fever, vaccination, growth

**CONSULTATION:**
1. Parent-friendly introduction
2. Child's age/weight (CRITICAL for dosing!)
3. Age-appropriate guidance
4. Pediatric medication dosing

🚨 INFANT EMERGENCY: <3 months with fever → Seek immediate care`
  },
  {
    id: "gynecologist",
    name: "Dr. Priya Sharma",
    specialization: "Gynecologist",
    avatar: "PS",
    color: "pink",
    gradient: "from-pink-600 to-rose-500",
    description: "Women's reproductive health",
    experience: "16+ years",
    rating: 4.97,
    consultations: 11000,
    gender: 'female',
    systemPrompt: `You are Dr. Priya Sharma, Gynecologist.

**EXPERTISE:** Menstrual disorders, PCOS, pregnancy, contraception

**CONSULTATION:**
1. Supportive, confidential introduction
2. Gynecologic history (sensitive)
3. Treatment recommendations
4. Lifestyle advice`
  },
  {
    id: "orthopedician",
    name: "Dr. Robert Williams",
    specialization: "Orthopedic Surgeon",
    avatar: "RW",
    color: "emerald",
    gradient: "from-emerald-600 to-teal-500",
    description: "Bones, joints, and muscles",
    experience: "22+ years",
    rating: 4.92,
    consultations: 9500,
    gender: 'male',
    systemPrompt: `You are Dr. Robert Williams, Orthopedic Surgeon.

**EXPERTISE:** Joint pain, fractures, sports injuries, back pain

**CONSULTATION:**
1. Professional introduction
2. Orthopedic history
3. RICE protocol advice
4. Rehabilitation guidance

🚨 EMERGENCY: Deformity/inability to bear weight → Seek immediate care`
  }
]

const symptomSpecialistMap: Record<string, string> = {
  "chest": "cardiologist", "heart": "cardiologist", "palpitation": "cardiologist",
  "blood pressure": "cardiologist", "cardiac": "cardiologist", "shortness of breath": "cardiologist",
  "skin": "dermatologist", "rash": "dermatologist", "acne": "dermatologist", "hair": "dermatologist",
  "child": "pediatrician", "baby": "pediatrician", "infant": "pediatrician", "fever": "pediatrician",
  "period": "gynecologist", "menstrual": "gynecologist", "pregnancy": "gynecologist", "pcos": "gynecologist",
  "bone": "orthopedician", "joint": "orthopedician", "fracture": "orthopedician", "back pain": "orthopedician",
}

function detectSpecialty(text: string): string {
  const lowerText = text.toLowerCase()
  for (const [keyword, specialty] of Object.entries(symptomSpecialistMap)) {
    if (lowerText.includes(keyword)) return specialty
  }
  return "general"
}

function getDoctorById(id: string): AIDoctor {
  return aiDoctors.find(d => d.id === id) || aiDoctors[0]
}

// Animation variants (same as chatbot)
const messageVariants = {
  hidden: (isUser: boolean) => ({
    opacity: 0,
    y: 40,
    scale: 0.92,
    rotateY: isUser ? 15 : -15,
    x: isUser ? 30 : -30,
  }),
  visible: (isUser: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 28,
      mass: 0.8,
      duration: 0.5,
    }
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: { duration: 0.2 }
  }
}

export default function AIDoctorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<AIDoctor | null>(null)
  const [showDoctorSelection, setShowDoctorSelection] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // Auto-connect if coming from chatbot/report
  useEffect(() => {
    const symptom = searchParams.get("symptom")
    const fromReport = searchParams.get("fromReport")
    
    if (symptom || fromReport) {
      const specialty = detectSpecialty(symptom || "")
      const doctor = getDoctorById(specialty)
      connectToDoctor(doctor, symptom || "Report analysis follow-up")
    }
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showDoctorSelection) {
      animate('.doctor-card', {
        opacity: [0, 1],
        scale: [0.95, 1],
        delay: stagger(80, { start: 100 }),
        duration: 400,
        ease: 'easeOutExpo'
      })
    }
  }, [showDoctorSelection])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileSelect = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB")
      return
    }
    setAttachedFile(file)
  }

  const removeAttachment = () => {
    setAttachedFile(null)
  }

  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      const { createWorker } = await import("tesseract.js")
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`)
          }
        }
      })

      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()
      return text
    } catch (error) {
      console.error("OCR Error:", error)
      throw new Error("Failed to extract text from image")
    }
  }

  // Initialize Speech Recognition and Voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Synthesis
      const synth = window.speechSynthesis
      setSpeechSynth(synth)

      // Load voices
      const loadVoices = () => {
        const availableVoices = synth.getVoices()
        setVoices(availableVoices)
        console.log('Available voices:', availableVoices.length)
      }

      loadVoices()
      
      // Voices load asynchronously in some browsers
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices
      }

      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput((prev) => prev + ' ' + transcript)
          setIsListening(false)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  const toggleSpeaking = (text: string) => {
    if (!speechSynth || !selectedDoctor) return

    if (isSpeaking) {
      speechSynth.cancel()
      setIsSpeaking(false)
    } else {
      // Clean markdown from text
      const cleanText = text.replace(/[*#`_\[\]]/g, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)
      
      // Select voice based on doctor's gender
      const isFemaleDoctor = selectedDoctor.gender === 'female'
      
      // Find appropriate voice
      let selectedVoice: SpeechSynthesisVoice | null = null
      
      if (isFemaleDoctor) {
        // Female voices: Higher pitch, look for female voice names
        selectedVoice = voices.find(v => 
          v.name.includes('Female') || 
          v.name.includes('Zira') || 
          v.name.includes('Google US English') ||
          v.name.includes('Samantha') ||
          v.name.includes('Ting-Ting') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Moira') // iOS female
        ) || voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') || null
      } else {
        // Male voices: Lower pitch, look for male voice names
        selectedVoice = voices.find(v => 
          v.name.includes('Male') || 
          v.name.includes('David') || 
          v.name.includes('Google US English') ||
          v.name.includes('Daniel') ||
          v.name.includes('Google UK English Male') ||
          v.name.includes('Fred') // iOS male
        ) || voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') || null
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      
      // Adjust pitch and rate for gender differentiation
      utterance.pitch = isFemaleDoctor ? 1.15 : 0.85
      utterance.rate = 0.92
      utterance.volume = 1
      utterance.lang = 'en-US'
      
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      speechSynth.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const connectToDoctor = (doctor: AIDoctor, initialSymptom?: string) => {
    setIsConnecting(true)
    setShowDoctorSelection(false)
    setSelectedDoctor(doctor)

    setTimeout(() => {
      setIsConnecting(false)
      
      const welcomeMessage: Message = {
        role: "assistant",
        content: `Hello! I'm **Dr. ${doctor.name.split(' ')[1]}**, ${doctor.specialization}. 

I understand you're not feeling well. I'm here to listen and help you today.

Before we begin, may I know:
1. Your age?
2. Your gender? (Male/Female/Other)
3. Any allergies or chronic conditions?

This helps me provide safer guidance for you.`,
        timestamp: new Date()
      }
      
      setMessages([welcomeMessage])

      if (initialSymptom) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: "user",
            content: initialSymptom,
            timestamp: new Date()
          }])
        }, 500)
      }
    }, 2000)
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() && !attachedFile) return

    let messageContent = content
    let attachmentData: { type: "image" | "file"; name: string } | undefined = undefined

    // Handle file attachment
    if (attachedFile) {
      messageContent += `\n[Attachment: ${attachedFile.name}]`
      attachmentData = {
        type: attachedFile.type.startsWith('image/') ? 'image' : 'file',
        name: attachedFile.name,
      }

      // If it's an image, extract text using OCR
      if (attachedFile.type.startsWith('image/')) {
        try {
          const extractedText = await extractTextFromImage(attachedFile)
          if (extractedText.trim()) {
            messageContent += `\n\n[Extracted Text from Image]:\n${extractedText}`
          }
        } catch (ocrError) {
          console.error("OCR failed:", ocrError)
        }
      }
    }

    const userMessage: Message = {
      role: "user",
      content: messageContent,
      timestamp: new Date(),
      attachment: attachmentData
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    removeAttachment()
    setIsLoading(true)

    try {
      const userEmail = session?.user?.email || "guest@example.com"
      const apiMessages = messages.map(m => ({ role: m.role, content: m.content }))
      apiMessages.push({ role: "user", content: messageContent })

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          user_id: userEmail
        })
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleFeedback = (index: number, feedback: "positive" | "negative") => {
    setMessages(prev => prev.map((msg, i) =>
      i === index ? { ...msg, feedback } : msg
    ))
  }

  // Doctor Selection Screen
  if (showDoctorSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/dashboard")}
              className="p-2 rounded-xl hover:bg-slate-100 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Doctor Consultation</h1>
              <p className="text-sm text-slate-500">Choose your specialist for instant consultation</p>
            </div>
          </div>
        </header>

        {/* Doctor Selection Grid */}
        <main className="max-w-7xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your AI Specialist</h2>
            <p className="text-slate-600">Our AI-powered doctors are ready to consult with you 24/7</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 60px -10px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => connectToDoctor(doctor)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && connectToDoctor(doctor)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden relative"
              >
                {/* Gradient orb decoration */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${doctor.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                {/* Doctor Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-lg">{doctor.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{doctor.name}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${doctor.gradient} bg-clip-text text-transparent`}>
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-slate-700">{doctor.rating}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{(doctor.consultations/1000).toFixed(1)}k consultations</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4">{doctor.description}</p>

                {/* Experience Badge */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.experience} experience</span>
                </div>

                {/* Action Button */}
                <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${doctor.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-2xl`}>
                  <MessageCircle className="w-5 h-5" />
                  Start Consultation
                </button>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid md:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, text: "HIPAA Compliant", color: "emerald" },
              { icon: Sparkles, text: "AI-Powered", color: "blue" },
              { icon: Clock, text: "Available 24/7", color: "purple" },
              { icon: FileText, text: "Instant Prescriptions", color: "amber" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                <div className={`w-12 h-12 rounded-xl bg-${badge.color}-50 flex items-center justify-center`}>
                  <badge.icon className={`w-6 h-6 text-${badge.color}-600`} />
                </div>
                <span className="font-semibold text-slate-700">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    )
  }

  // Consultation Interface (Premium Chatbot-style UI)
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowDoctorSelection(true)
              setSelectedDoctor(null)
              setMessages([])
            }}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </motion.button>

          {selectedDoctor && (
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedDoctor.gradient} flex items-center justify-center shadow-lg shadow-blue-500/30`}>
                <span className="text-white font-bold text-lg">{selectedDoctor.avatar}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900">{selectedDoctor.name}</h2>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700">Online</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{selectedDoctor.specialization} • {selectedDoctor.experience}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1]
                if (lastMessage.role === 'assistant') {
                  toggleSpeaking(lastMessage.content)
                }
              }
            }}
            className={`p-3 rounded-xl shadow-lg transition-all ${
              isSpeaking
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/40'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/40 hover:shadow-xl'
            }`}
            title={isSpeaking ? "Stop Speaking" : "Read Aloud Last Message"}
          >
            {isSpeaking ? (
              <Volume2 className="h-5 w-5 animate-pulse" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </header>

      {/* Connection Status */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center bg-white/50"
          >
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${selectedDoctor?.gradient} flex items-center justify-center shadow-2xl shadow-blue-500/40`}>
                  <Stethoscope className="h-12 w-12 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-blue-400"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Connecting to Dr. {selectedDoctor?.name.split(' ')[1]}...</h3>
              <p className="text-slate-600">Please wait while we establish a secure connection</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      {!isConnecting && (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => {
                  const isUser = message.role === "user"
                  return (
                    <motion.div
                      key={index}
                      custom={isUser}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-[2rem] overflow-hidden shadow-2xl relative ${
                          isUser
                            ? "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-blue-500/40"
                            : "bg-white border border-slate-200 shadow-slate-200/60"
                        }`}
                      >
                        {/* Decorative gradient orb for assistant messages */}
                        {!isUser && (
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
                        )}

                        {/* Assistant Header */}
                        {!isUser && (
                          <div className="flex items-center gap-2.5 px-5 pt-3.5 pb-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 backdrop-blur-sm relative z-10">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedDoctor?.gradient} flex items-center justify-center shadow-lg shadow-blue-500/40 ring-2 ring-white relative overflow-hidden group`}>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              />
                              <UserRound className="h-5 w-5 text-white relative z-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold bg-gradient-to-r ${selectedDoctor?.gradient} bg-clip-text text-transparent`}>
                                  {selectedDoctor?.name}
                                </span>
                                <motion.span
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                                />
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">{selectedDoctor?.specialization} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-[10px]">{message.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                        )}

                        {/* Message Content Container */}
                        <div className="p-5 relative z-10">
                          {/* Attachment Display */}
                          {message.attachment && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border border-blue-200/60 flex items-center gap-3.5 shadow-inner shadow-blue-100/50"
                            >
                              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center ring-1 ring-blue-100">
                                {message.attachment.type === 'image' ? (
                                  <ImageIcon className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <FileText className="h-6 w-6 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{message.attachment.name}</p>
                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                  <Activity className="h-3 w-3 text-blue-500" />
                                  {message.attachment.type === 'image' ? 'Medical Image' : 'Attached File'}
                                </p>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/30"
                              >
                                <CheckCircle className="h-5 w-5 text-white" />
                              </motion.div>
                            </motion.div>
                          )}

                          <div className={`text-sm leading-relaxed ${isUser ? "text-white/95" : "text-slate-700"}`}>
                            {!isUser ? (
                              <div className="prose prose-sm prose-slate max-w-none">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            )}
                          </div>
                        </div>

                        {/* Assistant Footer with Actions */}
                        {!isUser && (
                          <div className="flex items-center justify-between px-5 pb-3.5 pt-2.5 border-t border-slate-100 bg-gradient-to-r from-slate-50/50 via-slate-50/30 to-transparent relative z-10">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-400 font-medium">
                                {message.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleSpeaking(message.content)}
                                className={`p-2 rounded-xl transition-all ${
                                  isSpeaking
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40"
                                    : "hover:bg-white hover:shadow-md text-slate-400 hover:text-blue-600"
                                }`}
                                title="Read Aloud"
                              >
                                <Volume2 className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCopy(message.content, index)}
                                className={`p-2 rounded-xl transition-all ${
                                  copiedIndex === index
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40"
                                    : "hover:bg-white hover:shadow-md text-slate-400 hover:text-blue-600"
                                }`}
                                title="Copy to clipboard"
                              >
                                {copiedIndex === index ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleFeedback(index, "positive")}
                                className={`p-2 rounded-xl transition-all ${
                                  message.feedback === "positive"
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40"
                                    : "hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-600"
                                }`}
                                title="Helpful"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleFeedback(index, "negative")}
                                className={`p-2 rounded-xl transition-all ${
                                  message.feedback === "negative"
                                    ? "bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/40"
                                    : "hover:bg-white hover:shadow-md text-slate-400 hover:text-red-600"
                                }`}
                                title="Not helpful"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>
                        )}

                        {/* User Message Simple Footer */}
                        {isUser && (
                          <div className="px-5 pb-3">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-[10px] text-white/70 font-medium">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                              >
                                <User className="h-3 w-3 text-white/80" />
                              </motion.div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="flex justify-start mb-5"
                >
                  <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/60 max-w-[85%] md:max-w-[75%] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center gap-2.5 px-5 pt-3.5 pb-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 backdrop-blur-sm relative z-10">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedDoctor?.gradient} flex items-center justify-center shadow-lg shadow-blue-500/40 ring-2 ring-white`}>
                        <UserRound className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs font-bold bg-gradient-to-r ${selectedDoctor?.gradient} bg-clip-text text-transparent`}>
                          {selectedDoctor?.name}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">Typing...</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white/80 backdrop-blur-xl p-4">
            <div className="max-w-4xl mx-auto">
              {/* File Preview */}
              {attachedFile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mb-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border border-blue-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
                    {attachedFile.type.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{attachedFile.name}</p>
                    <p className="text-xs text-slate-500">{(attachedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removeAttachment}
                    className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </motion.button>
                </motion.div>
              )}

              <div className="flex items-end gap-3">
                <div className="flex-1 relative flex items-end gap-2">
                  {/* Attachment Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5 text-slate-600" />
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                  />

                  {/* Voice Input Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleListening}
                    className={`p-4 rounded-2xl transition-all ${
                      isListening
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/40 animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title={isListening ? "Stop Listening" : "Voice Input"}
                  >
                    {isListening ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </motion.button>

                  {/* Text Input */}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage(input)
                      }
                    }}
                    placeholder={`Describe your symptoms to Dr. ${selectedDoctor?.name.split(' ')[1]}...`}
                    className="flex-1 px-4 py-3 pr-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-white"
                    rows={1}
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${selectedDoctor?.gradient} text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This is an AI consultation. Always consult a healthcare professional before starting any medication.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
