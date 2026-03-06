from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Text, ForeignKey, Float, Date, Time, Enum as SQLEnum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, date
import enum
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_PHCQb2qw9kyo@ep-bitter-mud-ahezrh7h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def generate_id():
    """Generate a unique ID"""
    return str(uuid.uuid4())


# ============== Enums ==============

class UrgencyLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class BloodGroup(str, enum.Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


# ============== Database Models ==============

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_id)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    phone = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    blood_group = Column(String)
    role = Column(String, default="patient")
    is_pro = Column(Boolean, default=False)
    reports_used = Column(Integer, default=0)
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    emergency_contact_relation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reports = relationship("MedicalReport", back_populates="user", cascade="all, delete-orphan")
    consultations = relationship("Consultation", back_populates="user", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="user", cascade="all, delete-orphan")
    wellness_scores = relationship("WellnessScore", back_populates="user", cascade="all, delete-orphan")
    family_members = relationship("FamilyMember", back_populates="user", cascade="all, delete-orphan")
    second_opinions = relationship("SecondOpinion", back_populates="user", cascade="all, delete-orphan")
    health_metrics = relationship("HealthMetric", back_populates="user", cascade="all, delete-orphan")


class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    report_type = Column(String)
    file_path = Column(String)
    file_name = Column(String)
    analysis = Column(Text)
    abnormalities = Column(Text)
    recommendations = Column(Text)
    urgency_level = Column(String)
    is_free_tier = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    session_id = Column(String, unique=True)
    messages = Column(Text)
    diagnosis = Column(Text)
    doctor_recommendations = Column(Text)
    medicine_recommendations = Column(Text)
    lifestyle_advice = Column(Text)
    followup_questions = Column(Text)
    tests_recommended = Column(Text)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="consultations")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    medicine_name = Column(String, nullable=False)
    dosage = Column(String)
    frequency = Column(String)
    duration = Column(String)
    instructions = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    reminder_time = Column(Time)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="medications")


class WellnessScore(Base):
    __tablename__ = "wellness_scores"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    score = Column(Integer)
    mood = Column(String)
    sleep_hours = Column(Float)
    water_intake = Column(Integer)
    exercise_minutes = Column(Integer)
    stress_level = Column(Integer)
    notes = Column(Text)
    date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wellness_scores")


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    relation = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    blood_group = Column(String)
    medical_conditions = Column(Text)
    allergies = Column(Text)
    medications = Column(Text)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="family_members")


class SecondOpinion(Base):
    __tablename__ = "second_opinions"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    original_diagnosis = Column(Text, nullable=False)
    prescribed_medications = Column(Text)
    symptoms = Column(Text)
    medical_reports = Column(Text)
    ai_analysis = Column(Text)
    ai_recommendations = Column(Text)
    confidence_score = Column(Integer)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="second_opinions")


class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    metric_type = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String)
    notes = Column(Text)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="health_metrics")


class MedicineInteraction(Base):
    __tablename__ = "medicine_interactions"

    id = Column(String, primary_key=True, default=generate_id)
    medicine_1 = Column(String, nullable=False)
    medicine_2 = Column(String, nullable=False)
    severity = Column(String)
    description = Column(Text)
    recommendation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    consultation_id = Column(String, ForeignKey("consultations.id"))
    medicine_name = Column(String)
    dosage = Column(String)
    frequency = Column(String)
    duration = Column(String)
    instructions = Column(Text)
    prescribed_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="prescriptions")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"))
    specialization = Column(String)
    qualifications = Column(String)
    experience_years = Column(Integer)
    hospital_affiliation = Column(String)
    consultation_fee = Column(Float)
    availability = Column(Text)
    rating = Column(Float, default=0.0)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    stripe_subscription_id = Column(String, unique=True)
    plan_type = Column(String)
    status = Column(String)
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


# ============== Database Functions ==============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables created successfully!")
