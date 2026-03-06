# MediCare AI 🏥🤖

**AI-Powered Healthcare Assistant Platform**

A comprehensive medical AI platform that provides instant health consultations, medical report analysis, medication tracking, and personalized wellness monitoring using advanced AI technology.

---

## 🌟 Why MediCare AI?

### The Problem
- **Limited Healthcare Access**: Millions lack immediate access to medical guidance
- **Expensive Consultations**: Doctor visits are costly for routine health queries
- **Medical Report Confusion**: Patients struggle to understand lab reports
- **Medication Mismanagement**: People forget doses or combine dangerous medications
- **No Continuous Health Tracking**: Lack of integrated wellness monitoring

### The MediCare AI Solution
✅ **24/7 Instant Medical Guidance** - Get AI-powered health advice anytime  
✅ **Affordable Healthcare** - Free tier for basic consultations  
✅ **Medical Report Analysis** - Upload lab reports, get instant insights  
✅ **Smart Medication Tracker** - Track medicines with interaction warnings  
✅ **Wellness Monitoring** - Daily health scores and trend tracking  
✅ **Global Medicine Database** - Brand names across USA, UK, EU, Asia  

---

## 🚀 Key Features

### 🩺 AI Medical Chatbot
- **Smart Consultation Flow**: Collects patient info → Asks cross-questions → Provides diagnosis → Recommends medicines
- **Global Medicine Recommendations**: Generic names + regional brand names (Tylenol/Panadol/Calpol)
- **Emergency Detection**: Identifies critical symptoms requiring immediate care
- **Powered by**: Meta Llama 3 70B via OpenRouter

### 📄 Medical Report Analysis
- **OCR Integration**: Extract text from uploaded lab report images (Tesseract.js)
- **AI Analysis**: Identifies abnormalities, compares with normal ranges
- **Medicine Suggestions**: Recommends medications for identified conditions
- **Specialist Recommendations**: Suggests which doctor to consult
- **Urgency Levels**: Low/Medium/High/Critical flagging

### 💊 Medication Management
- **Track Medications**: Log all current medications with dosages
- **Interaction Checker**: Warns about dangerous drug combinations
- **Reminders**: Set daily reminders for medication times
- **Instructions**: Detailed usage guidelines and warnings

### 📊 Wellness Tracking
- **Daily Score**: 0-100 wellness score calculation
- **Metrics**: Sleep, water intake, exercise, stress levels
- **Mood Tracking**: Log daily emotional state
- **Health Timeline**: Visual history of all health data

### 👨‍👩‍👧 Family Health Profiles
- **Multiple Members**: Manage health records for entire family
- **Medical History**: Track conditions, allergies, medications
- **Blood Groups**: Emergency-ready medical information

### 🔄 Second Opinion Service
- **AI Analysis**: Get AI perspective on doctor's diagnosis
- **Medication Review**: Evaluate prescribed treatments
- **Confidence Scoring**: AI confidence in alternative diagnosis

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python API framework |
| **SQLAlchemy** | ORM for database operations |
| **PostgreSQL** | Production database (NeonDB) |
| **bcrypt** | Password hashing & security |
| **PyJWT** | JWT-based authentication |
| **httpx** | Async HTTP client for AI API calls |
| **Pydantic** | Data validation & serialization |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with SSR |
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible UI components |
| **Framer Motion** | Smooth animations |
| **Tesseract.js** | Client-side OCR for reports |
| **jsPDF** | PDF report generation |
| **Zod** | Schema validation |

### AI & APIs
- **OpenRouter AI**: Meta Llama 3 70B Instruct model
- **Medical Prompts**: Custom system prompts for consultations, report analysis

---

## 📁 Project Structure

```
MediCare AI/
├── backend/
│   ├── main.py              # FastAPI app, AI chat, report analysis endpoints
│   ├── auth.py              # JWT authentication (register/login)
│   ├── models.py            # SQLAlchemy database models (10+ tables)
│   ├── health_routes.py     # Medications, wellness, family, metrics APIs
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages (chat, reports, dashboard)
    │   ├── components/      # React components (UI, forms, chat)
    │   ├── contexts/        # React contexts (auth, state management)
    │   └── lib/             # Utilities, API clients
    ├── package.json         # Node.js dependencies
    └── .env.local           # Frontend environment variables
```

---

## 🗄️ Database Schema

### Core Tables
- **users** - Patient accounts, profiles, emergency contacts
- **medical_reports** - Uploaded reports with AI analysis
- **consultations** - Chat sessions with AI doctor
- **medications** - Active/past medication records
- **wellness_scores** - Daily wellness tracking
- **family_members** - Family health profiles
- **second_opinions** - AI diagnosis reviews
- **health_metrics** - BP, sugar, weight logs
- **medicine_interactions** - Drug interaction database
- **doctors** - Specialist directory (future)
- **subscriptions** - Pro/Free tier management

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL database (or use NeonDB free tier)
- OpenRouter API key

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your API keys and database URL

# Run the server
uvicorn main:app --reload
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit .env.local with backend URL

# Run development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (.env)
```env
OPENROUTER_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
AI_MODEL=meta-llama/llama-3-70b-instruct
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Health Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | AI medical consultation |
| POST | `/api/analyze-report` | Upload & analyze medical report |
| POST | `/api/medications` | Add medication |
| GET | `/api/medications` | List medications |
| POST | `/api/wellness` | Log wellness score |
| GET | `/api/wellness` | Get wellness history |
| POST | `/api/family` | Add family member |
| GET | `/api/family` | List family members |
| POST | `/api/check-interactions` | Check drug interactions |
| GET | `/api/timeline` | Complete health timeline |

---

## 🎯 Use Cases

### 1. Instant Symptom Checker
> User: "I have a headache and fever"  
> AI: Asks about duration, severity, allergies → Recommends Paracetamol with regional brands → Provides dosage instructions

### 2. Lab Report Analysis
> User uploads blood test image → AI extracts values → Flags high CRP, low hemoglobin → Suggests anti-inflammatory meds → Recommends seeing a General Physician

### 3. Medication Safety
> User logs: Aspirin + Warfarin → System detects dangerous interaction → Shows "Increased bleeding risk" warning → Recommends consulting doctor immediately

### 4. Family Health Management
> Parent creates profiles for children → Tracks vaccinations, allergies → Gets reminders for medications → Monitors wellness scores over time

---

## ⚠️ Important Disclaimers

- **Not a Replacement for Professional Care**: AI provides guidance, not definitive diagnosis
- **Emergency Protocol**: Severe symptoms trigger immediate "Call emergency services" warning
- **Privacy**: All health data encrypted, stored securely
- **Consultation Required**: Always recommend doctor visit for persistent symptoms

---

## 🔮 Future Enhancements

- [ ] **Telemedicine Integration**: Video calls with real doctors
- [ ] **Prescription Upload**: Scan & digitize paper prescriptions
- [ ] **Pharmacy Locator**: Find nearby pharmacies with medicine availability
- [ ] **Health Insurance**: Connect with insurance providers
- [ ] **Multi-language Support**: Hindi, Spanish, French, German
- [ ] **Wearable Integration**: Sync with Fitbit, Apple Watch
- [ ] **Appointment Booking**: Schedule doctor appointments directly
- [ ] **Medicine Delivery**: Order medications via partner pharmacies

---

## 📄 License

MIT License - Built for educational and healthcare accessibility purposes

---

## 👨‍💻 Development

### Running Tests
```bash
# Backend
pytest

# Frontend
npm test
```

### Code Quality
```bash
# Backend lint
flake8 backend/

# Frontend lint
npm run lint
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support

For issues, questions, or partnerships:
- **GitHub Issues**: [Create an issue]
- **Email**: support@medicareai.com (placeholder)

---

**Made with ❤️ for Healthcare Accessibility**

*"Healthcare is a right, not a privilege. AI can help make it accessible to all."*
