from sqlalchemy import func

from app.models import FlightPrediction

from app.services.analytics_service import (
    get_monthly_delay,
    get_airline_delay,
    get_hourly_delay,
    get_top_routes,
)


def get_dashboard(db):

    total_flights = (
        db.query(
            func.count(
                FlightPrediction.FL_NUMBER
            )
        )
        .scalar()
    )

    average_delay = (
        db.query(
            func.avg(
                FlightPrediction.ARR_DELAY
            )
        )
        .scalar()
    )

    average_prediction = (
        db.query(
            func.avg(
                FlightPrediction.PREDICTED_ARR_DELAY
            )
        )
        .scalar()
    )

    return {

        "summary": {

            "total_flights": total_flights,

            "average_delay": round(
                average_delay,
                2
            ),

            "average_prediction": round(
                average_prediction,
                2
            )

        },

        "monthly": get_monthly_delay(db),

        "airlines": get_airline_delay(db),

        "hourly": get_hourly_delay(db),

        "routes": get_top_routes(db)

    }