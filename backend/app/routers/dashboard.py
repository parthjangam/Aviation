from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.logger import logger
from app.schemas import DashboardResponse
from app.services.dashboard_service import get_dashboard

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/",
    response_model=DashboardResponse
)
def dashboard(
    db: Session = Depends(get_db)
):

    logger.info(
        "Dashboard API request received."
    )

    return get_dashboard(db)