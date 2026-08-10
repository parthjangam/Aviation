import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import joblib


# ============================================================
# Configuration
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]
OUTPUT_FILE = BASE_DIR / "datasets" / "simulation" / "simulation_dataset.csv"

ROWS = 10000
SEED = 42

random.seed(SEED)


# ============================================================
# Load model categories
# ============================================================

MODEL_DIR = BASE_DIR / "models"

label_encoders = joblib.load(
    MODEL_DIR / "label_encoders.pkl"
)

airlines = list(
    label_encoders["AIRLINE"].classes_
)

airports = list(
    label_encoders["ORIGIN"].classes_
)


# ============================================================
# Generate flight records
# ============================================================

rows = []

start_date = datetime(2021, 1, 1)


for i in range(ROWS):

    flight_date = (
        start_date +
        timedelta(days=random.randint(0, 364))
    )

    airline = random.choice(airlines)

    origin = random.choice(airports)

    # Avoid origin == destination
    dest = random.choice(airports)

    while dest == origin:
        dest = random.choice(airports)

    flight_number = random.randint(1, 9999)

    # Departure time in HHMM format
    dep_hour = random.randint(0, 23)
    dep_minute = random.choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])

    dep_time = dep_hour * 100 + dep_minute

    # Departure delay
    dep_delay = round(
        random.gauss(8, 18),
        2
    )

    # Keep extreme values reasonable
    dep_delay = max(-15, min(dep_delay, 180))

    # Taxi-out
    taxi_out = round(
        max(
            5,
            random.gauss(17, 7)
        ),
        2
    )

    # Wheels off
    wheels_off_minutes = (
        dep_hour * 60 +
        dep_minute +
        max(5, int(taxi_out))
    )

    wheels_off_minutes %= 24 * 60

    wheels_off = (
        (wheels_off_minutes // 60) * 100 +
        (wheels_off_minutes % 60)
    )

    # Flight distance
    distance = round(
        random.uniform(80, 3000),
        2
    )

    # Flight duration based loosely on distance
    cruise_minutes = (
        distance / 7.5 +
        random.gauss(0, 15)
    )

    cruise_minutes = max(25, cruise_minutes)

    crs_elapsed_time = round(
        cruise_minutes + taxi_out,
        2
    )

    # Arrival delay correlated with departure delay
    arr_delay = (
        dep_delay * 0.65
        + (taxi_out - 17) * 0.8
        + random.gauss(0, 12)
    )

    arr_delay = round(
        max(-40, min(arr_delay, 240)),
        2
    )

    rows.append(
        {
            "FL_DATE": flight_date.strftime("%Y-%m-%d"),

            "AIRLINE": airline,

            "AIRLINE_DOT": airline,

            "AIRLINE_CODE": airline,

            "DOT_CODE": random.randint(10000, 99999),

            "FL_NUMBER": flight_number,

            "ORIGIN": origin,

            "ORIGIN_CITY": origin,

            "DEST": dest,

            "DEST_CITY": dest,

            "CRS_DEP_TIME": dep_time,

            "DEP_TIME": dep_time,

            "DEP_DELAY": dep_delay,

            "TAXI_OUT": taxi_out,

            "WHEELS_OFF": wheels_off,

            "WHEELS_ON": wheels_off,

            "TAXI_IN": round(
                max(2, random.gauss(7, 3)),
                2
            ),

            "CRS_ARR_TIME": 0,

            "ARR_TIME": 0,

            "ARR_DELAY": arr_delay,

            "CANCELLED": 0.0,

            "CANCELLATION_CODE": None,

            "DIVERTED": 0.0,

            "CRS_ELAPSED_TIME": crs_elapsed_time,

            "ELAPSED_TIME": crs_elapsed_time + arr_delay,

            "AIR_TIME": max(
                20,
                crs_elapsed_time - taxi_out - 7
            ),

            "DISTANCE": distance,

            "DELAY_DUE_CARRIER": 0.0,

            "DELAY_DUE_WEATHER": 0.0,

            "DELAY_DUE_NAS": 0.0,

            "DELAY_DUE_SECURITY": 0.0,

            "DELAY_DUE_LATE_AIRCRAFT": 0.0,
        }
    )


# ============================================================
# Save
# ============================================================

df = pd.DataFrame(rows)

OUTPUT_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)

df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("=" * 60)
print("Simulation Dataset Generated")
print("=" * 60)
print(f"Rows    : {len(df):,}")
print(f"Columns : {len(df.columns)}")
print(f"Output  : {OUTPUT_FILE}")
print()
print(df.head())
