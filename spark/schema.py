from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    IntegerType,
    DoubleType
)

# ============================================================
# Flight Data Schema
# ============================================================

flight_schema = StructType([

    StructField("FL_DATE", StringType(), True),

    StructField("AIRLINE", StringType(), True),

    StructField("AIRLINE_DOT", StringType(), True),

    StructField("AIRLINE_CODE", StringType(), True),

    StructField("DOT_CODE", IntegerType(), True),

    StructField("FL_NUMBER", IntegerType(), True),

    StructField("ORIGIN", StringType(), True),

    StructField("ORIGIN_CITY", StringType(), True),

    StructField("DEST", StringType(), True),

    StructField("DEST_CITY", StringType(), True),

    StructField("CRS_DEP_TIME", IntegerType(), True),

    StructField("DEP_TIME", DoubleType(), True),

    StructField("DEP_DELAY", DoubleType(), True),

    StructField("TAXI_OUT", DoubleType(), True),

    StructField("WHEELS_OFF", DoubleType(), True),

    StructField("WHEELS_ON", DoubleType(), True),

    StructField("TAXI_IN", DoubleType(), True),

    StructField("CRS_ARR_TIME", IntegerType(), True),

    StructField("ARR_TIME", DoubleType(), True),

    StructField("ARR_DELAY", DoubleType(), True),

    StructField("CANCELLED", DoubleType(), True),

    StructField("CANCELLATION_CODE", StringType(), True),

    StructField("DIVERTED", DoubleType(), True),

    StructField("CRS_ELAPSED_TIME", DoubleType(), True),

    StructField("ELAPSED_TIME", DoubleType(), True),

    StructField("AIR_TIME", DoubleType(), True),

    StructField("DISTANCE", DoubleType(), True),

    StructField("DELAY_DUE_CARRIER", DoubleType(), True),

    StructField("DELAY_DUE_WEATHER", DoubleType(), True),

    StructField("DELAY_DUE_NAS", DoubleType(), True),

    StructField("DELAY_DUE_SECURITY", DoubleType(), True),

    StructField("DELAY_DUE_LATE_AIRCRAFT", DoubleType(), True)

])

# ============================================================
# Feature Columns
# (Used by Feature Engineering & Prediction)
# ============================================================

FEATURE_COLUMNS = [

    "AIRLINE",
    "AIRLINE_CODE",
    "ORIGIN",
    "DEST",
    "CRS_DEP_TIME",
    "DEP_DELAY",
    "TAXI_OUT",
    "CRS_ELAPSED_TIME",
    "DISTANCE"

]

# ============================================================
# Target Column
# ============================================================

TARGET_COLUMN = "ARR_DELAY"

# ============================================================
# Categorical Columns
# ============================================================

CATEGORICAL_COLUMNS = [

    "AIRLINE",
    "AIRLINE_CODE",
    "ORIGIN",
    "DEST"

]

# ============================================================
# Numerical Columns
# ============================================================

NUMERICAL_COLUMNS = [

    "CRS_DEP_TIME",
    "DEP_DELAY",
    "TAXI_OUT",
    "CRS_ELAPSED_TIME",
    "DISTANCE"

]

# ============================================================
# Columns to Keep
# ============================================================

OUTPUT_COLUMNS = [

    "FL_DATE",
    "AIRLINE",
    "AIRLINE_CODE",
    "FL_NUMBER",
    "ORIGIN",
    "DEST",
    "DEP_DELAY",
    "ARR_DELAY",
    "DISTANCE"

]