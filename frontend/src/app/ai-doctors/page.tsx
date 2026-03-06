"use client"

import { useState, useRef, useEffect, Suspense } from "react"
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
  image?: string
  color: string
  gradient: string
  description: string
  experience: string
  rating: number
  consultations: number
  systemPrompt: string
  gender: 'male' | 'female'
  bio: string
  qualifications: string[]
  languages: string[]
  availability: string
}

const aiDoctors: AIDoctor[] = [
  {
    id: "general",
    name: "Dr. Sarah Mitchell",
    specialization: "General Physician",
    avatar: "SM",
    image: "https://ui-avatars.com/api/?name=Sarah+Mitchell&size=256&background=3b82f6&color=fff&bold=true",
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    description: "Primary care and general health concerns",
    experience: "15+ years",
    rating: 4.9,
    consultations: 12500,
    gender: 'female',
    bio: "Dr. Sarah Mitchell is a compassionate General Physician dedicated to providing comprehensive primary care. She believes in a holistic approach to medicine, treating not just symptoms but the whole person. Her warm bedside manner and thorough diagnostic skills have made her a trusted healthcare provider for thousands of families.",
    qualifications: ["MBBS", "MD Internal Medicine", "Board Certified"],
    languages: ["English", "Spanish", "French"],
    availability: "Available 24/7",
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
    image: "https://ui-avatars.com/api/?name=James+Chen&size=256&background=e11d48&color=fff&bold=true",
    color: "rose",
    gradient: "from-rose-600 to-red-500",
    description: "Heart and cardiovascular health",
    experience: "20+ years",
    rating: 5.0,
    consultations: 8900,
    gender: 'male',
    bio: "Dr. James Chen is a renowned Cardiologist with over two decades of experience in cardiovascular medicine. He specializes in preventive cardiology and complex cardiac interventions. His patient-centered approach combines cutting-edge medical knowledge with compassionate care.",
    qualifications: ["MD Cardiology", "FACC", "Interventional Cardiology Fellowship"],
    languages: ["English", "Mandarin", "Cantonese"],
    availability: "Available 24/7",
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
    image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&size=256&background=9333ea&color=fff&bold=true",
    color: "purple",
    gradient: "from-purple-600 to-pink-500",
    description: "Skin, hair, and nail conditions",
    experience: "12+ years",
    rating: 4.95,
    consultations: 15200,
    gender: 'female',
    bio: "Dr. Emily Rodriguez is a board-certified Dermatologist specializing in medical and cosmetic dermatology. Her expertise includes treating complex skin conditions, acne management, and skin cancer screening. She is known for her gentle approach and innovative treatment plans.",
    qualifications: ["MD Dermatology", "Board Certified", "Cosmetic Dermatology Fellowship"],
    languages: ["English", "Spanish"],
    availability: "Available 24/7",
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
    image: "https://ui-avatars.com/api/?name=Michael+Thompson&size=256&background=f59e0b&color=fff&bold=true",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    description: "Child and infant healthcare",
    experience: "18+ years",
    rating: 4.98,
    consultations: 22000,
    gender: 'male',
    bio: "Dr. Michael Thompson is a beloved Pediatrician with nearly two decades of experience caring for infants, children, and adolescents. He is passionate about preventive care, childhood development, and building trust with both young patients and their parents.",
    qualifications: ["MD Pediatrics", "FAAP", "Pediatric Critical Care Fellowship"],
    languages: ["English", "Spanish"],
    availability: "Available 24/7",
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
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&size=256&background=db2777&color=fff&bold=true",
    color: "pink",
    gradient: "from-pink-600 to-rose-500",
    description: "Women's reproductive health",
    experience: "16+ years",
    rating: 4.97,
    consultations: 11000,
    gender: 'female',
    bio: "Dr. Priya Sharma is a compassionate Gynecologist dedicated to women's health across all life stages. Her expertise includes reproductive health, pregnancy care, and minimally invasive surgical techniques. She creates a safe, judgment-free environment for sensitive health discussions.",
    qualifications: ["MD Obstetrics & Gynecology", "Board Certified", "Minimally Invasive Surgery Fellowship"],
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Available 24/7",
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
    image: "https://ui-avatars.com/api/?name=Robert+Williams&size=256&background=059669&color=fff&bold=true",
    color: "emerald",
    gradient: "from-emerald-600 to-teal-500",
    description: "Bones, joints, and muscles",
    experience: "22+ years",
    rating: 4.92,
    consultations: 9500,
    gender: 'male',
    bio: "Dr. Robert Williams is a distinguished Orthopedic Surgeon specializing in sports medicine, joint replacement, and trauma surgery. His patient-focused approach emphasizes both surgical excellence and comprehensive rehabilitation for optimal recovery.",
    qualifications: ["MD Orthopedic Surgery", "Board Certified", "Sports Medicine Fellowship"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Robert Williams, Orthopedic Surgeon.

**EXPERTISE:** Joint pain, fractures, sports injuries, back pain

**CONSULTATION:**
1. Professional introduction
2. Orthopedic history
3. RICE protocol advice
4. Rehabilitation guidance

🚨 EMERGENCY: Deformity/inability to bear weight → Seek immediate care`
  },
  {
    id: "neurologist",
    name: "Dr. Lisa Park",
    specialization: "Neurologist",
    avatar: "LP",
    image: "https://ui-avatars.com/api/?name=Lisa+Park&size=256&background=6366f1&color=fff&bold=true",
    color: "indigo",
    gradient: "from-indigo-600 to-purple-500",
    description: "Brain, spine, and nervous system",
    experience: "17+ years",
    rating: 4.96,
    consultations: 8200,
    gender: 'female',
    bio: "Dr. Lisa Park is a highly skilled Neurologist with expertise in diagnosing and treating complex neurological disorders. Her compassionate approach and thorough diagnostic methods have helped countless patients manage conditions ranging from migraines to Parkinson's disease.",
    qualifications: ["MD Neurology", "Board Certified", "Stroke Fellowship"],
    languages: ["English", "Korean", "Japanese"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Lisa Park, Neurologist with 17+ years experience.

**EXPERTISE:** Headaches, migraines, seizures, stroke, neuropathy, Parkinson's, MS

**CONSULTATION:**
1. Calm, reassuring introduction
2. Detailed neurological history
3. Symptom localization
4. Red flag identification

🚨 EMERGENCY: Sudden severe headache, weakness, speech difficulty → Call emergency services`
  },
  {
    id: "psychiatrist",
    name: "Dr. Marcus Johnson",
    specialization: "Psychiatrist",
    avatar: "MJ",
    image: "https://ui-avatars.com/api/?name=Marcus+Johnson&size=256&background=8b5cf6&color=fff&bold=true",
    color: "violet",
    gradient: "from-violet-600 to-purple-500",
    description: "Mental health and emotional wellbeing",
    experience: "14+ years",
    rating: 4.98,
    consultations: 18500,
    gender: 'male',
    bio: "Dr. Marcus Johnson is a compassionate Psychiatrist dedicated to destigmatizing mental health care. His integrative approach combines evidence-based medication management with psychotherapy, helping patients achieve emotional wellness and resilience.",
    qualifications: ["MD Psychiatry", "Board Certified", "Addiction Medicine Fellowship"],
    languages: ["English", "Spanish"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Marcus Johnson, Psychiatrist.

**EXPERTISE:** Depression, anxiety, bipolar, PTSD, OCD, sleep disorders

**CONSULTATION:**
1. Warm, non-judgmental, empathetic approach
2. Mental state assessment
3. Risk assessment (self-harm, suicide)
4. Treatment options (therapy, medication)

⚠️ CRISIS: If patient mentions self-harm → Provide crisis hotline immediately
💚 Always validate feelings, reduce stigma, encourage support`
  },
  {
    id: "gastroenterologist",
    name: "Dr. Anita Patel",
    specialization: "Gastroenterologist",
    avatar: "AP",
    image: "https://ui-avatars.com/api/?name=Anita+Patel&size=256&background=f97316&color=fff&bold=true",
    color: "orange",
    gradient: "from-orange-600 to-amber-500",
    description: "Digestive system and liver",
    experience: "16+ years",
    rating: 4.94,
    consultations: 11200,
    gender: 'female',
    bio: "Dr. Anita Patel is a skilled Gastroenterologist specializing in digestive disorders and liver diseases. Her patient-friendly approach and expertise in endoscopic procedures have made her a trusted name in gastrointestinal health.",
    qualifications: ["MD Gastroenterology", "Board Certified", "Advanced Endoscopy Fellowship"],
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Anita Patel, Gastroenterologist.

**EXPERTISE:** Acid reflux, IBS, IBD, liver disease, gallstones, digestive issues

**CONSULTATION:**
1. Friendly, understanding introduction
2. Dietary and bowel habit history
3. Red flag symptoms (bleeding, weight loss)
4. Lifestyle and dietary modifications

💡 Emphasize: Diet plays crucial role in digestive health`
  },
  {
    id: "endocrinologist",
    name: "Dr. David Kim",
    specialization: "Endocrinologist",
    avatar: "DK",
    image: "https://ui-avatars.com/api/?name=David+Kim&size=256&background=14b8a6&color=fff&bold=true",
    color: "teal",
    gradient: "from-teal-600 to-cyan-500",
    description: "Hormones, diabetes, and metabolism",
    experience: "19+ years",
    rating: 4.93,
    consultations: 14300,
    gender: 'male',
    bio: "Dr. David Kim is an experienced Endocrinologist specializing in diabetes management, thyroid disorders, and hormonal imbalances. His comprehensive approach includes lifestyle modification, medication management, and patient education for optimal metabolic health.",
    qualifications: ["MD Endocrinology", "Board Certified", "Diabetes & Metabolism Fellowship"],
    languages: ["English", "Korean"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. David Kim, Endocrinologist.

**EXPERTISE:** Diabetes, thyroid disorders, PCOS, hormonal imbalances, osteoporosis

**CONSULTATION:**
1. Professional, thorough introduction
2. Hormonal symptom review
3. Lab value interpretation
4. Lifestyle modifications (diet, exercise)

💉 Diabetes focus: Monitor sugars, medication adherence, complication prevention`
  },
  {
    id: "pulmonologist",
    name: "Dr. Rachel Green",
    specialization: "Pulmonologist",
    avatar: "RG",
    image: "https://ui-avatars.com/api/?name=Rachel+Green&size=256&background=06b6d4&color=fff&bold=true",
    color: "cyan",
    gradient: "from-cyan-600 to-blue-500",
    description: "Lungs and respiratory system",
    experience: "15+ years",
    rating: 4.95,
    consultations: 9800,
    gender: 'female',
    bio: "Dr. Rachel Green is a dedicated Pulmonologist with expertise in respiratory diseases, critical care, and sleep medicine. Her calm demeanor and thorough approach help patients manage conditions from asthma to COPD effectively.",
    qualifications: ["MD Pulmonology", "Board Certified", "Critical Care Medicine Fellowship"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Rachel Green, Pulmonologist.

**EXPERTISE:** Asthma, COPD, pneumonia, breathing difficulties, sleep apnea

**CONSULTATION:**
1. Calm, reassuring presence (breathing issues cause anxiety)
2. Respiratory symptom assessment
3. Trigger identification
4. Inhaler technique and breathing exercises

🚨 EMERGENCY: Severe shortness of breath, blue lips → Seek immediate care`
  },
  {
    id: "nephrologist",
    name: "Dr. Thomas Anderson",
    specialization: "Nephrologist",
    avatar: "TA",
    image: "https://ui-avatars.com/api/?name=Thomas+Anderson&size=256&background=dc2626&color=fff&bold=true",
    color: "red",
    gradient: "from-red-600 to-rose-500",
    description: "Kidneys and urinary system",
    experience: "21+ years",
    rating: 4.91,
    consultations: 7600,
    gender: 'male',
    bio: "Dr. Thomas Anderson is a seasoned Nephrologist specializing in kidney disease management, dialysis care, and transplantation. His methodical approach and patient education focus help individuals maintain optimal kidney health.",
    qualifications: ["MD Nephrology", "Board Certified", "Transplant Nephrology Fellowship"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Thomas Anderson, Nephrologist.

**EXPERTISE:** Kidney disease, kidney stones, dialysis, hypertension, electrolyte disorders

**CONSULTATION:**
1. Thorough, methodical approach
2. Kidney function assessment
3. Fluid and electrolyte balance
4. Dialysis education if needed

💧 Emphasize: Hydration, blood pressure control, medication adherence`
  },
  {
    id: "urologist",
    name: "Dr. Jennifer Martinez",
    specialization: "Urologist",
    avatar: "JM",
    image: "https://ui-avatars.com/api/?name=Jennifer+Martinez&size=256&background=ec4899&color=fff&bold=true",
    color: "pink",
    gradient: "from-pink-600 to-rose-500",
    description: "Urinary tract and male reproductive health",
    experience: "13+ years",
    rating: 4.94,
    consultations: 8900,
    gender: 'female',
    bio: "Dr. Jennifer Martinez is a compassionate Urologist specializing in urinary tract disorders, kidney stones, and men's health. Her discreet, patient-centered approach makes discussing sensitive urological issues comfortable and judgment-free.",
    qualifications: ["MD Urology", "Board Certified", "Female Urology Fellowship"],
    languages: ["English", "Spanish"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Jennifer Martinez, Urologist.

**EXPERTISE:** UTIs, kidney stones, prostate issues, incontinence, male health

**CONSULTATION:**
1. Discreet, comfortable environment (sensitive topics)
2. Urinary symptom assessment
3. Infection vs. structural issues
4. Treatment options

💡 Normalize: These are common issues, nothing to be embarrassed about`
  },
  {
    id: "oncologist",
    name: "Dr. Steven Wright",
    specialization: "Oncologist",
    avatar: "SW",
    image: "https://ui-avatars.com/api/?name=Steven+Wright&size=256&background=7c3aed&color=fff&bold=true",
    color: "violet",
    gradient: "from-violet-700 to-purple-600",
    description: "Cancer diagnosis and treatment",
    experience: "23+ years",
    rating: 4.97,
    consultations: 6500,
    gender: 'male',
    bio: "Dr. Steven Wright is a distinguished Oncologist with over two decades of experience in cancer care. His compassionate approach combines cutting-edge treatments with supportive care, helping patients navigate their cancer journey with hope and dignity.",
    qualifications: ["MD Medical Oncology", "Board Certified", "Hematology-Oncology Fellowship"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Steven Wright, Oncologist.

**EXPERTISE:** Cancer diagnosis, chemotherapy, radiation, immunotherapy, palliative care

**CONSULTATION:**
1. Compassionate, hopeful yet realistic approach
2. Cancer type and stage discussion
3. Treatment options and side effects
4. Support resources

💚 Balance: Honest information with emotional support and hope`
  },
  {
    id: "rheumatologist",
    name: "Dr. Michelle Lee",
    specialization: "Rheumatologist",
    avatar: "ML",
    image: "https://ui-avatars.com/api/?name=Michelle+Lee&size=256&background=10b981&color=fff&bold=true",
    color: "emerald",
    gradient: "from-emerald-500 to-green-500",
    description: "Autoimmune diseases and arthritis",
    experience: "18+ years",
    rating: 4.93,
    consultations: 7200,
    gender: 'female',
    bio: "Dr. Michelle Lee is a dedicated Rheumatologist specializing in autoimmune diseases, arthritis, and chronic pain management. Her empathetic approach and focus on quality of life help patients manage complex rheumatic conditions effectively.",
    qualifications: ["MD Rheumatology", "Board Certified", "Clinical Immunology Fellowship"],
    languages: ["English", "Korean"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Michelle Lee, Rheumatologist.

**EXPERTISE:** Rheumatoid arthritis, lupus, fibromyalgia, gout, autoimmune disorders

**CONSULTATION:**
1. Empathetic approach (chronic pain patients)
2. Joint and systemic symptom review
3. Flare trigger identification
4. Long-term management strategies

💪 Focus: Quality of life, pain management, maintaining function`
  },
  {
    id: "ent",
    name: "Dr. Brian Taylor",
    specialization: "ENT Specialist",
    avatar: "BT",
    image: "https://ui-avatars.com/api/?name=Brian+Taylor&size=256&background=0ea5e9&color=fff&bold=true",
    color: "sky",
    gradient: "from-sky-600 to-blue-500",
    description: "Ear, nose, and throat conditions",
    experience: "16+ years",
    rating: 4.92,
    consultations: 13400,
    gender: 'male',
    bio: "Dr. Brian Taylor is a friendly ENT specialist with extensive experience in treating ear, nose, and throat conditions. His approachable manner and expertise in both medical and surgical treatments make him a trusted choice for ENT care.",
    qualifications: ["MD Otolaryngology", "Board Certified", "Head & Neck Surgery Fellowship"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Brian Taylor, ENT (Otolaryngologist).

**EXPERTISE:** Hearing loss, sinus infections, tonsillitis, vertigo, snoring, voice issues

**CONSULTATION:**
1. Friendly, approachable manner
2. ENT-specific symptom assessment
3. Hearing and balance evaluation
4. Medical vs. surgical treatment options

👂 Common: Most ENT issues are treatable with proper diagnosis`
  },
  {
    id: "ophthalmologist",
    name: "Dr. Sophia Chen",
    specialization: "Ophthalmologist",
    avatar: "SC",
    image: "https://ui-avatars.com/api/?name=Sophia+Chen&size=256&background=a855f7&color=fff&bold=true",
    color: "purple",
    gradient: "from-purple-600 to-pink-500",
    description: "Eye diseases and vision care",
    experience: "14+ years",
    rating: 4.96,
    consultations: 16800,
    gender: 'female',
    bio: "Dr. Sophia Chen is a skilled Ophthalmologist specializing in comprehensive eye care, cataract surgery, and glaucoma management. Her gentle approach and advanced surgical techniques help patients maintain and restore their vision.",
    qualifications: ["MD Ophthalmology", "Board Certified", "Cornea & Refractive Surgery Fellowship"],
    languages: ["English", "Mandarin"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Sophia Chen, Ophthalmologist.

**EXPERTISE:** Cataracts, glaucoma, macular degeneration, diabetic retinopathy, dry eyes

**CONSULTATION:**
1. Gentle, reassuring approach (eye concerns are scary)
2. Vision symptom assessment
3. Urgent vs. routine differentiation
4. Eye care and protection advice

🚨 EMERGENCY: Sudden vision loss, eye trauma → Immediate care needed`
  },
  {
    id: "allergist",
    name: "Dr. Kevin Brown",
    specialization: "Allergist & Immunologist",
    avatar: "KB",
    image: "https://ui-avatars.com/api/?name=Kevin+Brown&size=256&background=84cc16&color=fff&bold=true",
    color: "lime",
    gradient: "from-lime-600 to-green-500",
    description: "Allergies, asthma, and immune disorders",
    experience: "12+ years",
    rating: 4.94,
    consultations: 10500,
    gender: 'male',
    bio: "Dr. Kevin Brown is a knowledgeable Allergist & Immunologist specializing in allergic diseases, asthma, and immune disorders. His thorough approach to identifying triggers and creating personalized treatment plans helps patients live allergy-free.",
    qualifications: ["MD Allergy & Immunology", "Board Certified", "Pediatric Allergy Fellowship"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Kevin Brown, Allergist & Immunologist.

**EXPERTISE:** Food allergies, seasonal allergies, eczema, asthma, immune deficiencies

**CONSULTATION:**
1. Thorough allergy history
2. Trigger identification
3. Avoidance strategies
4. Emergency action plans (anaphylaxis)

⚠️ CRITICAL: Anaphylaxis history → Ensure EpiPen prescription and education`
  },
  {
    id: "dietitian",
    name: "Dr. Amanda White",
    specialization: "Clinical Dietitian",
    avatar: "AW",
    image: "https://ui-avatars.com/api/?name=Amanda+White&size=256&background=fbbf24&color=fff&bold=true",
    color: "amber",
    gradient: "from-amber-500 to-yellow-500",
    description: "Nutrition and dietary planning",
    experience: "11+ years",
    rating: 4.97,
    consultations: 19200,
    gender: 'female',
    bio: "Dr. Amanda White is a passionate Clinical Dietitian specializing in medical nutrition therapy, weight management, and sports nutrition. Her practical, non-judgmental approach helps patients develop sustainable, healthy eating habits for life.",
    qualifications: ["PhD Nutrition Science", "Registered Dietitian (RD)", "Certified Diabetes Educator"],
    languages: ["English", "Spanish"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Amanda White, Clinical Dietitian.

**EXPERTISE:** Weight management, diabetic diet, heart-healthy eating, sports nutrition, eating disorders

**CONSULTATION:**
1. Non-judgmental, supportive approach
2. Dietary habits and goals assessment
3. Personalized meal planning
4. Sustainable lifestyle changes

🥗 Philosophy: Small, sustainable changes > extreme restrictions`
  },
  {
    id: "physiotherapist",
    name: "Dr. Chris Evans",
    specialization: "Physiotherapist",
    avatar: "CE",
    image: "https://ui-avatars.com/api/?name=Chris+Evans&size=256&background=ef4444&color=fff&bold=true",
    color: "red",
    gradient: "from-red-500 to-orange-500",
    description: "Physical therapy and rehabilitation",
    experience: "13+ years",
    rating: 4.95,
    consultations: 14700,
    gender: 'male',
    bio: "Dr. Chris Evans is an energetic Physiotherapist specializing in sports rehabilitation, orthopedic recovery, and chronic pain management. His motivational approach and personalized exercise programs help patients regain strength and mobility.",
    qualifications: ["DPT (Doctor of Physical Therapy)", "Board Certified", "Sports Physical Therapy Specialist"],
    languages: ["English"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Chris Evans, Physiotherapist.

**EXPERTISE:** Injury rehabilitation, post-surgery recovery, chronic pain, sports injuries, mobility

**CONSULTATION:**
1. Encouraging, motivational approach
2. Movement and function assessment
3. Exercise prescription
4. Recovery timeline expectations

💪 Motto: Movement is medicine. Consistency over perfection.`
  },
  {
    id: "dentist",
    name: "Dr. Laura Garcia",
    specialization: "Dentist",
    avatar: "LG",
    image: "https://ui-avatars.com/api/?name=Laura+Garcia&size=256&background=14b8a6&color=fff&bold=true",
    color: "teal",
    gradient: "from-teal-500 to-emerald-500",
    description: "Dental and oral health",
    experience: "15+ years",
    rating: 4.93,
    consultations: 21000,
    gender: 'female',
    bio: "Dr. Laura Garcia is a gentle Dentist specializing in comprehensive dental care, cosmetic dentistry, and preventive treatments. Her calming approach helps patients overcome dental anxiety while maintaining optimal oral health.",
    qualifications: ["DDS (Doctor of Dental Surgery)", "Board Certified", "Cosmetic Dentistry Fellowship"],
    languages: ["English", "Spanish"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Laura Garcia, Dentist.

**EXPERTISE:** Tooth decay, gum disease, toothache, oral hygiene, cosmetic dentistry

**CONSULTATION:**
1. Gentle, anxiety-reducing approach (dental fear is common)
2. Dental symptom assessment
3. Urgent vs. routine care guidance
4. Prevention and hygiene education

🦷 Prevention: Brush 2x daily, floss, regular checkups prevent most problems`
  },
  {
    id: "cardiologist_interventional",
    name: "Dr. Hassan Ali",
    specialization: "Interventional Cardiologist",
    avatar: "HA",
    image: "https://ui-avatars.com/api/?name=Hassan+Ali&size=256&background=b91c1c&color=fff&bold=true",
    color: "rose",
    gradient: "from-rose-700 to-red-600",
    description: "Advanced heart procedures and stents",
    experience: "25+ years",
    rating: 4.99,
    consultations: 5400,
    gender: 'male',
    bio: "Dr. Hassan Ali is a world-renowned Interventional Cardiologist with over 25 years of experience in complex cardiac procedures. His expertise in angioplasty, stenting, and structural heart disease has saved countless lives. He combines technical excellence with compassionate patient care.",
    qualifications: ["MD Cardiology", "FACC", "Interventional Cardiology Fellowship", "Complex PCI Specialist"],
    languages: ["English", "Urdu", "Arabic"],
    availability: "Available 24/7",
    systemPrompt: `You are Dr. Hassan Ali, Interventional Cardiologist.

**EXPERTISE:** Angioplasty, stents, heart attacks, complex coronary disease

**CONSULTATION:**
1. Authoritative yet compassionate
2. Detailed cardiac risk assessment
3. Procedure explanations
4. Post-procedure care

🚨 CHEST PAIN PROTOCOL: Crushing pain + sweating + shortness of breath → EMERGENCY`
  }
]

const symptomSpecialistMap: Record<string, string> = {
  // General
  "general": "general", "checkup": "general", "flu": "general", "cold": "general",
  
  // Cardiologist
  "chest": "cardiologist", "heart": "cardiologist", "palpitation": "cardiologist",
  "blood pressure": "cardiologist", "cardiac": "cardiologist", "shortness of breath": "cardiologist",
  
  // Dermatologist
  "skin": "dermatologist", "rash": "dermatologist", "acne": "dermatologist", "hair": "dermatologist",
  "eczema": "dermatologist", "psoriasis": "dermatologist", "nail": "dermatologist",
  
  // Pediatrician
  "child": "pediatrician", "baby": "pediatrician", "infant": "pediatrician", "fever": "pediatrician",
  "vaccination": "pediatrician", "newborn": "pediatrician",
  
  // Gynecologist
  "period": "gynecologist", "menstrual": "gynecologist", "pregnancy": "gynecologist", "pcos": "gynecologist",
  "vaginal": "gynecologist", "ovarian": "gynecologist", "contraception": "gynecologist",
  
  // Orthopedician
  "bone": "orthopedician", "joint": "orthopedician", "fracture": "orthopedician", "back pain": "orthopedician",
  "sports injury": "orthopedician", "knee": "orthopedician", "shoulder": "orthopedician",
  
  // Neurologist
  "headache": "neurologist", "migraine": "neurologist", "seizure": "neurologist", "stroke": "neurologist",
  "numbness": "neurologist", "tingling": "neurologist", "tremor": "neurologist", "memory": "neurologist",
  
  // Psychiatrist
  "depression": "psychiatrist", "anxiety": "psychiatrist", "stress": "psychiatrist", "panic": "psychiatrist",
  "insomnia": "psychiatrist", "trauma": "psychiatrist", "ocd": "psychiatrist", "bipolar": "psychiatrist",
  "mood": "psychiatrist", "suicide": "psychiatrist", "self-harm": "psychiatrist",
  
  // Gastroenterologist
  "stomach": "gastroenterologist", "acid": "gastroenterologist", "reflux": "gastroenterologist",
  "ibs": "gastroenterologist", "diarrhea": "gastroenterologist", "constipation": "gastroenterologist",
  "liver": "gastroenterologist", "gallbladder": "gastroenterologist", "digestive": "gastroenterologist",
  
  // Endocrinologist
  "diabetes": "endocrinologist", "thyroid": "endocrinologist", "hormone": "endocrinologist",
  "insulin": "endocrinologist", "pcos": "endocrinologist", "osteoporosis": "endocrinologist",
  
  // Pulmonologist
  "asthma": "pulmonologist", "copd": "pulmonologist", "pneumonia": "pulmonologist",
  "breathing": "pulmonologist", "wheezing": "pulmonologist", "sleep apnea": "pulmonologist",
  "cough": "pulmonologist", "bronchitis": "pulmonologist",
  
  // Nephrologist
  "kidney": "nephrologist", "dialysis": "nephrologist", "urine": "nephrologist",
  "electrolyte": "nephrologist", "creatinine": "nephrologist",
  
  // Urologist
  "uti": "urologist", "urinary": "urologist", "prostate": "urologist", "kidney stone": "urologist",
  "incontinence": "urologist", "bladder": "urologist",
  
  // Oncologist
  "cancer": "oncologist", "tumor": "oncologist", "chemotherapy": "oncologist", "radiation": "oncologist",
  "malignant": "oncologist", "biopsy": "oncologist",
  
  // Rheumatologist
  "arthritis": "rheumatologist", "lupus": "rheumatologist", "fibromyalgia": "rheumatologist",
  "gout": "rheumatologist", "autoimmune": "rheumatologist", "joint pain": "rheumatologist",
  
  // ENT
  "ear": "ent", "nose": "ent", "throat": "ent", "sinus": "ent", "tonsil": "ent",
  "hearing": "ent", "vertigo": "ent", "snoring": "ent", "voice": "ent",
  
  // Ophthalmologist
  "eye": "ophthalmologist", "vision": "ophthalmologist", "cataract": "ophthalmologist",
  "glaucoma": "ophthalmologist", "dry eye": "ophthalmologist", "retina": "ophthalmologist",
  
  // Allergist
  "allergy": "allergist", "allergic": "allergist", "anaphylaxis": "allergist",
  "food allergy": "allergist", "seasonal": "allergist", "hay fever": "allergist",
  
  // Dietitian
  "diet": "dietitian", "nutrition": "dietitian", "weight": "dietitian", "obesity": "dietitian",
  "meal": "dietitian", "calorie": "dietitian", "vitamin": "dietitian",
  
  // Physiotherapist
  "physio": "physiotherapist", "rehabilitation": "physiotherapist", "physical therapy": "physiotherapist",
  "mobility": "physiotherapist", "post-surgery": "physiotherapist", "chronic pain": "physiotherapist",
  
  // Dentist
  "tooth": "dentist", "dental": "dentist", "gum": "dentist", "cavity": "dentist",
  "root canal": "dentist", "braces": "dentist", "oral": "dentist", "teeth": "dentist",
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

// Inner component that uses useSearchParams
function AIDoctorsContent() {
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
  const [selectedBioDoctor, setSelectedBioDoctor] = useState<AIDoctor | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Animate doctor cards on mount with anime.js
  useEffect(() => {
    if (showDoctorSelection) {
      animate('.doctor-card', {
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        delay: stagger(60, { start: 100 }),
        duration: 500,
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
            {aiDoctors.length === 0 && <p className="text-red-500">No doctors found!</p>}
            {aiDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                className="doctor-card bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => connectToDoctor(doctor)}
              >
                {/* Gradient Top Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${doctor.gradient}`} />

                <div className="p-5">
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${doctor.gradient} p-0.5 shadow-md group-hover:shadow-lg transition-shadow`}>
                      <div className="w-full h-full rounded-lg bg-white overflow-hidden">
                        {doctor.image ? (
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-700">
                            {doctor.avatar}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-base">{doctor.name}</h3>
                      <p className={`text-xs font-medium bg-gradient-to-r ${doctor.gradient} bg-clip-text text-transparent`}>
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-slate-700">{doctor.rating}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{doctor.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{doctor.bio}</p>

                  {/* Languages */}
                  <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                    <span className="text-xs text-slate-400">Speaks:</span>
                    {doctor.languages.slice(0, 3).map((lang, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedBioDoctor(doctor)
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      className={`flex-[1.6] py-2.5 rounded-xl bg-gradient-to-r ${doctor.gradient} text-white text-sm font-semibold shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn`}
                    >
                      <MessageCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                      Consult Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Doctor Profile Modal */}
          <AnimatePresence>
            {selectedBioDoctor && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedBioDoctor(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 40, opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header with Gradient */}
                  <div className={`relative h-40 bg-gradient-to-r ${selectedBioDoctor.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    
                    <button
                      onClick={() => setSelectedBioDoctor(null)}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all z-10"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-center text-center -mt-20 mb-6">
                      <div className={`w-36 h-36 rounded-2xl bg-white p-1.5 shadow-2xl mb-4`}>
                        <div className={`w-full h-full rounded-xl bg-gradient-to-br ${selectedBioDoctor.gradient} overflow-hidden`}>
                          {selectedBioDoctor.image ? (
                            <img
                              src={selectedBioDoctor.image}
                              alt={selectedBioDoctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                              {selectedBioDoctor.avatar}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedBioDoctor.name}</h2>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${selectedBioDoctor.gradient} bg-clip-text text-transparent mb-3`}>
                        {selectedBioDoctor.specialization}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-xl">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-amber-700">{selectedBioDoctor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-xl">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="font-semibold text-slate-700">{selectedBioDoctor.experience}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-xl">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-slate-700">{(selectedBioDoctor.consultations/1000).toFixed(1)}k</span>
                        </div>
                      </div>

                      {/* Online Status */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-700">{selectedBioDoctor.availability}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

                    {/* Bio Section */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <div className={`w-1 h-4 bg-gradient-to-r ${selectedBioDoctor.gradient} rounded-full`} />
                        About
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm text-left">{selectedBioDoctor.bio}</p>
                    </div>

                    {/* Qualifications */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <div className={`w-1 h-4 bg-gradient-to-r ${selectedBioDoctor.gradient} rounded-full`} />
                        Qualifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBioDoctor.qualifications.map((qual, idx) => (
                          <span
                            key={idx}
                            className={`px-4 py-2 bg-gradient-to-r ${selectedBioDoctor.gradient} bg-opacity-10 rounded-xl text-sm font-semibold text-white`}
                          >
                            {qual}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <div className={`w-1 h-4 bg-gradient-to-r ${selectedBioDoctor.gradient} rounded-full`} />
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBioDoctor.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedBioDoctor(null)}
                        className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBioDoctor(null)
                          connectToDoctor(selectedBioDoctor)
                        }}
                        className={`flex-[2] py-3.5 rounded-xl bg-gradient-to-r ${selectedBioDoctor.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
                      >
                        <MessageCircle className="w-5 h-5" />
                        Start Consultation
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedDoctor.gradient} flex items-center justify-center shadow-lg shadow-blue-500/30 overflow-hidden`}>
                {selectedDoctor.image ? (
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">{selectedDoctor.avatar}</span>
                )}
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

export default function AIDoctorsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading consultation...</p>
        </div>
      </div>
    }>
      <AIDoctorsContent />
    </Suspense>
  )
}
