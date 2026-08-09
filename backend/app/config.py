from pathlib import Path
import os

from dotenv import load_dotenv

# ==========================================================
# Project Root
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================================
# Load Environment Variables
# ==========================================================

load_dotenv(BASE_DIR / ".env")

# ==========================================================
# Configuration Variables
# ==========================================================

DATABASE_URL = os.getenv("DATABASE_URL")

HOST = os.getenv("HOST")

PORT = int(os.getenv("PORT"))

DEBUG = os.getenv("DEBUG") == "True"