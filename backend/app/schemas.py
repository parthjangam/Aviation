from datetime import date

from pydantic import BaseModel


# ==========================================================
# Flight Prediction
# ==========================================================

class FlightPrediction(BaseModel):

    FL_DATE: date

    FL_NUMBER: int

    AIRLINE: int

    ORIGIN: int

    DEST: int

    DEP_DELAY: float

    ARR_DELAY: float

    DISTANCE: float

    YEAR: int

    MONTH: int

    DAY: int

    PREDICTED_ARR_DELAY: float

    class Config:

        from_attributes = True


# ==========================================================
# Dashboard Summary
# ==========================================================

class Summary(BaseModel):

    total_flights: int

    average_delay: float

    average_prediction: float


# ==========================================================
# Monthly Delay
# ==========================================================

class MonthlyDelay(BaseModel):

    month: int

    average_delay: float


# ==========================================================
# Airline Delay
# ==========================================================

class AirlineDelay(BaseModel):

    airline: int

    average_delay: float


# ==========================================================
# Hourly Delay
# ==========================================================

class HourlyDelay(BaseModel):

    hour: int

    average_delay: float


# ==========================================================
# Route Delay
# ==========================================================

class RouteDelay(BaseModel):

    origin: int

    destination: int

    average_delay: float


# ==========================================================
# Dashboard Response
# ==========================================================

class DashboardResponse(BaseModel):

    summary: Summary

    monthly: list[MonthlyDelay]

    airlines: list[AirlineDelay]

    hourly: list[HourlyDelay]

    routes: list[RouteDelay]