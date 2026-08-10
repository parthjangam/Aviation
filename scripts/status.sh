#!/usr/bin/env bash

set -u

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

KAFKA_HOME="/opt/kafka"

KAFKA_BOOTSTRAP="localhost:9092"
KAFKA_TOPIC="flight_stream"

RUNTIME_DIR="$PROJECT_ROOT/runtime"

SPARK_PID_FILE="$RUNTIME_DIR/spark.pid"
PRODUCER_PID_FILE="$RUNTIME_DIR/producer.pid"

echo "=================================================="
echo "        AVIATION ANALYTICS PLATFORM"
echo "                  STATUS"
echo "=================================================="
echo

# --------------------------------------------------
# Docker
# --------------------------------------------------

echo "[DOCKER]"

if docker compose ps --status running 2>/dev/null | grep -q "aviation-backend"; then
    echo "✓ Backend     : RUNNING"
else
    echo "✗ Backend     : STOPPED"
fi

if docker compose ps --status running 2>/dev/null | grep -q "aviation-frontend"; then
    echo "✓ Frontend    : RUNNING"
else
    echo "✗ Frontend    : STOPPED"
fi

if docker compose ps --status running 2>/dev/null | grep -q "aviation-postgres"; then
    echo "✓ PostgreSQL  : RUNNING"
else
    echo "✗ PostgreSQL  : STOPPED"
fi

echo

# --------------------------------------------------
# Hadoop
# --------------------------------------------------

echo "[HADOOP]"

if jps | grep -q "NameNode"; then
    echo "✓ NameNode        : RUNNING"
else
    echo "✗ NameNode        : STOPPED"
fi

if jps | grep -q "DataNode"; then
    echo "✓ DataNode        : RUNNING"
else
    echo "✗ DataNode        : STOPPED"
fi

if jps | grep -q "ResourceManager"; then
    echo "✓ ResourceManager : RUNNING"
else
    echo "✗ ResourceManager : STOPPED"
fi

if jps | grep -q "NodeManager"; then
    echo "✓ NodeManager     : RUNNING"
else
    echo "✗ NodeManager     : STOPPED"
fi

echo

# --------------------------------------------------
# Kafka
# --------------------------------------------------

echo "[KAFKA]"

if pgrep -f "kafka.Kafka" >/dev/null; then
    echo "✓ Kafka Broker : RUNNING"
else
    echo "✗ Kafka Broker : STOPPED"
fi

if "$KAFKA_HOME/bin/kafka-topics.sh" \
    --bootstrap-server "$KAFKA_BOOTSTRAP" \
    --list 2>/dev/null |
    grep -qx "$KAFKA_TOPIC"; then

    echo "✓ Topic        : $KAFKA_TOPIC"

else

    echo "✗ Topic        : $KAFKA_TOPIC not found"

fi

echo

# --------------------------------------------------
# Producer
# --------------------------------------------------

echo "[PRODUCER]"

PRODUCER_RUNNING=false

if [ -f "$PRODUCER_PID_FILE" ]; then

    PRODUCER_PID=$(cat "$PRODUCER_PID_FILE")

    if kill -0 "$PRODUCER_PID" 2>/dev/null; then
        PRODUCER_RUNNING=true
    fi

fi

if [ "$PRODUCER_RUNNING" = false ]; then

    EXISTING_PRODUCER_PID=$(
        pgrep -f \
        "python.*$PROJECT_ROOT/kafka/producer.py" |
        head -1
    )

    if [ -n "$EXISTING_PRODUCER_PID" ]; then
        PRODUCER_RUNNING=true
        PRODUCER_PID="$EXISTING_PRODUCER_PID"
    fi

fi

if [ "$PRODUCER_RUNNING" = true ]; then
    echo "✓ Kafka Producer : RUNNING"
    echo "  PID            : $PRODUCER_PID"
else
    echo "✗ Kafka Producer : STOPPED"
fi

echo

# --------------------------------------------------
# Spark
# --------------------------------------------------

echo "[SPARK]"

SPARK_RUNNING=false

if [ -f "$SPARK_PID_FILE" ]; then

    SPARK_PID=$(cat "$SPARK_PID_FILE")

    if kill -0 "$SPARK_PID" 2>/dev/null; then
        SPARK_RUNNING=true
    fi

fi

if [ "$SPARK_RUNNING" = false ]; then

    EXISTING_SPARK_PID=$(
        pgrep -f \
        "org.apache.spark.deploy.SparkSubmit.*$PROJECT_ROOT/spark/streaming.py" |
        head -1
    )

    if [ -n "$EXISTING_SPARK_PID" ]; then
        SPARK_RUNNING=true
        SPARK_PID="$EXISTING_SPARK_PID"
    fi

fi

if [ "$SPARK_RUNNING" = true ]; then
    echo "✓ Spark Streaming : RUNNING"
    echo "  PID             : $SPARK_PID"
else
    echo "✗ Spark Streaming : STOPPED"
fi

echo

# --------------------------------------------------
# Application
# --------------------------------------------------

echo "[APPLICATION]"

if curl -sf http://localhost:8000/ >/dev/null 2>&1; then
    echo "✓ Backend API : http://localhost:8000"
else
    echo "✗ Backend API : unavailable"
fi

if curl -sf http://localhost:5173/ >/dev/null 2>&1; then
    echo "✓ Frontend    : http://localhost:5173"
else
    echo "✗ Frontend    : unavailable"
fi

echo

echo "=================================================="
