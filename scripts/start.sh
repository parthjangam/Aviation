#!/usr/bin/env bash

set -u

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

HADOOP_HOME="/opt/hadoop"
KAFKA_HOME="/opt/kafka"
SPARK_HOME="/opt/spark"

KAFKA_BOOTSTRAP="localhost:9092"
KAFKA_TOPIC="flight_stream"

PYTHON="$PROJECT_ROOT/backend/venv/bin/python"

RUNTIME_DIR="$PROJECT_ROOT/runtime"

SPARK_PID_FILE="$RUNTIME_DIR/spark.pid"
PRODUCER_PID_FILE="$RUNTIME_DIR/producer.pid"

SPARK_LOG="$PROJECT_ROOT/spark/streaming.log"
PRODUCER_LOG="$PROJECT_ROOT/kafka/producer.log"

mkdir -p "$RUNTIME_DIR"

cd "$PROJECT_ROOT"

echo "=================================================="
echo "        AVIATION ANALYTICS PLATFORM"
echo "              STARTUP SCRIPT"
echo "=================================================="
echo

# ==================================================
# 1. DOCKER
# ==================================================

echo "[1/6] Starting Docker application stack..."

if docker compose up -d; then
    echo "✓ Docker stack started."
else
    echo "ERROR: Docker Compose failed."
    exit 1
fi

echo

# ==================================================
# 2. HADOOP
# ==================================================

echo "[2/6] Checking Hadoop..."

if jps | grep -q "NameNode"; then
    echo "✓ Hadoop NameNode already running."
else
    echo "Starting HDFS..."

    "$HADOOP_HOME/sbin/start-dfs.sh"

    sleep 3
fi

if jps | grep -q "ResourceManager"; then
    echo "✓ YARN already running."
else
    echo "Starting YARN..."

    "$HADOOP_HOME/sbin/start-yarn.sh"

    sleep 3
fi

echo

# ==================================================
# 3. KAFKA
# ==================================================

echo "[3/6] Checking Kafka..."

if pgrep -f "kafka.Kafka" >/dev/null; then

    echo "✓ Kafka broker already running."

else

    echo "Starting Kafka..."

    nohup "$KAFKA_HOME/bin/kafka-server-start.sh" \
        "$KAFKA_HOME/config/server.properties" \
        > "$KAFKA_HOME/kafka-startup.log" 2>&1 &

    KAFKA_PID=$!

    echo "Kafka PID: $KAFKA_PID"

    echo "Waiting for Kafka..."

    KAFKA_READY=false

    for i in {1..30}; do

        if "$KAFKA_HOME/bin/kafka-topics.sh" \
            --bootstrap-server "$KAFKA_BOOTSTRAP" \
            --list >/dev/null 2>&1; then

            KAFKA_READY=true
            break

        fi

        sleep 2

    done

    if [ "$KAFKA_READY" = true ]; then

        echo "✓ Kafka is ready."

    else

        echo "ERROR: Kafka failed to start."
        echo "Check:"
        echo "$KAFKA_HOME/kafka-startup.log"

        exit 1

    fi

fi

echo

# ==================================================
# 4. KAFKA TOPIC
# ==================================================

echo "[4/6] Checking Kafka topic..."

if "$KAFKA_HOME/bin/kafka-topics.sh" \
    --bootstrap-server "$KAFKA_BOOTSTRAP" \
    --list 2>/dev/null |
    grep -qx "$KAFKA_TOPIC"; then

    echo "✓ Kafka topic '$KAFKA_TOPIC' exists."

else

    echo "Creating Kafka topic '$KAFKA_TOPIC'..."

    "$KAFKA_HOME/bin/kafka-topics.sh" \
        --bootstrap-server "$KAFKA_BOOTSTRAP" \
        --create \
        --topic "$KAFKA_TOPIC" \
        --partitions 1 \
        --replication-factor 1

    echo "✓ Kafka topic created."

fi

echo

# ==================================================
# 5. SPARK STREAMING
# ==================================================

echo "[5/6] Checking Spark Streaming..."

SPARK_RUNNING=false

if [ -f "$SPARK_PID_FILE" ]; then

    SPARK_PID=$(cat "$SPARK_PID_FILE")

    if kill -0 "$SPARK_PID" 2>/dev/null; then
        SPARK_RUNNING=true
    else
        rm -f "$SPARK_PID_FILE"
    fi

fi

# Fallback check in case PID file disappeared

if [ "$SPARK_RUNNING" = false ]; then

    EXISTING_SPARK_PID=$(
        pgrep -f \
        "org.apache.spark.deploy.SparkSubmit.*$PROJECT_ROOT/spark/streaming.py" |
        head -1
    )

    if [ -n "$EXISTING_SPARK_PID" ]; then

        SPARK_PID="$EXISTING_SPARK_PID"

        echo "$SPARK_PID" > "$SPARK_PID_FILE"

        SPARK_RUNNING=true

    fi

fi

if [ "$SPARK_RUNNING" = true ]; then

    echo "✓ Spark Streaming already running."
    echo "PID: $SPARK_PID"

else

    echo "Starting Spark Streaming..."

    nohup "$SPARK_HOME/bin/spark-submit" \
        --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.6 \
        "$PROJECT_ROOT/spark/streaming.py" \
        > "$SPARK_LOG" 2>&1 &

    SPARK_PID=$!

    echo "$SPARK_PID" > "$SPARK_PID_FILE"

    sleep 5

    if kill -0 "$SPARK_PID" 2>/dev/null; then

        echo "✓ Spark Streaming started."
        echo "PID: $SPARK_PID"

    else

        echo "ERROR: Spark Streaming failed to start."
        echo "Check:"
        echo "$SPARK_LOG"

        rm -f "$SPARK_PID_FILE"

        exit 1

    fi

fi

echo

# ==================================================
# 6. KAFKA PRODUCER
# ==================================================

echo "[6/6] Checking Kafka Producer..."

PRODUCER_RUNNING=false

if [ -f "$PRODUCER_PID_FILE" ]; then

    PRODUCER_PID=$(cat "$PRODUCER_PID_FILE")

    if kill -0 "$PRODUCER_PID" 2>/dev/null; then
        PRODUCER_RUNNING=true
    else
        rm -f "$PRODUCER_PID_FILE"
    fi

fi

# Fallback process check

if [ "$PRODUCER_RUNNING" = false ]; then

    EXISTING_PRODUCER_PID=$(
        pgrep -f \
        "$PROJECT_ROOT/kafka/producer.py" |
        head -1
    )

    if [ -n "$EXISTING_PRODUCER_PID" ]; then

        PRODUCER_PID="$EXISTING_PRODUCER_PID"

        echo "$PRODUCER_PID" > "$PRODUCER_PID_FILE"

        PRODUCER_RUNNING=true

    fi

fi

if [ "$PRODUCER_RUNNING" = true ]; then

    echo "✓ Kafka Producer already running."
    echo "PID: $PRODUCER_PID"

else

    DATASET="$PROJECT_ROOT/datasets/simulation/simulation_dataset.csv"

    if [ ! -f "$DATASET" ]; then

        echo "ERROR: Simulation dataset not found:"
        echo "$DATASET"
        echo
        echo "Generate it first with:"
        echo
        echo "backend/venv/bin/python datasets/simulation/generate_dataset.py"

        exit 1

    fi

    echo "Starting Kafka Producer..."

    nohup "$PYTHON" \
        -u "$PROJECT_ROOT/kafka/producer.py" \
        > "$PRODUCER_LOG" 2>&1 &

    PRODUCER_PID=$!

    echo "$PRODUCER_PID" > "$PRODUCER_PID_FILE"

    sleep 3

    if kill -0 "$PRODUCER_PID" 2>/dev/null; then

        echo "✓ Kafka Producer started."
        echo "PID: $PRODUCER_PID"

    else

        echo "ERROR: Kafka Producer failed to start."
        echo "Check:"
        echo "$PRODUCER_LOG"

        rm -f "$PRODUCER_PID_FILE"

        exit 1

    fi

fi

echo
echo "=================================================="
echo "             STARTUP COMPLETE"
echo "=================================================="
echo

echo "Frontend : http://localhost:5173"
echo "Dashboard: http://localhost:5173/dashboard"
echo "Backend  : http://localhost:8000"

echo
echo "Hadoop   : HDFS + YARN"
echo "Kafka    : localhost:9092"
echo "Topic    : $KAFKA_TOPIC"

echo
echo "Spark PID    : $SPARK_PID"
echo "Producer PID : $PRODUCER_PID"

echo
echo "Spark log:"
echo "$SPARK_LOG"

echo
echo "Producer log:"
echo "$PRODUCER_LOG"

echo
