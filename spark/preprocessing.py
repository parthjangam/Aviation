from pyspark.sql.functions import (
    col,
    to_date,
    year,
    month,
    dayofmonth,
    dayofweek,
    quarter,
    when,
    floor
)

# ==========================================================
# Columns not required for ML model
# ==========================================================

UNUSED_COLUMNS = [

    "AIRLINE_DOT",
    "AIRLINE_CODE",
    "DOT_CODE",
    "ORIGIN_CITY",
    "DEST_CITY",
    "CRS_DEP_TIME",
    "TAXI_IN",
    "CRS_ARR_TIME",
    "ARR_TIME",
    "CANCELLATION_CODE",
    "ELAPSED_TIME",
    "AIR_TIME",
    "DELAY_DUE_CARRIER",
    "DELAY_DUE_WEATHER",
    "DELAY_DUE_NAS",
    "DELAY_DUE_SECURITY",
    "DELAY_DUE_LATE_AIRCRAFT"

]

# ==========================================================
# Required columns
# ==========================================================

REQUIRED_COLUMNS = [

    "AIRLINE",
    "FL_NUMBER",
    "ORIGIN",
    "DEST",
    "DEP_TIME",
    "DEP_DELAY",
    "TAXI_OUT",
    "WHEELS_OFF",
    "ARR_DELAY",
    "CRS_ELAPSED_TIME",
    "DISTANCE"

]

# ==========================================================
# Drop unwanted columns
# ==========================================================

def drop_unused_columns(df):

    return df.drop(*UNUSED_COLUMNS)

# ==========================================================
# Remove cancelled/diverted flights
# ==========================================================

def remove_invalid_flights(df):

    return (
        df
        .filter(col("CANCELLED") == 0)
        .filter(col("DIVERTED") == 0)
    )

# ==========================================================
# Remove missing values
# ==========================================================

def remove_missing_values(df):

    return df.dropna(subset=REQUIRED_COLUMNS)

# ==========================================================
# Date features
# ==========================================================

def create_date_features(df):

    df = df.withColumn(
        "FL_DATE",
        to_date("FL_DATE", "yyyy-MM-dd")
    )

    df = df.withColumn("YEAR", year("FL_DATE"))

    df = df.withColumn("MONTH", month("FL_DATE"))

    df = df.withColumn("DAY", dayofmonth("FL_DATE"))

    df = df.withColumn("DAY_OF_WEEK", dayofweek("FL_DATE"))

    df = df.withColumn("QUARTER", quarter("FL_DATE"))

    df = df.withColumn(
        "IS_WEEKEND",
        when(
            dayofweek("FL_DATE").isin(1, 7),
            1
        ).otherwise(0)
    )

    return df

# ==========================================================
# Time features
# ==========================================================

def create_time_features(df):

    df = df.withColumn(
        "DEP_HOUR",
        floor(col("DEP_TIME") / 100)
    )

    df = df.withColumn(
        "ARR_HOUR",
        floor(col("WHEELS_OFF") / 100)
    )

    return df

# ==========================================================
# Flight category
# ==========================================================

def create_flight_category(df):

    return (
        df.withColumn(
            "FLIGHT_CATEGORY",
            when(col("DISTANCE") < 500, "Short")
            .when(col("DISTANCE") < 1500, "Medium")
            .otherwise("Long")
        )
    )

# ==========================================================
# Main preprocessing pipeline
# ==========================================================

def preprocess(df):

    df = drop_unused_columns(df)

    df = remove_invalid_flights(df)

    df = remove_missing_values(df)

    df = create_date_features(df)

    df = create_time_features(df)

    df = create_flight_category(df)

    return df