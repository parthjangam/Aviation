from sqlalchemy.orm import Session

from .models import FlightPrediction


def get_predictions(
    db: Session,
    limit: int = 100
):

    return (
        db.query(FlightPrediction)
        .limit(limit)
        .all()
    )