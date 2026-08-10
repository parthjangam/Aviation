from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.functions import from_json

from schema import flight_schema

from config import (
    APP_NAME,
    KAFKA_BOOTSTRAP_SERVER,
    KAFKA_TOPIC,
    CHECKPOINT_LOCATION,
    OUTPUT_MODE
)

# ==========================================================
# Create Spark Session
# ==========================================================

spark = (
    SparkSession
    .builder
    .appName(APP_NAME)
    .master("local[*]")

    .config(
        "spark.sql.warehouse.dir",
        "hdfs://localhost:9000/user/hive/warehouse"
    )

    .enableHiveSupport()

    .getOrCreate()
)

spark.sparkContext.setLogLevel("ERROR")

print("=" * 60)
print("Testing Hive Connection...")
print("=" * 60)

spark.sql("SHOW DATABASES").show()

spark.sparkContext.setLogLevel("ERROR")

print("=" * 60)
print("Checking Hive Connection...")
print("=" * 60)

spark.sql("SHOW DATABASES").show()

print("=" * 60)
print("Flight Streaming Started")
print("=" * 60)

# ==========================================================
# Read Stream From Kafka
# ==========================================================

flight_stream = (
    spark
    .readStream
    .format("kafka")
    .option(
        "kafka.bootstrap.servers",
        KAFKA_BOOTSTRAP_SERVER
    )
    .option(
        "subscribe",
        KAFKA_TOPIC
    )
    .option(
        "startingOffsets",
        "latest"
    )
    .load()
)

# ==========================================================
# Convert Kafka Bytes -> String
# ==========================================================

flight_stream = (
    flight_stream
    .selectExpr(
        "CAST(value AS STRING) AS json"
    )
)

# ==========================================================
# Convert JSON -> Structured DataFrame
# ==========================================================

flight_stream = (
    flight_stream
    .select(
        from_json(
            col("json"),
            flight_schema
        ).alias("flight_data")
    )
    .select("flight_data.*")
)

# ==========================================================
# Print Streaming Data
# ==========================================================
from process_batch import process_batch

query = (
    flight_stream
    .writeStream
    .foreachBatch(process_batch)
    .option(
        "checkpointLocation",
        CHECKPOINT_LOCATION
    )
    .start()
)

# ==========================================================
# Keep Stream Running
# ==========================================================

query.awaitTermination()
