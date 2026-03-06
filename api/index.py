# Vercel Serverless Function Entry Point
# This file wraps the FastAPI app for Vercel serverless deployment

from fastapi import FastAPI
from mangum import Mangum
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the FastAPI app
from main import app

# Create ASGI handler for Vercel
handler = Mangum(app, lifespan="off")
