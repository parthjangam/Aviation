from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.exceptions import global_exception_handler
from app.logger import logger

from .routers.predictions import router as prediction_router
from .routers.analytics import router as analytics_router
from .routers.dashboard import router as dashboard_router
from .routers.metadata import router as metadata_router


app = FastAPI(

    title="Aviation Analytics API",

    description="""
Streaming Aviation Analytics Platform

Features

• Flight Delay Prediction

• Dashboard Analytics

• Monthly Statistics

• Airline Performance

• Route Analytics

• Hourly Delay Analysis
""",

    version="1.0.0"

)

# ==========================================================
# Global Exception Handler
# ==========================================================

app.add_exception_handler(
    Exception,
    global_exception_handler
)

# ==========================================================
# CORS Middleware
# ==========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)

# ==========================================================
# Routers
# ==========================================================

app.include_router(
    prediction_router
)

app.include_router(
    analytics_router
)

app.include_router(
    dashboard_router
)

app.include_router(
    metadata_router
)

# ==========================================================
# Startup Log
# ==========================================================

logger.info(
    "Aviation Analytics API Started Successfully"
)


@app.get("/")
def home():

    return {

        "message": "Aviation Analytics API Running 🚀"

    }