from pathlib import Path


# ==========================================================
# Output Directory
# ==========================================================

OUTPUT_DIR = Path("/tmp/flight_predictions")


# ==========================================================
# Write Parquet
# ==========================================================

def write_parquet(df):

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    df.to_parquet(
        OUTPUT_DIR,
        engine="pyarrow",
        compression="snappy",
        partition_cols=[
            "YEAR",
            "MONTH"
        ],
        index=False
    )

    print("✓ Parquet files written successfully.")