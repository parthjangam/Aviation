from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import Integer

from .database import Base


class FlightPrediction(Base):

    __tablename__ = "flight_predictions"

    # Composite Primary Key
    FL_DATE = Column(Date, primary_key=True)
    FL_NUMBER = Column(Integer, primary_key=True)

    AIRLINE = Column(Integer)

    ORIGIN = Column(Integer)

    DEST = Column(Integer)

    DEP_TIME = Column(Float)

    DEP_DELAY = Column(Float)

    TAXI_OUT = Column(Float)

    WHEELS_OFF = Column(Float)

    WHEELS_ON = Column(Float)

    ARR_DELAY = Column(Float)

    CANCELLED = Column(Float)

    DIVERTED = Column(Float)

    CRS_ELAPSED_TIME = Column(Float)

    DISTANCE = Column(Float)

    YEAR = Column(Integer)

    MONTH = Column(Integer)

    DAY = Column(Integer)

    DAY_OF_WEEK = Column(Integer)

    QUARTER = Column(Integer)

    IS_WEEKEND = Column(Integer)

    DEP_HOUR = Column(Integer)

    ARR_HOUR = Column(Integer)

    FLIGHT_CATEGORY = Column(Integer)

    PREDICTED_ARR_DELAY = Column(Float)