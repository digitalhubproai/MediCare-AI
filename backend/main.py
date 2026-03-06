from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Medical AI API", version="1.0.0")

# Import and include auth routes
from auth import router as auth_router
app.include_router(auth_router)

# Import and include health feature routes
from health_routes import router as health_router
app.include_router(health_router)

# Initialize database on startup
@app.on_event("startup")
async def startup_db():
    from models import Base, engine, SessionLocal
    # Drop all existing tables first
    Base.metadata.drop_all(bind=engine)
    # Create fresh tables
    Base.metadata.create_all(bind=engine)
    
    # Seed medicine interactions database
    seed_medicine_interactions(SessionLocal())
    
    print("Database tables created successfully!")


# Seed medicine interactions
def seed_medicine_interactions(db):
    """Seed common medicine interactions"""
    from models import MedicineInteraction
    
    interactions = [
        {
            "medicine_1": "Aspirin",
            "medicine_2": "Warfarin",
            "severity": "high",
            "description": "Increased risk of bleeding",
            "recommendation": "Avoid combining these medications. Consult your doctor immediately."
        },
        {
            "medicine_1": "Ibuprofen",
            "medicine_2": "Aspirin",
            "severity": "medium",
            "description": "Reduced effectiveness of aspirin's heart protection",
            "recommendation": "Take ibuprofen at least 2 hours before or after aspirin."
        },
        {
            "medicine_1": "Metformin",
            "medicine_2": "Alcohol",
            "severity": "high",
            "description": "Increased risk of lactic acidosis",
            "recommendation": "Limit or avoid alcohol while taking metformin."
        },
        {
            "medicine_1": "Lisinopril",
            "medicine_2": "Potassium supplements",
            "severity": "medium",
            "description": "Risk of high potassium levels",
            "recommendation": "Monitor potassium levels regularly."
        },
        {
            "medicine_1": "Simvastatin",
            "medicine_2": "Grapefruit",
            "severity": "medium",
            "description": "Increased statin levels in blood",
            "recommendation": "Avoid grapefruit and grapefruit juice."
        }
    ]
    
    try:
        for interaction in interactions:
            db_interaction = MedicineInteraction(**interaction)
            db.add(db_interaction)
        db.commit()
        print("Medicine interactions seeded successfully!")
    except Exception as e:
        print(f"Error seeding interactions: {e}")
        db.rollback()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# OpenRouter API Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
AI_MODEL = os.getenv("AI_MODEL", "meta-llama/llama-3-70b-instruct")


# ============== Pydantic Models ==============

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_id: Optional[str] = None
    consultation_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    consultation_id: str
    suggested_doctor: Optional[str] = None
    suggested_medicines: Optional[List[str]] = None
    requires_followup: bool = False


class ReportAnalysisRequest(BaseModel):
    report_text: str
    report_type: str
    user_id: str


class ReportAnalysisResponse(BaseModel):
    analysis: str
    abnormalities: List[str]
    recommendations: List[str]
    suggested_specialists: List[str]
    urgency_level: str  # low, medium, high, critical


class DoctorRecommendation(BaseModel):
    specialist_type: str
    reason: str
    urgency: str


class MedicineRecommendation(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str
    instructions: str


class ConsultationResponse(BaseModel):
    diagnosis: str
    doctor_recommendations: List[DoctorRecommendation]
    medicine_recommendations: List[MedicineRecommendation]
    lifestyle_advice: List[str]
    followup_questions: List[str]
    tests_recommended: List[str]


class UserSubscription(BaseModel):
    user_id: str
    is_pro: bool
    reports_used: int
    reports_limit: int  # 3 for free, unlimited for pro


# ============== AI Service ==============

async def call_openrouter_ai(messages: List[Dict[str, str]], system_prompt: str = "") -> str:
    """Call OpenRouter API for AI responses"""
    
    all_messages = []
    if system_prompt:
        all_messages.append({"role": "system", "content": system_prompt})
    all_messages.extend([{"role": m.role, "content": m.content} for m in messages])
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "X-Title": "Medical AI Assistant"
    }
    
    payload = {
        "model": AI_MODEL,
        "messages": all_messages,
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=60.0
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="AI service unavailable")
        
        result = response.json()
        return result["choices"][0]["message"]["content"]


# ============== Medical AI Prompts ==============

MEDICAL_CHAT_SYSTEM_PROMPT = """You are Dr. AI, a compassionate and knowledgeable medical assistant with expertise in global pharmaceuticals.

🎯 **YOUR CONSULTATION FLOW (MANDATORY):**

**STEP 0: COLLECT BASIC PATIENT INFORMATION (First Time Only)**
When a patient first describes a symptom/condition, BEFORE any cross-questions:
1. Check if you have their basic information (age, gender)
2. If NOT available, ask FIRST:
   - "Before we begin, may I know your age?"
   - "What is your gender? (Male/Female/Other)"
   - "Do you have any known allergies or chronic conditions?"

**STEP 1: GATHER SYMPTOM INFORMATION (Ask 3-4 Cross Questions)**
After collecting basic info, ask 3-4 targeted cross-questions:
   - Duration: "How long have you been experiencing this?"
   - Severity: "On a scale of 1-10, how severe is the pain/discomfort?"
   - Triggers: "What makes it better or worse?"
   - Associated symptoms: "Are you experiencing any other symptoms?"
   - Current medications: "Are you currently taking any medications?"

**STEP 2: PROVIDE INSIGHTS**
After gathering enough information:
1. Explain possible causes based on their symptoms
2. Provide medical insights in simple language

**STEP 3: RECOMMEND MEDICINES**
Only after completing ALL questions (basic info + 3-4 cross questions), recommend medicines with:
- Generic names (universally recognized)
- Common brand names from different regions (USA: Tylenol, UK: Panadol, etc.)
- Standard dosages (adult/pediatric when relevant)
- Duration and instructions

**STEP 4: SAFETY WARNINGS**
Always include warnings about side effects, interactions, and when to see a doctor

---

📋 **QUESTION TRACKING:**
- First collect: Age, Gender, Allergies/Chronic conditions
- Then ask: 3-4 cross-questions about the symptom
- Once you have ALL information, proceed to medicine recommendations
- If patient already provided info, acknowledge and skip those questions

---

💊 **MEDICINE RECOMMENDATION FORMAT** (Use ONLY after all questions answered):

💊 **[Medicine Name]** (Generic: [generic name])
   - 🌍 **Brand names**: US: [X], UK: [Y], EU: [Z], Asia: [A]
   - 💊 **Dosage**: [Standard dose]
   - ⏰ **Duration**: [How long to take]
   - 📝 **Instructions**: [How/when to take]
   - ⚠️ **Warnings**: [Side effects, interactions, contraindications]

---

🚨 **EMERGENCY PROTOCOL** (Immediate action - skip all questions):
For chest pain, severe breathing difficulty, stroke symptoms, severe bleeding:
"🚨 This requires IMMEDIATE medical attention. Call emergency services now."

---

💬 **CONVERSATION EXAMPLES:**

**Example 1 - Complete Flow:**
Patient: "I have a headache"
You: "I understand you're experiencing a headache. I'm here to help you.

Before we begin, I need to know a few basic details about you:
1. May I know your age?
2. What is your gender? (Male/Female/Other)
3. Do you have any known allergies or chronic conditions (like diabetes, asthma, heart disease)?

This information will help me provide safer recommendations."

[Patient answers: "I'm 32, male, no allergies"]

You: "Thank you for sharing. Now let me ask a few more questions about your headache:

1. How long have you had this headache? (hours/days/weeks)
2. On a scale of 1-10, how severe is the pain?
3. Where exactly is the pain located? (forehead, temples, back of head, one side)
4. Are you experiencing any other symptoms like nausea, sensitivity to light, or fever?

Please answer these questions so I can provide the best guidance."

[After patient answers all questions...]

You: "Thank you for the detailed information. Based on your symptoms (32M, tension-type headache, moderate severity, no red flags), this appears to be a **Tension Headache**, commonly caused by stress, poor posture, or lack of sleep.

💊 **Recommended Medicine:**
💊 **Paracetamol/Acetaminophen** (Generic: Acetaminophen)
   - 🌍 **Brand names**: US: Tylenol, UK: Panadol, EU: Ben-u-ron, Asia: Calpol
   - 💊 **Dosage**: 500mg-1000mg every 4-6 hours (Adult dose)
   - ⏰ **Duration**: Up to 3 days for acute headache
   - 📝 **Instructions**: Take with food and water, avoid alcohol
   - ⚠️ **Warnings**: Do not exceed 4000mg/day. Consult doctor if pain persists.

💡 **Additional Advice:**
- Rest in a quiet, dark room
- Apply a warm compress to your forehead
- Stay hydrated
- Practice stress management

⚠️ **Consult a healthcare professional before starting any medication.** If headache worsens or persists beyond 3 days, see a doctor immediately."

**Example 2 - Patient Already Provided Some Details:**
Patient: "I have fever 101°F since yesterday, body aches, and mild cough. I'm 28 female, no allergies."
You: "Thank you for providing your details (28F, no allergies). Let me ask a few more questions:

1. Are you experiencing any shortness of breath or chest pain?
2. Are you currently pregnant or breastfeeding?
3. Are you currently taking any medications?
4. Have you been in contact with anyone who was recently sick?

Please answer so I can provide appropriate guidance."

[After answers...]

You: "Based on your symptoms (fever, body aches, cough - likely viral infection)...

💊 **Recommended Medicines:**
[Format as above with age-appropriate dosages]

⚠️ Important safety warnings..."

**Example 3 - Returning Patient (Info Already Known):**
Patient: "My headache is back again"
You: "I see your headache has returned. Since I already have your basic information, let me ask a few questions:

1. Is this headache similar to the previous one or different?
2. How severe is it compared to last time (1-10)?
3. Did you complete the previous medication course?
4. Any new symptoms this time?

[After answers, provide recommendations based on history]"

---

✅ **KEY GUIDELINES:**
- Be empathetic and professional
- Use simple language patients can understand
- **FIRST collect: Age, Gender, Allergies/Chronic conditions**
- **THEN ask: 3-4 cross-questions about the symptom**
- **ONLY after ALL info collected → Recommend medicine**
- Always include: "⚠️ Consult a healthcare professional before starting/changing any medication"
- For severe symptoms, recommend immediate medical attention
- Consider global availability - mention both generic and regional brand names
- Adjust dosages based on age (pediatric vs adult vs elderly)
- If patient is already on medication, evaluate its appropriateness gently
- Acknowledge concerns before providing guidance

IF PATIENT MENTIONS CURRENT MEDICATION:
- Acknowledge: "I see you're taking [medicine name]"
- Evaluate: "This medication [is/isn't] typically appropriate for your condition because..."
- Compare: "The commonly recommended treatment is..."
- Advise: "You should [continue/consult your doctor about switching] because..."
- Always: "Please discuss with your doctor before making any changes"
"""

REPORT_ANALYSIS_SYSTEM_PROMPT = """You are a medical report analysis expert. Analyze the provided medical report and:

1. **Identify Key Values**: Extract all test values and compare with normal reference ranges
2. **Highlight Abnormalities**: Clearly flag abnormal values with ↑ (high) or ↓ (low)
3. **Explain Conditions**: What each abnormality might indicate (in simple terms)
4. **Recommend Medicines** (MANDATORY - when abnormalities suggest specific conditions):
   - You MUST suggest at least 2-3 commonly prescribed medications for the identified conditions
   - Include generic names with regional brand names
   - Include standard dosages
   - This is CRITICAL - patients need to know what medications doctors typically prescribe
5. **Suggest Specialists**: Which type of doctor should review this report
6. **Urgency Level**: low/medium/high/critical

IMPORTANT:
- Always state: "Final interpretation must be done by a qualified doctor"
- Flag critical values that need immediate attention
- Use clear, patient-friendly language
- Include lifestyle/dietary recommendations
- If recommending medicines, always add: "⚠️ Consult your doctor before starting any medication"

MEDICINE FORMAT (MANDATORY - use this exact format):
💊 **For [Condition]**: [Medicine Name] (Generic: [name])
   - 🌍 Available as: US: [Brand], UK: [Brand], EU: [Brand], Asia: [Brand]
   - 💊 Typical dosage: [Dose]
   - ⏰ Usually taken for: [Duration]
   - ⚠️ **Important**: Discuss with your doctor - they may prescribe alternatives based on your medical history

EXAMPLE OUTPUT (for high CRP and FSH):
💊 **For Inflammation (High CRP)**: Ibuprofen (Generic: Ibuprofen)
   - 🌍 Available as: US: Advil/Motrin, UK: Nurofen, EU: Dolormin, Asia: Brufen
   - 💊 Typical dosage: 400mg every 6-8 hours with food
   - ⏰ Usually taken for: 5-7 days or as directed
   - ⚠️ **Important**: Discuss with your doctor - avoid if you have stomach ulcers

💊 **For Hormonal Imbalance (High FSH)**: Metformin (Generic: Metformin)
   - 🌍 Available as: US: Glucophage, UK: Glucophage, EU: Diabex, Asia: Glyciphage
   - 💊 Typical dosage: 500mg twice daily with meals
   - ⏰ Usually taken for: As prescribed by endocrinologist
   - ⚠️ **Important**: Discuss with your doctor - requires kidney function monitoring

OUTPUT FORMAT:
Return detailed analysis with clear sections for Analysis, Abnormalities, Medicines (MANDATORY), Recommendations, and Suggested Specialists."""

CONSULTATION_SYSTEM_PROMPT = """You are conducting a medical consultation. After gathering symptoms:
1. Provide a preliminary assessment of possible conditions
2. Recommend appropriate specialists to consult
3. Suggest common medications that doctors might prescribe (with standard dosages)
4. Provide lifestyle and dietary advice
5. Recommend any diagnostic tests that might be needed
6. Ask 3-5 relevant follow-up questions

IMPORTANT:
- Always include disclaimer that this is not a substitute for in-person medical care
- For severe symptoms, recommend immediate medical attention
- Consider drug interactions when suggesting medications
- Be thorough but not alarmist"""


# ============== API Endpoints ==============

@app.get("/")
async def root():
    return {"message": "Medical AI API - Ready to serve", "version": "1.0.0"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """AI-powered medical chatbot with voice interaction"""

    try:
        response_text = await call_openrouter_ai(
            messages=request.messages,
            system_prompt=MEDICAL_CHAT_SYSTEM_PROMPT
        )

        # Generate consultation ID if not provided
        user_id = request.user_id or "guest"
        consultation_id = request.consultation_id or f"consult_{user_id}_{datetime.now().timestamp()}"

        # Check if doctor recommendation is needed
        needs_doctor = any(keyword in response_text.lower() for keyword in
                          ["specialist", "doctor", "consult", "see a", "visit"])

        return ChatResponse(
            message=response_text,
            consultation_id=consultation_id,
            requires_followup="?" in response_text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze-report", response_model=ReportAnalysisResponse)
async def analyze_report_endpoint(request: ReportAnalysisRequest):
    """Analyze medical reports and provide insights"""

    try:
        import json
        import re
        
        # Better prompt for structured JSON output
        prompt = f"""You are a medical report analysis expert. Analyze this medical report carefully.

====================
REPORT TYPE: {request.report_type}
====================
REPORT CONTENT (extracted from image):
{request.report_text}
====================

INSTRUCTIONS:
- Analyze the medical values and provide professional insights
- Use specific values from the report with units
- Compare with standard reference ranges
- If report content is unclear or unreadable, say so honestly

Return ONLY valid JSON (no markdown, no code blocks, no explanations):

{{
    "analysis": "Write 2-3 detailed paragraphs. Example: 'This {request.report_type} report shows tests for CRP, FSH, and Thyroid function. CRP level is 3 mg/L (elevated, normal: 0-2 mg/L), indicating possible inflammation. FSH is 52.95 mIU/mL (elevated), which may suggest... TSH is 2.15 mIU/L (normal range). Overall, the patient shows signs of...'",
    "abnormalities": [
        "CRP: 3 mg/L - Elevated (Normal: 0-2 mg/L) - May indicate inflammation",
        "FSH: 52.95 mIU/mL - High (Normal: 1-10 mIU/mL) - May indicate ovarian issues",
        "Add each abnormal value with its normal range"
    ],
    "recommendations": [
        "Consult an Endocrinologist for hormone evaluation",
        "Repeat CRP test in 2 weeks to monitor inflammation",
        "Consider thyroid antibody tests if symptoms persist",
        "Maintain healthy diet and regular exercise",
        "Follow up with primary care physician"
    ],
    "suggested_specialists": ["Endocrinologist", "Primary Care Physician", "Gynecologist"],
    "urgency_level": "medium"
}}

URGENCY GUIDELINES:
- "low": Normal results or minor variations
- "medium": Some abnormalities, consult doctor within 2-4 weeks
- "high": Significant abnormalities, see specialist within 1 week  
- "critical": Dangerous values, seek immediate care

If the extracted text is unreadable/gibberish:
{{
    "analysis": "The uploaded image could not be properly analyzed. The text extraction resulted in unclear content. This may be due to: poor image quality, low lighting, blurred text, or the image not containing a medical report. Please retake the photo ensuring: good lighting, clear focus, entire report visible, and text readable.",
    "abnormalities": [],
    "recommendations": ["Retake photo with better lighting", "Ensure camera is steady and focused", "Make sure all report text is visible"],
    "suggested_specialists": [],
    "urgency_level": "low"
}}"""

        response_text = await call_openrouter_ai(
            messages=[ChatMessage(role="user", content=prompt)],
            system_prompt=REPORT_ANALYSIS_SYSTEM_PROMPT
        )

        # Aggressive cleaning of response
        response_text = response_text.strip()
        
        # Remove ALL markdown code blocks
        response_text = re.sub(r'```json\s*', '', response_text, flags=re.IGNORECASE)
        response_text = re.sub(r'```JSON\s*', '', response_text, flags=re.IGNORECASE)
        response_text = re.sub(r'```\s*', '', response_text)
        response_text = response_text.strip()
        
        # Remove any text before first { and after last }
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end <= json_start:
            raise ValueError("No valid JSON found in AI response")
        
        json_str = response_text[json_start:json_end]
        
        # Remove any remaining markdown or extra characters
        json_str = re.sub(r'^[\s\S]*?\{', '{', json_str)
        json_str = re.sub(r'\}[\s\S]*?$', '}', json_str)
        
        print(f"Cleaned JSON: {json_str[:200]}...")
        
        # Parse JSON
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"JSON string: {json_str[:500]}...")
            
            # Try to fix common JSON issues
            # Remove trailing commas
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*]', ']', json_str)
            
            try:
                data = json.loads(json_str)
                print("JSON parsed after fixing!")
            except:
                # Fallback response
                data = {
                    "analysis": f"Report analysis for {request.report_type}. The AI response could not be properly parsed. Please try uploading a clearer image or contact support if the issue persists.",
                    "abnormalities": [],
                    "recommendations": ["Please try uploading a clearer image", "Ensure good lighting and focus"],
                    "suggested_specialists": [],
                    "urgency_level": "low"
                }
        
        # Validate data structure
        if not isinstance(data, dict):
            data = {
                "analysis": "Invalid response format from AI.",
                "abnormalities": [],
                "recommendations": [],
                "suggested_specialists": [],
                "urgency_level": "low"
            }
        
        # Ensure all required fields exist with proper types
        analysis_text = str(data.get("analysis", "Analysis completed."))
        abnormalities = data.get("abnormalities", [])
        recommendations = data.get("recommendations", [])
        specialists = data.get("suggested_specialists", [])
        urgency = str(data.get("urgency_level", "medium")).lower()
        
        # Validate arrays
        if not isinstance(abnormalities, list):
            abnormalities = []
        if not isinstance(recommendations, list):
            recommendations = []
        if not isinstance(specialists, list):
            specialists = []
        
        # Validate urgency level
        valid_urgency = ["low", "medium", "high", "critical"]
        if urgency not in valid_urgency:
            urgency = "medium"
        
        return ReportAnalysisResponse(
            analysis=analysis_text,
            abnormalities=abnormalities,
            recommendations=recommendations,
            suggested_specialists=specialists,
            urgency_level=urgency
        )

    except Exception as e:
        print(f"Error analyzing report: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to analyze report: {str(e)}")


@app.post("/api/consultation", response_model=ConsultationResponse)
async def consultation_endpoint(request: ChatRequest):
    """Complete medical consultation with diagnosis and recommendations"""
    
    try:
        prompt = f"""Based on this conversation, provide a comprehensive medical consultation:

Conversation:
{chr(10).join([f"{m.role}: {m.content}" for m in request.messages])}

Provide response in structured format with:
- Preliminary diagnosis
- Specialist recommendations
- Common medications (with dosages)
- Lifestyle advice
- Follow-up questions
- Recommended tests"""
        
        response_text = await call_openrouter_ai(
            messages=request.messages,
            system_prompt=CONSULTATION_SYSTEM_PROMPT
        )
        
        return ConsultationResponse(
            diagnosis=response_text,
            doctor_recommendations=[],
            medicine_recommendations=[],
            lifestyle_advice=[],
            followup_questions=[],
            tests_recommended=[]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/subscription/{user_id}", response_model=UserSubscription)
async def get_subscription(user_id: str):
    """Get user subscription status"""
    
    # In production, fetch from database
    return UserSubscription(
        user_id=user_id,
        is_pro=False,
        reports_used=0,
        reports_limit=3
    )


@app.post("/api/subscription/upgrade")
async def upgrade_subscription(user_id: str):
    """Upgrade to Pro subscription"""
    
    # In production, integrate with Stripe
    return {"message": "Upgrade initiated", "user_id": user_id}


# ============== Health Check ==============

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "running",
            "ai": "connected" if OPENROUTER_API_KEY else "not configured"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
