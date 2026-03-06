from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, date, time
from sqlalchemy.orm import Session
from models import get_db, User, Medication, WellnessScore, FamilyMember, SecondOpinion, HealthMetric, MedicineInteraction, MedicalReport
from auth import get_current_user, create_jwt_token, hash_password, verify_password
import httpx

router = APIRouter(prefix="/api", tags=["Health Features"])
security = HTTPBearer()


# ============== Pydantic Models ==============

class MedicationCreate(BaseModel):
    medicine_name: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    reminder_time: Optional[str] = None


class MedicationResponse(BaseModel):
    id: str
    medicine_name: str
    dosage: str
    frequency: str
    is_active: bool


class WellnessScoreCreate(BaseModel):
    mood: str
    sleep_hours: float
    water_intake: int
    exercise_minutes: int
    stress_level: int
    notes: Optional[str] = None


class WellnessScoreResponse(BaseModel):
    id: str
    score: int
    mood: str
    date: str
    created_at: str


class FamilyMemberCreate(BaseModel):
    name: str
    relation: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None


class FamilyMemberResponse(BaseModel):
    id: str
    name: str
    relation: str
    blood_group: Optional[str]
    medical_conditions: Optional[str]


class SecondOpinionCreate(BaseModel):
    original_diagnosis: str
    prescribed_medications: Optional[str] = None
    symptoms: str
    medical_reports: Optional[str] = None


class SecondOpinionResponse(BaseModel):
    id: str
    original_diagnosis: str
    ai_analysis: Optional[str]
    status: str
    created_at: str


class HealthMetricCreate(BaseModel):
    metric_type: str
    value: float
    unit: Optional[str] = None
    notes: Optional[str] = None


class HealthMetricResponse(BaseModel):
    id: str
    metric_type: str
    value: float
    unit: Optional[str]
    recorded_at: str


class MedicineInteractionCheck(BaseModel):
    medicines: List[str]


class EmergencyProfile(BaseModel):
    blood_group: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None


# ============== Medication Endpoints ==============

@router.post("/medications", response_model=MedicationResponse)
async def create_medication(
    medication: MedicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new medication with reminders"""
    
    db_med = Medication(
        user_id=current_user.id,
        **medication.dict()
    )
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    
    return MedicationResponse(
        id=db_med.id,
        medicine_name=db_med.medicine_name,
        dosage=db_med.dosage,
        frequency=db_med.frequency,
        is_active=db_med.is_active
    )


@router.get("/medications")
async def get_medications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active medications"""
    
    meds = db.query(Medication).filter(
        Medication.user_id == current_user.id,
        Medication.is_active == True
    ).all()
    
    return [{
        "id": m.id,
        "medicine_name": m.medicine_name,
        "dosage": m.dosage,
        "frequency": m.frequency,
        "instructions": m.instructions,
        "is_active": m.is_active
    } for m in meds]


@router.delete("/medications/{medication_id}")
async def delete_medication(
    medication_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a medication"""
    
    med = db.query(Medication).filter(
        Medication.id == medication_id,
        Medication.user_id == current_user.id
    ).first()
    
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    db.delete(med)
    db.commit()
    
    return {"message": "Medication deleted"}


# ============== Wellness Score Endpoints ==============

@router.post("/wellness", response_model=WellnessScoreResponse)
async def log_wellness(
    wellness: WellnessScoreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log daily wellness score"""
    
    # Calculate wellness score (0-100)
    score = int(
        (wellness.sleep_hours / 8 * 25) +
        (wellness.water_intake / 8 * 25) +
        (wellness.exercise_minutes / 30 * 25) +
        ((10 - wellness.stress_level) / 10 * 25)
    )
    score = min(100, max(0, score))
    
    db_wellness = WellnessScore(
        user_id=current_user.id,
        score=score,
        **wellness.dict()
    )
    db.add(db_wellness)
    db.commit()
    db.refresh(db_wellness)
    
    return WellnessScoreResponse(
        id=db_wellness.id,
        score=db_wellness.score,
        mood=db_wellness.mood,
        date=str(db_wellness.date),
        created_at=db_wellness.created_at.isoformat()
    )


@router.get("/wellness")
async def get_wellness_history(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get wellness score history"""
    
    from datetime import timedelta
    start_date = date.today() - timedelta(days=days)
    
    scores = db.query(WellnessScore).filter(
        WellnessScore.user_id == current_user.id,
        WellnessScore.date >= start_date
    ).order_by(WellnessScore.date.desc()).all()
    
    return [{
        "id": s.id,
        "score": s.score,
        "mood": s.mood,
        "date": str(s.date)
    } for s in scores]


# ============== Family Member Endpoints ==============

@router.post("/family", response_model=FamilyMemberResponse)
async def add_family_member(
    member: FamilyMemberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a family member"""
    
    db_member = FamilyMember(
        user_id=current_user.id,
        **member.dict()
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return FamilyMemberResponse(
        id=db_member.id,
        name=db_member.name,
        relation=db_member.relation,
        blood_group=db_member.blood_group,
        medical_conditions=db_member.medical_conditions
    )


@router.get("/family")
async def get_family_members(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all family members"""
    
    members = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).all()
    
    return [{
        "id": m.id,
        "name": m.name,
        "relation": m.relation,
        "blood_group": m.blood_group,
        "medical_conditions": m.medical_conditions,
        "allergies": m.allergies
    } for m in members]


# ============== Second Opinion Endpoints ==============

@router.post("/second-opinion", response_model=SecondOpinionResponse)
async def request_second_opinion(
    opinion: SecondOpinionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request AI second opinion on diagnosis"""
    
    db_opinion = SecondOpinion(
        user_id=current_user.id,
        **opinion.dict(),
        status="analyzing"
    )
    db.add(db_opinion)
    db.commit()
    db.refresh(db_opinion)
    
    # In production, call AI service here
    # For now, return pending status
    
    return SecondOpinionResponse(
        id=db_opinion.id,
        original_diagnosis=db_opinion.original_diagnosis,
        ai_analysis=db_opinion.ai_analysis,
        status=db_opinion.status,
        created_at=db_opinion.created_at.isoformat()
    )


@router.get("/second-opinion")
async def get_second_opinions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all second opinion requests"""
    
    opinions = db.query(SecondOpinion).filter(
        SecondOpinion.user_id == current_user.id
    ).order_by(SecondOpinion.created_at.desc()).all()
    
    return [{
        "id": o.id,
        "original_diagnosis": o.original_diagnosis,
        "ai_analysis": o.ai_analysis,
        "status": o.status,
        "created_at": o.created_at.isoformat()
    } for o in opinions]


# ============== Health Metrics Endpoints ==============

@router.post("/health-metrics", response_model=HealthMetricResponse)
async def log_health_metric(
    metric: HealthMetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a health metric (BP, sugar, weight, etc.)"""
    
    db_metric = HealthMetric(
        user_id=current_user.id,
        **metric.dict()
    )
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    
    return HealthMetricResponse(
        id=db_metric.id,
        metric_type=db_metric.metric_type,
        value=db_metric.value,
        unit=db_metric.unit,
        recorded_at=db_metric.recorded_at.isoformat()
    )


@router.get("/health-metrics")
async def get_health_metrics(
    metric_type: Optional[str] = None,
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get health metrics history"""
    
    from datetime import timedelta
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(HealthMetric).filter(
        HealthMetric.user_id == current_user.id,
        HealthMetric.recorded_at >= start_date
    )
    
    if metric_type:
        query = query.filter(HealthMetric.metric_type == metric_type)
    
    metrics = query.order_by(HealthMetric.recorded_at.desc()).all()
    
    return [{
        "id": m.id,
        "metric_type": m.metric_type,
        "value": m.value,
        "unit": m.unit,
        "recorded_at": m.recorded_at.isoformat()
    } for m in metrics]


# ============== Medicine Interaction Checker ==============

@router.post("/check-interactions")
async def check_medicine_interactions(
    check: MedicineInteractionCheck,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check for drug interactions"""
    
    interactions = []
    
    # Check database for known interactions
    for i, med1 in enumerate(check.medicines):
        for med2 in check.medicines[i+1:]:
            interaction = db.query(MedicineInteraction).filter(
                ((MedicineInteraction.medicine_1 == med1) & 
                 (MedicineInteraction.medicine_2 == med2)) |
                ((MedicineInteraction.medicine_1 == med2) & 
                 (MedicineInteraction.medicine_2 == med1))
            ).first()
            
            if interaction:
                interactions.append({
                    "medicine_1": med1,
                    "medicine_2": med2,
                    "severity": interaction.severity,
                    "description": interaction.description,
                    "recommendation": interaction.recommendation
                })
    
    # If no interactions found in DB, use AI to check
    if not interactions and len(check.medicines) > 1:
        # In production, call AI service
        interactions = [{
            "medicine_1": check.medicines[0],
            "medicine_2": check.medicines[1] if len(check.medicines) > 1 else "N/A",
            "severity": "unknown",
            "description": "No known interactions found in database. Consult your doctor.",
            "recommendation": "Always consult with a healthcare professional before combining medications."
        }]
    
    return {
        "medicines_checked": check.medicines,
        "interactions_found": len(interactions),
        "interactions": interactions
    }


# ============== Emergency Profile ==============

@router.get("/emergency-profile")
async def get_emergency_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get emergency medical profile"""
    
    return {
        "user_id": current_user.id,
        "name": current_user.full_name,
        "blood_group": current_user.blood_group,
        "emergency_contact": {
            "name": current_user.emergency_contact_name,
            "phone": current_user.emergency_contact_phone,
            "relation": current_user.emergency_contact_relation
        },
        "allergies": "Not specified",
        "medical_conditions": "Not specified"
    }


@router.put("/emergency-profile")
async def update_emergency_profile(
    profile: EmergencyProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update emergency medical profile"""
    
    current_user.blood_group = profile.blood_group
    current_user.emergency_contact_name = profile.emergency_contact_name
    current_user.emergency_contact_phone = profile.emergency_contact_phone
    current_user.emergency_contact_relation = profile.emergency_contact_relation
    
    db.commit()
    
    return {"message": "Emergency profile updated"}


# ============== Health Timeline ==============

@router.get("/timeline")
async def get_health_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complete health timeline"""
    
    from sqlalchemy import union_all
    
    # Get recent reports
    reports = db.query(MedicalReport).filter(
        MedicalReport.user_id == current_user.id
    ).order_by(MedicalReport.created_at.desc()).limit(10).all()
    
    timeline = []
    
    for r in reports:
        timeline.append({
            "type": "report",
            "title": f"{r.report_type} Analysis",
            "date": r.created_at.isoformat(),
            "details": r.analysis[:200] if r.analysis else None,
            "urgency": r.urgency_level
        })
    
    # Get wellness scores
    wellness = db.query(WellnessScore).filter(
        WellnessScore.user_id == current_user.id
    ).order_by(WellnessScore.date.desc()).limit(10).all()
    
    for w in wellness:
        timeline.append({
            "type": "wellness",
            "title": f"Wellness Score: {w.score}/100",
            "date": w.created_at.isoformat(),
            "details": f"Mood: {w.mood}, Sleep: {w.sleep_hours}h",
            "urgency": None
        })
    
    # Sort by date
    timeline.sort(key=lambda x: x["date"], reverse=True)
    
    return {"timeline": timeline[:20]}
