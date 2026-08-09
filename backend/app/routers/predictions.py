from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import get_predictions
from ..schemas import FlightPrediction

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.get(
    "/",
    response_model=list[FlightPrediction]
)
def read_predictions(
    db: Session = Depends(get_db)
):

    return get_predictions(db)