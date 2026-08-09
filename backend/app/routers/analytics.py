from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas import (
    MonthlyDelay,
    AirlineDelay,
    HourlyDelay,
    RouteDelay,
)

from app.services.analytics_service import (
    get_monthly_delay,
    get_airline_delay,
    get_hourly_delay,
    get_top_routes,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/monthly",
    response_model=list[MonthlyDelay]
)
def monthly_delay(
    db: Session = Depends(get_db)
):
    return get_monthly_delay(db)


@router.get(
    "/airlines",
    response_model=list[AirlineDelay]
)
def airline_delay(
    db: Session = Depends(get_db)
):
    return get_airline_delay(db)


@router.get(
    "/hourly",
    response_model=list[HourlyDelay]
)
def hourly_delay(
    db: Session = Depends(get_db)
):
    return get_hourly_delay(db)


@router.get(
    "/routes",
    response_model=list[RouteDelay]
)
def top_routes(
    db: Session = Depends(get_db)
):
    return get_top_routes(db)