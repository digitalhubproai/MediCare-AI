"""
Script to reset the database - drops all tables with CASCADE
Run this once to clean up old tables
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine with isolation level for proper transaction handling
engine = create_engine(DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://"))

def reset_database():
    """Drop all tables with CASCADE"""
    with engine.connect() as conn:
        # Enable autocommit for DDL operations
        conn.execution_options(isolation_level="AUTOCOMMIT")
        
        # Drop all tables with CASCADE
        tables = [
            "invoices",
            "appointments", 
            "medical_records",
            "doctors",
            "subscriptions",
            "prescriptions",
            "consultations",
            "medical_reports",
            "users"
        ]
        
        for table in tables:
            try:
                conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                print(f"Dropped table: {table}")
            except Exception as e:
                print(f"Error dropping {table}: {e}")
        
        print("\n✅ Database reset complete!")

if __name__ == "__main__":
    reset_database()
