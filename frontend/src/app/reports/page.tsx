"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createWorker } from "tesseract.js"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Logo from "@/components/Logo"
import {
  Upload, FileText, Loader2, X, FlaskConical, FileUp, Shield, Clock,
  CheckCircle, AlertCircle, ArrowLeft, Download, RotateCcw, ChevronRight, ChevronDown
} from "lucide-react"

interface ReportAnalysis {
  analysis: string
  abnormalities: string[]
  recommendations: string[]
  suggested_specialists: string[]
  urgency_level: string
}

const reportTypes = [
  { value: "blood_test", label: "Blood Test", icon: "🩸" },
  { value: "urine_test", label: "Urine Test", icon: "💧" },
  { value: "x_ray", label: "X-Ray", icon: "📷" },
  { value: "mri", label: "MRI Scan", icon: "🧠" },
  { value: "ct_scan", label: "CT Scan", icon: "⚡" },
  { value: "ultrasound", label: "Ultrasound", icon: "🔊" },
  { value: "ecg", label: "ECG", icon: "💓" },
  { value: "other", label: "Other", icon: "📄" }
]

const extractTextFromImage = async (file: File): Promise<string> => {
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
}

export default function ReportsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [reportType, setReportType] = useState("blood_test")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [error, setError] = useState("")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    analysis: false,
    abnormalities: false,
    recommendations: false,
    extracted: false,
  })

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB")
      return
    }
    setFile(selectedFile)
    setError("")
  }

  const analyzeReport = async () => {
    if (!file) {
      setError("Please upload a file")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      // Extract text from image if it's an image file
      let reportText = ""
      const isImage = file.type.startsWith('image/')
      const isPDF = file.type === 'application/pdf'

      if (isImage) {
        setIsExtracting(true)
        setError("Extracting text from image...")
        reportText = await extractTextFromImage(file)
        setExtractedText(reportText)
        setIsExtracting(false)

        if (!reportText.trim()) {
          setError("Could not extract text from image. Please upload a clearer image or a text-based report.")
          setIsAnalyzing(false)
          return
        }
      } else if (isPDF) {
        setError("PDF text extraction coming soon. Please upload an image (JPG/PNG) instead.")
        setIsAnalyzing(false)
        return
      } else {
        // For text files, read directly
        reportText = await file.text()
      }

      setError("Analyzing report with AI...")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_text: reportText,
          report_type: reportType,
          user_id: "demo-user",
          file_name: file.name,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to analyze report")
      }

      const data = await response.json()

      // Validate response data
      if (!data.analysis || data.analysis.trim().length < 10) {
        throw new Error("Invalid analysis received. Please try again.")
      }

      setAnalysis({
        analysis: data.analysis,
        abnormalities: Array.isArray(data.abnormalities) ? data.abnormalities : [],
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
        suggested_specialists: Array.isArray(data.suggested_specialists) ? data.suggested_specialists : [],
        urgency_level: data.urgency_level || "medium",
      })
      setError("")
    } catch (error: any) {
      console.error("Analysis error:", error)
      setError(error.message || "Failed to analyze. Please try again.")
      setAnalysis(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setAnalysis(null)
    setExtractedText("")
    setError("")
  }

  const downloadAnalysis = () => {
    if (!analysis) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Colors - Professional Medical Theme
    const colors: Record<string, [number, number, number]> = {
      primary: [13, 71, 161],      // Deep Blue
      secondary: [0, 188, 212],    // Cyan
      accent: [25, 118, 210],      // Light Blue
      success: [22, 163, 74],      // Green
      warning: [245, 158, 11],     // Amber
      danger: [220, 38, 38],       // Red
      critical: [159, 18, 57],     // Deep Red
      text: [31, 41, 55],          // Slate
      muted: [107, 114, 128],      // Gray
    }

    // Helper to add page with header
    const addPageWithHeader = (pageNumber: number, totalPages: number) => {
      if (pageNumber > 1) {
        doc.addPage()
        return 30
      }
      return 30
    }

    let yPos = 20

    // ========== HEADER WITH LOGO ==========
    // Blue header bar (gradient-like effect using primary color)
    doc.setFillColor(...colors.primary)
    doc.roundedRect(0, 0, pageWidth, 35, 0, 0, 'F')

    // Decorative line (cyan accent like Logo.tsx gradient)
    doc.setDrawColor(...colors.secondary)
    doc.setLineWidth(2)
    doc.line(0, 33, pageWidth, 33)

    // Logo Icon Container (rounded blue box like Logo.tsx)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(12, 8, 28, 20, 3, 3, 'F')
    
    // Stethoscope Icon (using Unicode character)
    doc.setFontSize(16)
    doc.text('🩺', 19, 21)

    // Company Name - MediCare AI
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.text('MediCare', 48, 20)
    
    // "AI" in cyan to match Logo.tsx gradient effect
    doc.setTextColor(...colors.secondary)
    doc.text('AI', 108, 20)

    // Tagline
    doc.setFont('helvetica', 'light')
    doc.setFontSize(8)
    doc.setTextColor(200, 200, 200)
    doc.text('Professional Healthcare Intelligence', 48, 26)

    // Report Type Badge
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    const reportTypeDisplay = reportType.replace(/_/g, ' ').toUpperCase()
    const badgeWidth = doc.getTextWidth(reportTypeDisplay) + 10
    doc.setFillColor(...colors.secondary)
    doc.roundedRect(pageWidth - badgeWidth - 15, 14, badgeWidth, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(reportTypeDisplay, pageWidth - badgeWidth - 10, 21)

    // Report Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.text('MEDICAL REPORT ANALYSIS', pageWidth / 2, 30, { align: 'center' })

    yPos = 45

    // ========== PATIENT & REPORT INFO ==========
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...colors.primary)
    doc.text('Report Information', 20, yPos)

    yPos += 10

    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Info grid
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...colors.text)

    const infoData = [
      ['Report Date:', currentDate],
      ['File Name:', file?.name || 'Not specified'],
      ['Report Type:', reportTypeDisplay],
    ]

    infoData.forEach(([label, value], index) => {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...colors.muted)
      doc.text(label, 20, yPos + (index * 8))
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...colors.text)
      doc.text(value, 55, yPos + (index * 8))
    })

    yPos += (infoData.length * 8) + 5

    // Urgency Level Badge
    const urgencyDisplay = analysis.urgency_level.toUpperCase()
    const urgencyColorMap: Record<string, [number, number, number]> = {
      NORMAL: colors.success,
      LOW: colors.success,
      MEDIUM: colors.warning,
      HIGH: colors.danger,
      CRITICAL: colors.critical,
    }
    const urgencyColor = urgencyColorMap[urgencyDisplay] || colors.primary

    doc.setFillColor(...urgencyColor)
    doc.roundedRect(20, yPos, 45, 10, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(`URGENCY: ${urgencyDisplay}`, 42.5, yPos + 6.5, { align: 'center' })

    yPos += 20

    // ========== EXECUTIVE SUMMARY ==========
    doc.setFillColor(240, 248, 255)
    doc.roundedRect(20, yPos, pageWidth - 40, 8, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...colors.primary)
    doc.text('📋 Executive Summary', 25, yPos + 5.5)

    yPos += 12

    // Generate summary based on data
    const summaryPoints = []

    if (analysis.abnormalities.length > 0) {
      summaryPoints.push(`• ${analysis.abnormalities.length} abnormal finding(s) detected`)
    } else {
      summaryPoints.push('• No significant abnormalities detected')
    }

    if (analysis.recommendations.length > 0) {
      summaryPoints.push(`• ${analysis.recommendations.length} recommendation(s) provided`)
    }

    if (analysis.suggested_specialists.length > 0) {
      summaryPoints.push(`• ${analysis.suggested_specialists.length} specialist(s) recommended`)
    }

    summaryPoints.push(`• Urgency Level: ${urgencyDisplay}`)
    summaryPoints.push(`• Report analyzed on ${currentDate}`)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...colors.text)
    summaryPoints.forEach((point) => {
      const lines = doc.splitTextToSize(point, pageWidth - 50)
      doc.text(lines, 25, yPos)
      yPos += (lines.length * 5) + 2
    })

    yPos += 5

    // ========== EXTRACTED TEXT (if available) ==========
    if (extractedText) {
      if (yPos > 220) {
        doc.addPage()
        yPos = 30
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...colors.primary)
      doc.text('📄 Extracted Text from Image', 20, yPos)

      yPos += 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...colors.muted)

      const extractedLines = doc.splitTextToSize(extractedText, pageWidth - 45)
      const boxHeight = Math.min(extractedLines.length * 4 + 10, 80)

      doc.setFillColor(250, 250, 250)
      doc.roundedRect(20, yPos - 5, pageWidth - 40, boxHeight, 3, 3, 'F')
      doc.text(extractedLines.slice(0, 15), 25, yPos) // Limit to 15 lines

      if (extractedLines.length > 15) {
        doc.setFont('helvetica', 'italic')
        doc.text('(...)', pageWidth - 30, yPos + (15 * 4))
      }

      yPos += boxHeight + 10
    }

    // ========== DETAILED ANALYSIS ==========
    if (yPos > 200) {
      doc.addPage()
      yPos = 30
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...colors.primary)
    doc.text('🔬 Detailed Analysis', 20, yPos)

    yPos += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...colors.text)

    const analysisLines = doc.splitTextToSize(analysis.analysis, pageWidth - 45)
    doc.text(analysisLines, 20, yPos)
    yPos += (analysisLines.length * 5) + 15

    // ========== FINDINGS / ABNORMALITIES ==========
    if (analysis.abnormalities.length > 0) {
      if (yPos > 200) {
        doc.addPage()
        yPos = 30
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...colors.danger)
      doc.text('⚠️ Findings / Abnormalities', 20, yPos)

      yPos += 8

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Finding']],
        body: analysis.abnormalities.map((item, i) => [i + 1, item]),
        theme: 'plain',
        headStyles: {
          fillColor: colors.danger,
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 'auto' }
        },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        margin: { left: 20, right: 20 },
        rowPageBreak: 'auto',
      })

      yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // ========== RECOMMENDATIONS ==========
    if (analysis.recommendations.length > 0) {
      if (yPos > 200) {
        doc.addPage()
        yPos = 30
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...colors.success)
      doc.text('✅ Recommendations', 20, yPos)

      yPos += 8

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Recommendation']],
        body: analysis.recommendations.map((item, i) => [i + 1, item]),
        theme: 'plain',
        headStyles: {
          fillColor: colors.success,
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 'auto' }
        },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 20, right: 20 },
        rowPageBreak: 'auto',
      })

      yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // ========== SUGGESTED SPECIALISTS ==========
    if (analysis.suggested_specialists.length > 0) {
      if (yPos > 200) {
        doc.addPage()
        yPos = 30
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...colors.accent)
      doc.text('👨‍⚕️ Suggested Specialists', 20, yPos)

      yPos += 8

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Specialist']],
        body: analysis.suggested_specialists.map((item, i) => [i + 1, item]),
        theme: 'plain',
        headStyles: {
          fillColor: colors.accent,
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 'auto' }
        },
        alternateRowStyles: { fillColor: [236, 242, 255] },
        margin: { left: 20, right: 20 },
        rowPageBreak: 'auto',
      })

      yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // ========== IMPORTANT DISCLAIMER ==========
    if (yPos > 230) {
      doc.addPage()
      yPos = 30
    }

    doc.setFillColor(255, 243, 205)
    doc.roundedRect(20, yPos, pageWidth - 40, 25, 3, 3, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.warning)
    doc.text('⚠️ IMPORTANT MEDICAL DISCLAIMER', pageWidth / 2, yPos + 8, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...colors.text)

    const disclaimerText = [
      'This report analysis is generated by AI and is for informational purposes only.',
      'It is NOT a substitute for professional medical advice, diagnosis, or treatment.',
      'Always seek the advice of your physician or qualified health provider with any questions.',
      'In case of emergency, call your local emergency number immediately.'
    ]

    disclaimerText.forEach((line, i) => {
      doc.text(line, pageWidth / 2, yPos + 14 + (i * 4), { align: 'center' })
    })

    // ========== FOOTER ON ALL PAGES ==========
    const pageCount = (doc.internal as any).getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)

      // Footer background
      doc.setFillColor(245, 245, 245)
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')

      // Footer line
      doc.setDrawColor(...colors.primary)
      doc.setLineWidth(0.5)
      doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15)

      // Footer text
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7)
      doc.setTextColor(...colors.muted)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 8)
      doc.text('Generated by MediCare AI', 20, pageHeight - 8)
      doc.text('www.medicareai.com', pageWidth / 2, pageHeight - 8, { align: 'center' })
    }

    // Save PDF
    const fileName = `medicare-report-${file?.name.split('.')[0] || 'analysis'}-${Date.now()}.pdf`
    doc.save(fileName)
  }

  const urgencyConfig: Record<string, { color: string; bg: string; label: string; percentage: number }> = {
    normal: { color: "text-emerald-600", bg: "bg-emerald-500", label: "Normal", percentage: 20 },
    low: { color: "text-blue-600", bg: "bg-blue-500", label: "Low", percentage: 40 },
    medium: { color: "text-amber-600", bg: "bg-amber-500", label: "Medium", percentage: 60 },
    high: { color: "text-orange-600", bg: "bg-orange-500", label: "High", percentage: 80 },
    critical: { color: "text-rose-600", bg: "bg-rose-500", label: "Critical", percentage: 100 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-4">
              <Logo
                iconContainerClassName="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20"
                textClassName="text-lg text-slate-900"
              />
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-slate-900 text-sm">Report Analysis</h1>
                <p className="text-xs text-slate-500">AI Diagnostics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!analysis ? (
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="p-8 rounded-3xl border-2 border-slate-200 bg-white shadow-xl shadow-slate-200/50">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 mb-4">
                  <Upload className="h-7 w-7 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Medical Report</h2>
                <p className="text-slate-600">Get instant AI-powered analysis of your medical reports</p>
              </div>

              {/* File Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                {!file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                      <FileUp className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-700 mb-1">Click to upload or drag & drop</p>
                    <p className="text-sm text-slate-500">PDF, JPG, PNG • Max 10MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <X className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Report Type Selection */}
              <div className="mt-8">
                <label className="text-sm font-semibold text-slate-700 mb-4 block">Select Report Type</label>
                <div className="grid grid-cols-4 gap-3">
                  {reportTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setReportType(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${reportType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-xs font-semibold text-center text-slate-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeReport}
                disabled={isAnalyzing || isExtracting || !file}
                className="w-full h-14 mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Extracting Text from Image...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Report...
                  </>
                ) : (
                  <>
                    <FlaskConical className="h-5 w-5" />
                    Analyze Report
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="p-8 rounded-3xl border-2 border-slate-200 bg-white shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${urgencyConfig[analysis.urgency_level]?.bg} flex items-center justify-center shadow-lg`}>
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${urgencyConfig[analysis.urgency_level]?.bg}`}>
                        {urgencyConfig[analysis.urgency_level]?.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={resetAnalysis} className="p-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors" title="New Analysis">
                    <RotateCcw className="h-5 w-5 text-slate-600" />
                  </button>
                  <button onClick={downloadAnalysis} className="p-3 rounded-xl border-2 border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors" title="Download Analysis">
                    <Download className="h-5 w-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Urgency Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">Severity Assessment</span>
                  <span className={`text-xs font-semibold ${urgencyConfig[analysis.urgency_level]?.color}`}>
                    {urgencyConfig[analysis.urgency_level]?.label}
                  </span>
                </div>
                <div className="relative w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${urgencyConfig[analysis.urgency_level]?.bg}`}
                    style={{ width: `${urgencyConfig[analysis.urgency_level]?.percentage}%` }}
                  />
                </div>
              </div>

              {/* Extracted Text Preview */}
              {extractedText && (
                <div className="mb-6">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, extracted: !prev.extracted }))}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                      <FileText className="h-5 w-5" />
                      Extracted Text from Image
                    </h3>
                    <ChevronRight className={`h-5 w-5 text-blue-400 transition-transform ${expandedSections.extracted ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedSections.extracted && (
                    <div className="mt-3 p-4 rounded-xl bg-white border border-blue-200">
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{extractedText}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis */}
              <div className="space-y-4">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, analysis: !prev.analysis }))}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2 text-slate-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Detailed Analysis
                  </h3>
                  <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${expandedSections.analysis ? 'rotate-90' : ''}`} />
                </button>
                {expandedSections.analysis && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">
                    {analysis.analysis}
                  </div>
                )}
              </div>

              {/* Abnormalities */}
              {analysis.abnormalities.length > 0 && (
                <div className="space-y-4">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, abnormalities: !prev.abnormalities }))}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                  >
                    <h3 className="font-semibold flex items-center gap-2 text-rose-700">
                      <AlertCircle className="h-5 w-5" />
                      Findings ({analysis.abnormalities.length})
                    </h3>
                    <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${expandedSections.abnormalities ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedSections.abnormalities && (
                    <div className="space-y-2">
                      {analysis.abnormalities.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="space-y-4">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, recommendations: !prev.recommendations }))}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
                  >
                    <h3 className="font-semibold flex items-center gap-2 text-emerald-700">
                      <CheckCircle className="h-5 w-5" />
                      Recommendations ({analysis.recommendations.length})
                    </h3>
                    <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${expandedSections.recommendations ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedSections.recommendations && (
                    <div className="space-y-2">
                      {analysis.recommendations.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
