"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import { motion, AnimatePresence } from "framer-motion"
import { animate, stagger } from "animejs"
import Logo from "@/components/Logo"
import ReactMarkdown from "react-markdown"
import {
  Send, Loader2, Bot, ArrowLeft,
  ThumbsUp, ThumbsDown, Copy, Check, RotateCcw,
  Paperclip, FileText, Image as ImageIcon, Trash2, Shield, Sparkles, MessageCircle, Zap, Plus,
  Stethoscope, Activity, AlertCircle, CheckCircle2, Clock, User, Star, Heart, TrendingUp,
  UserRound, HeartPulse
} from "lucide-react"

// Extend NextAuth Session type to include user.id
interface ExtendedSession extends Session {
  user: Session["user"] & {
    id: string
  }
}

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
  isAnalysis?: boolean
}

// Medical Report Analysis Card Component
function AnalysisCard({ content, onConsult }: { content: string; onConsult?: () => void }) {
  const lines = content.split('\n')
  
  // Extract different sections
  const analysisText = lines.find(l => l.toLowerCase().includes('**analysis:**'))?.replace(/\*\*Analysis:\*\*/i, '').trim() || ''
  
  // Find abnormalities section
  const abnormalityIndex = lines.findIndex(l => l.includes('**Abnormal Findings:**') || l.includes('**Abnormalities:**'))
  const medicineIndex = lines.findIndex(l => l.includes('💊') || l.toLowerCase().includes('medicine'))
  const recommendationIndex = lines.findIndex(l => l.includes('**Recommendations:**'))
  
  // Extract abnormalities (lines with • after abnormality header)
  const abnormalities = lines.filter((l, idx) => 
    idx > abnormalityIndex && 
    l.startsWith('•') && 
    (medicineIndex === -1 || idx < medicineIndex)
  )
  
  // Extract medicine lines (lines with 💊 emoji or medicine-related keywords)
  const medicineLines = lines.filter(l => 
    l.includes('💊') || 
    (l.includes('**For') && l.includes(')**')) ||
    l.includes('🌍 Available as:') ||
    l.includes('💊 Typical dosage:') ||
    l.includes('⏰ Usually taken for:') ||
    l.includes('⚠️ **Important**:')
  )
  
  // Extract recommendations
  const recommendations = lines.filter((l, idx) => 
    idx > recommendationIndex && 
    l.startsWith('•') &&
    !l.includes('💊')
  )

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-2xl p-5 border border-blue-200 shadow-lg shadow-blue-100/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Medical Report Analysis</h3>
          <p className="text-xs text-slate-500">AI-Powered Insights</p>
        </div>
      </div>

      {/* Analysis */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">Analysis</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed bg-white/70 rounded-lg p-3 border border-blue-100">
          {analysisText || content}
        </p>
      </div>

      {/* Abnormalities */}
      {abnormalities.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-slate-700">Key Findings</span>
          </div>
          <div className="space-y-1.5">
            {abnormalities.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-900"
              >
                <span className="text-amber-600 mt-0.5">⚠️</span>
                <span className="flex-1">{item.replace('•', '').trim()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Medicine Recommendations */}
      {medicineLines.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">Commonly Prescribed Medications</span>
          </div>
          <div className="space-y-3">
            {medicineLines.map((med, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3"
              >
                <div className="text-xs text-slate-700 leading-relaxed">
                  {med.replace('💊', '').trim()}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <span>
                <strong>⚠️ Important:</strong> These are commonly prescribed medications for your condition. 
                Your doctor will determine the right medication and dosage based on your complete medical history, 
                allergies, and other factors. <strong>Do not start any medication without consulting a healthcare professional.</strong>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Recommendations</span>
          </div>
          <div className="space-y-1.5">
            {recommendations.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-900"
              >
                <span className="text-emerald-600 mt-0.5">✓</span>
                <span className="flex-1">{item.replace('•', '').trim()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-blue-100">
        <p className="text-xs text-slate-500 italic flex items-center gap-1.5 mb-3">
          <Shield className="h-3 w-3 text-emerald-600" />
          For informational purposes only. Always consult a qualified healthcare professional for diagnosis and treatment.
        </p>
        
        {/* Consult AI Doctor Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onConsult}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <UserRound className="h-5 w-5" />
          Consult AI Doctor About This Report
        </motion.button>
      </div>
    </div>
  )
}

// Connect to AI Doctor Card Component
function ConnectToDoctorCard({ symptom, reportData }: { symptom?: string; reportData?: any }) {
  const router = useRouter()

  const detectSpecialty = (text: string): string => {
    const lowerText = text.toLowerCase()
    const symptomMap: Record<string, string> = {
      "chest": "cardiologist", "heart": "cardiologist", "palpitation": "cardiologist",
      "blood pressure": "cardiologist", "cardiac": "cardiologist", "shortness of breath": "cardiologist",
      "skin": "dermatologist", "rash": "dermatologist", "acne": "dermatologist", "hair": "dermatologist",
      "child": "pediatrician", "baby": "pediatrician", "infant": "pediatrician", "fever": "pediatrician",
      "period": "gynecologist", "menstrual": "gynecologist", "pregnancy": "gynecologist", "pcos": "gynecologist",
      "bone": "orthopedician", "joint": "orthopedician", "fracture": "orthopedician", "back pain": "orthopedician",
    }
    for (const [keyword, specialty] of Object.entries(symptomMap)) {
      if (lowerText.includes(keyword)) return specialty
    }
    return "general"
  }

  const specialty = detectSpecialty(symptom || reportData?.analysis || "")
  
  const doctorInfo: Record<string, { name: string; avatar: string; gradient: string }> = {
    general: { name: "Dr. Sarah Mitchell", avatar: "SM", gradient: "from-blue-600 to-cyan-500" },
    cardiologist: { name: "Dr. James Chen", avatar: "JC", gradient: "from-rose-600 to-red-500" },
    dermatologist: { name: "Dr. Emily Rodriguez", avatar: "ER", gradient: "from-purple-600 to-pink-500" },
    pediatrician: { name: "Dr. Michael Thompson", avatar: "MT", gradient: "from-amber-500 to-orange-500" },
    gynecologist: { name: "Dr. Priya Sharma", avatar: "PS", gradient: "from-pink-600 to-rose-500" },
    orthopedician: { name: "Dr. Robert Williams", avatar: "RW", gradient: "from-emerald-600 to-teal-500" },
  }

  const doctor = doctorInfo[specialty] || doctorInfo.general

  const handleConnect = () => {
    const params = new URLSearchParams()
    if (symptom) params.set("symptom", symptom)
    if (reportData) params.set("fromReport", "true")
    router.push(`/ai-doctors?${params.toString()}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-2xl p-5 border-2 border-blue-300 shadow-xl shadow-blue-100/50"
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0`}>
          <span className="text-white font-bold text-lg">{doctor.avatar}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Connect with AI Specialist</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Based on your symptoms, I recommend consulting <strong className="text-slate-900">{doctor.name}</strong>, 
            a {specialty === "general" ? "General Physician" : specialty.replace(/([a-z])([A-Z])/g, '$1 $2')}. 
            They can provide personalized diagnosis and prescription.
          </p>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${doctor.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
            >
              <UserRound className="h-4 w-4" />
              Consult {doctor.name.split(' ')[1]}
            </motion.button>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Available now
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const quickSuggestions = [
  { icon: Zap, text: "I have a fever and headache", color: "blue" },
  { icon: Sparkles, text: "Health tips for better immunity", color: "purple" },
  { icon: MessageCircle, text: "When should I see a doctor?", color: "emerald" },
  { icon: Shield, text: "I'm feeling stressed and anxious", color: "amber" },
]

// Advanced animation variants
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

const floatingAnimation = {
  y: [-3, 3, -3],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const pulseGlow = {
  boxShadow: [
    "0 0 0 0 rgba(59, 130, 246, 0.4)",
    "0 0 20px 10px rgba(59, 130, 246, 0)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export default function ChatbotPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)

  useEffect(() => {
    animate('.suggestion-card', {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(80, { start: 100 }),
      duration: 500,
      ease: 'easeOutExpo'
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const sendMessage = async (content: string) => {
    if (!content.trim() && !attachedFile) return

    const userMessage: Message = {
      role: "user",
      content: content + (attachedFile ? `\n[Attachment: ${attachedFile.name}]` : ""),
      timestamp: new Date(),
      attachment: attachedFile ? {
        type: attachedFile.type.startsWith('image/') ? 'image' : 'file',
        name: attachedFile.name,
      } : undefined
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    removeAttachment()
    setIsLoading(true)

    try {
      // Get user from session
      const userEmail = session?.user?.email || "guest@example.com"
      const userId = (session as ExtendedSession)?.user?.id || userEmail

      // Check if user uploaded a medical report image
      let assistantContent = ""
      
      if (attachedFile && attachedFile.type.startsWith('image/')) {
        // First, extract text from image using OCR
        let extractedText = ""
        try {
          extractedText = await extractTextFromImage(attachedFile)
        } catch (ocrError) {
          console.error("OCR failed:", ocrError)
          assistantContent = "I'm having trouble reading the uploaded image. This could be due to:\n\n• Poor image quality or low resolution\n• Blurry or unclear text\n• Insufficient lighting\n\nPlease try uploading a clearer image of the medical report."
        }
        
        if (extractedText.trim()) {
          // Analyze the medical report
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          try {
            const analysisResponse = await fetch(`${apiUrl}/api/analyze-report`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                report_text: extractedText,
                report_type: "blood_test", // Default, can be auto-detected or user selected
                user_id: userId,
              }),
            })

            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json()
              
              // Format a comprehensive response
              assistantContent = `📋 **Medical Report Analysis**\n\n`
              assistantContent += `**Analysis:**\n${analysisData.analysis}\n\n`
              
              if (analysisData.abnormalities && analysisData.abnormalities.length > 0) {
                assistantContent += `⚠️ **Abnormal Findings:**\n`
                analysisData.abnormalities.forEach((item: string) => {
                  assistantContent += `• ${item}\n`
                })
                assistantContent += `\n`
              }
              
              if (analysisData.recommendations && analysisData.recommendations.length > 0) {
                assistantContent += `💡 **Recommendations:**\n`
                analysisData.recommendations.forEach((item: string) => {
                  assistantContent += `• ${item}\n`
                })
                assistantContent += `\n`
              }
              
              if (analysisData.suggested_specialists && analysisData.suggested_specialists.length > 0) {
                assistantContent += `👨‍⚕️ **Suggested Specialists:** ${analysisData.suggested_specialists.join(", ")}\n\n`
              }
              
              if (analysisData.urgency_level) {
                const urgencyEmoji: Record<string, string> = {
                  low: "✅",
                  medium: "⚠️",
                  high: "🔴",
                  critical: "🚨"
                }
                assistantContent += `**Urgency Level:** ${urgencyEmoji[analysisData.urgency_level] || "⚪"} ${analysisData.urgency_level.toUpperCase()}\n`
              }
              
              assistantContent += `\n*Note: This analysis is for informational purposes only. Please consult a healthcare professional for proper diagnosis and treatment.*`
            } else {
              const errorData = await analysisResponse.json().catch(() => ({}))
              console.error("Analysis API error:", errorData)
              assistantContent = `I was able to read your report, but encountered an error while analyzing it: ${errorData.detail || "Please try again or upload a clearer image."}`
            }
          } catch (analysisError) {
            console.error("Analysis failed:", analysisError)
            assistantContent = "I encountered an error while analyzing your report. Please make sure the backend server is running and try again."
          }
        }
      } else {
        // Regular chat conversation
        assistantContent = await callChatAPI(messages, content, userId)
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "I apologize, but I'm experiencing technical difficulties. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to extract text from image using OCR
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
      console.log("Extracted text:", text.substring(0, 200) + "...")
      return text
    } catch (error) {
      console.error("OCR Error:", error)
      throw new Error("Failed to extract text from image. Please ensure the image is clear.")
    }
  }

  // Helper function to call chat API
  const callChatAPI = async (prevMessages: Message[], newMessage: string, userId: string): Promise<string> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...prevMessages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: newMessage }
        ],
        user_id: userId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.message || "I apologize, but I'm having trouble processing your request. Please try again."
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleFeedback = (index: number, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg, i) =>
      i === index ? { ...msg, feedback } : msg
    ))
  }

  const clearChat = () => {
    setMessages([])
  }

  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-cyan-500 bg-blue-50 text-blue-600",
    purple: "from-purple-500 to-pink-500 bg-purple-50 text-purple-600",
    emerald: "from-emerald-500 to-teal-500 bg-emerald-50 text-emerald-600",
    amber: "from-amber-500 to-orange-500 bg-amber-50 text-amber-600",
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </motion.button>
          <div className="flex items-center gap-3">
            <Logo
              iconContainerClassName="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20"
              textClassName="text-lg text-slate-900"
            />
            <div className="flex items-center gap-2 ml-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-xs text-slate-500 font-medium tracking-wide">ASSISTANT ONLINE</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearChat}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          title="Clear chat"
        >
          <RotateCcw className="h-5 w-5" />
        </motion.button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Animated Bot Icon with Glow Effect */}
              <div className="relative inline-flex mb-8">
                {/* Outer glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                
                {/* Main icon container */}
                <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <Bot className="h-14 w-14 text-white" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                </div>
                
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full"
                    style={{
                      top: `${50 + 60 * Math.sin((i / 6) * Math.PI)}%`,
                      left: `${50 + 60 * Math.cos((i / 6) * Math.PI)}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                How can I help you today?
              </h2>
              <p className="text-slate-600 mb-10 max-w-lg mx-auto text-base leading-relaxed">
                I'm your AI medical assistant. Ask me anything about your health, upload medical reports for analysis, or get medicine recommendations.
              </p>

              {/* Quick Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-2xl mx-auto mb-12">
                {quickSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.03, y: -3, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(suggestion.text)}
                    className="suggestion-card bg-white p-4.5 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all text-left group shadow-sm hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClasses[suggestion.color].split(' ').slice(1, 3).join(' ')} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                        <suggestion.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{suggestion.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center gap-8 text-xs text-slate-500"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center ring-1 ring-emerald-200">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center ring-1 ring-blue-200">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium">AI Powered</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center ring-1 ring-purple-200">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium">24/7 Support</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Messages */}
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
                    className={`max-w-[85%] md:max-w-[75%] rounded-[2rem] overflow-hidden shadow-2xl relative ${isUser
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
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40 ring-2 ring-white relative overflow-hidden group">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                          <Bot className="h-5 w-5 text-white relative z-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">MediCare AI</span>
                            <motion.span
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">Medical Assistant • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-[10px]">{message.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    )}

                    {/* Message Content Container */}
                    <div className="p-5 relative z-10">
                      {/* Attachment */}
                      {message.attachment && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95, rotateX: -15 }}
                          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border border-blue-200/60 flex items-center gap-3.5 shadow-inner shadow-blue-100/50 relative overflow-hidden group"
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          
                          <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center ring-1 ring-blue-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {message.attachment.type === 'image' ? (
                              <ImageIcon className="h-6 w-6 text-blue-600 relative z-10" />
                            ) : (
                              <FileText className="h-6 w-6 text-blue-600 relative z-10" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{message.attachment.name}</p>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                              <Activity className="h-3 w-3 text-blue-500" />
                              Medical Document
                            </p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 12 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/30"
                          >
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Analysis Card or Regular Text */}
                      {message.isAnalysis || message.content.includes('📋 **Medical Report Analysis**') ? (
                        <AnalysisCard content={message.content} onConsult={() => router.push("/ai-doctors?fromReport=true")} />
                      ) : (
                        <div className={`text-sm leading-relaxed ${isUser ? "text-white/95" : "text-slate-700"}`}>
                          {!isUser ? (
                            <div className="prose prose-sm prose-slate max-w-none">
                              <ReactMarkdown
                                components={{
                                  strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />,
                                  p: ({node, ...props}) => <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2.5 space-y-1" {...props} />,
                                  li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      )}
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
                            onClick={() => handleCopy(message.content, index)}
                            className={`p-2 rounded-xl transition-all ${copiedIndex === index
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
                            className={`p-2 rounded-xl transition-all ${message.feedback === "positive"
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
                            className={`p-2 rounded-xl transition-all ${message.feedback === "negative"
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

                    {/* Connect to AI Doctor - Show after assistant messages */}
                    {!isUser && !message.isAnalysis && !message.content.includes('Medical Report Analysis') && (
                      <div className="px-5 pb-4">
                        <ConnectToDoctorCard symptom={message.content} />
                      </div>
                    )}
                  </div>

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
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center gap-2.5 px-5 pt-3.5 pb-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 backdrop-blur-sm relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40 ring-2 ring-white relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <Bot className="h-5 w-5 text-white relative z-10" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">MediCare AI</span>
                    <p className="text-[10px] text-slate-400 font-medium">Medical Assistant</p>
                  </div>
                </div>
                
                {/* Typing Animation */}
                <div className="p-5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3.5 h-3.5 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-500/40 relative overflow-hidden"
                          animate={{
                            y: [-8, 8, -8],
                            scale: [0.5, 1.4, 0.5],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-semibold">Analyzing your message</span>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4 text-blue-500" />
                        </motion.div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">This may take a moment...</p>
                    </div>
                  </div>
                  
                  {/* Animated Progress Bar with Glow */}
                  <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50 relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-full relative overflow-hidden"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      {/* Glow effect */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm" />
                    </motion.div>
                  </div>
                  
                  {/* Status Indicator with Pulse */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 flex items-center gap-2.5 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-500/40"
                    />
                    <span className="font-medium">AI is processing your request</span>
                    <Heart className="h-3.5 w-3.5 text-red-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Attached File Preview */}
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border border-blue-200 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                  {attachedFile.type.startsWith('image/') ? (
                    <ImageIcon className="h-6 w-6 text-blue-600" />
                  ) : (
                    <FileText className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{attachedFile.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {(attachedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeAttachment}
                className="p-2 rounded-lg hover:bg-red-100 transition-all text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Input Bar */}
          <div className="flex gap-3 items-end bg-white p-2 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="h-11 w-11 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all disabled:opacity-50 flex items-center justify-center group"
              title="Attach file or image"
            >
              <Paperclip className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </motion.button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              accept="image/*,.pdf,.txt,.doc,.docx"
              disabled={isLoading}
            />

            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={attachedFile ? "Add a message (optional)..." : "Describe your symptoms or ask a health question..."}
                className="w-full px-4 py-3 bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={isLoading || (!input.trim() && !attachedFile)}
              className="h-11 w-11 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center relative overflow-hidden"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 hover:opacity-100 transition-opacity" />
                  <Send className="h-5 w-5 relative z-10" />
                </>
              )}
            </motion.button>
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI-powered medical insights • HIPAA compliant</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
