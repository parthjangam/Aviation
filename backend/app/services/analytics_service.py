from sqlalchemy import func

from app.models import FlightPrediction


# ==========================================================
# Monthly Delay
# ==========================================================

def get_monthly_delay(db):

    result = (

        db.query(

            FlightPrediction.MONTH,

            func.avg(
                FlightPrediction.ARR_DELAY
            ).label("average_delay")

        )

        .group_by(
            FlightPrediction.MONTH
        )

        .order_by(
            FlightPrediction.MONTH
        )

        .all()

    )

    return [

        {

            "month": month,

            "average_delay": round(delay, 2)

        }

        for month, delay in result

    ]


# ==========================================================
# Airline Delay
# ==========================================================

def get_airline_delay(db):

    result = (

        db.query(

            FlightPrediction.AIRLINE,

            func.avg(
                FlightPrediction.ARR_DELAY
            ).label("average_delay")

        )

        .group_by(
            FlightPrediction.AIRLINE
        )

        .order_by(
            func.avg(
                FlightPrediction.ARR_DELAY
            ).desc()
        )

        .all()

    )

    return [

        {

            "airline": airline,

            "average_delay": round(delay, 2)

        }

        for airline, delay in result

    ]


# ==========================================================
# Hourly Delay
# ==========================================================

def get_hourly_delay(db):

    result = (

        db.query(

            FlightPrediction.DEP_HOUR,

            func.avg(
                FlightPrediction.ARR_DELAY
            ).label("average_delay")

        )

        .group_by(
            FlightPrediction.DEP_HOUR
        )

        .order_by(
            FlightPrediction.DEP_HOUR
        )

        .all()

    )

    return [

        {

            "hour": hour,

            "average_delay": round(delay, 2)

        }

        for hour, delay in result

    ]


# ==========================================================
# Top Routes
# ==========================================================

def get_top_routes(db):

    result = (

        db.query(

            FlightPrediction.ORIGIN,

            FlightPrediction.DEST,

            func.avg(
                FlightPrediction.ARR_DELAY
            ).label("average_delay")

        )

        .group_by(

            FlightPrediction.ORIGIN,

            FlightPrediction.DEST

        )

        .order_by(

            func.avg(
                FlightPrediction.ARR_DELAY
            ).desc()

        )

        .limit(10)

        .all()

    )

    return [

        {

            "origin": origin,

            "destination": dest,

            "average_delay": round(delay, 2)

        }

        for origin, dest, delay in result

    ]