from sqlalchemy import create_engine
import pandas as pd

# ==========================================================
# PostgreSQL Connection
# ==========================================================

DATABASE_URL = (
    "postgresql://aviation:aviation@localhost:5432/aviation"
)

engine = create_engine(DATABASE_URL)

# ==========================================================
# Write Predictions
# ==========================================================

def write_postgres(df: pd.DataFrame):

    df.to_sql(
        "flight_predictions",
        engine,
        if_exists="append",
        index=False
    )

    print("✓ PostgreSQL write completed.")