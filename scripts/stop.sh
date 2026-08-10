#!/usr/bin/env bash

set -u

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

HADOOP_HOME="/opt/hadoop"
KAFKA_HOME="/opt/kafka"

RUNTIME_DIR="$PROJECT_ROOT/runtime"

SPARK_PID_FILE="$RUNTIME_DIR/spark.pid"
PRODUCER_PID_FILE="$RUNTIME_DIR/producer.pid"

echo "=================================================="
echo "        AVIATION ANALYTICS PLATFORM"
echo "                 SHUTDOWN"
echo "=================================================="
echo

cd "$PROJECT_ROOT"

# --------------------------------------------------
# Producer
# --------------------------------------------------

echo "[1/5] Stopping Kafka Producer..."

if [ -f "$PRODUCER_PID_FILE" ]; then

    PRODUCER_PID=$(cat "$PRODUCER_PID_FILE")

    if kill -0 "$PRODUCER_PID" 2>/dev/null; then

        echo "Stopping Producer PID $PRODUCER_PID..."

        kill "$PRODUCER_PID" 2>/dev/null || true

        for i in {1..10}; do

            if ! kill -0 "$PRODUCER_PID" 2>/dev/null; then
                break
            fi

            sleep 1
        done

        if kill -0 "$PRODUCER_PID" 2>/dev/null; then
            echo "Producer did not stop gracefully. Sending SIGKILL..."
            kill -9 "$PRODUCER_PID" 2>/dev/null || true
        fi

    else
        echo "Producer process is already stopped."
    fi

    rm -f "$PRODUCER_PID_FILE"

else

    EXISTING_PRODUCER_PID=$(
        pgrep -f \
        "python.*$PROJECT_ROOT/kafka/producer.py" |
        head -1
    )

    if [ -n "$EXISTING_PRODUCER_PID" ]; then
        echo "Found Producer PID $EXISTING_PRODUCER_PID"
        kill "$EXISTING_PRODUCER_PID" 2>/dev/null || true
    else
        echo "Producer already stopped."
    fi

fi

echo "✓ Kafka Producer stopped."
echo

# --------------------------------------------------
# Spark
# --------------------------------------------------

echo "[2/5] Stopping Spark Streaming..."

if [ -f "$SPARK_PID_FILE" ]; then

    SPARK_PID=$(cat "$SPARK_PID_FILE")

    if kill -0 "$SPARK_PID" 2>/dev/null; then

        echo "Stopping Spark PID $SPARK_PID..."

        kill "$SPARK_PID" 2>/dev/null || true

        for i in {1..15}; do

            if ! kill -0 "$SPARK_PID" 2>/dev/null; then
                break
            fi

            sleep 1
        done

        if kill -0 "$SPARK_PID" 2>/dev/null; then
            echo "Spark did not stop gracefully. Sending SIGKILL..."
            kill -9 "$SPARK_PID" 2>/dev/null || true
        fi

    else
        echo "Spark process is already stopped."
    fi

    rm -f "$SPARK_PID_FILE"

else

    EXISTING_SPARK_PID=$(
        pgrep -f \
        "org.apache.spark.deploy.SparkSubmit.*$PROJECT_ROOT/spark/streaming.py" |
        head -1
    )

    if [ -n "$EXISTING_SPARK_PID" ]; then

        echo "Found Spark PID $EXISTING_SPARK_PID"
        kill "$EXISTING_SPARK_PID" 2>/dev/null || true

    else

        echo "Spark already stopped."

    fi

fi

echo "✓ Spark Streaming stopped."
echo

# --------------------------------------------------
# Kafka
# --------------------------------------------------

echo "[3/5] Stopping Kafka..."

KAFKA_PID=$(pgrep -f "kafka.Kafka" | head -1 || true)

if [ -n "$KAFKA_PID" ]; then

    echo "Stopping Kafka PID $KAFKA_PID..."

    kill "$KAFKA_PID" 2>/dev/null || true

    for i in {1..15}; do

        if ! kill -0 "$KAFKA_PID" 2>/dev/null; then
            break
        fi

        sleep 1
    done

    if kill -0 "$KAFKA_PID" 2>/dev/null; then
        echo "Kafka did not stop gracefully. Sending SIGKILL..."
        kill -9 "$KAFKA_PID" 2>/dev/null || true
    fi

    echo "✓ Kafka stopped."

else

    echo "✓ Kafka already stopped."

fi

echo

# --------------------------------------------------
# Hadoop
# --------------------------------------------------

echo "[4/5] Stopping Hadoop..."

if jps | grep -q "ResourceManager"; then
    "$HADOOP_HOME/sbin/stop-yarn.sh"
else
    echo "YARN already stopped."
fi

if jps | grep -q "NameNode"; then
    "$HADOOP_HOME/sbin/stop-dfs.sh"
else
    echo "HDFS already stopped."
fi

sleep 2

# Kill any stubborn Hadoop daemons left behind
HADOOP_DAEMONS=$(jps | awk '
/NameNode$/ ||
/DataNode$/ ||
/SecondaryNameNode$/ ||
/ResourceManager$/ ||
/NodeManager$/ {
    print $1
}')

if [ -n "$HADOOP_DAEMONS" ]; then

    echo "Stopping remaining Hadoop daemons..."

    while read -r PID; do
        if [ -n "$PID" ]; then
            kill "$PID" 2>/dev/null || true
        fi
    done <<< "$HADOOP_DAEMONS"

    sleep 2

fi

echo "✓ Hadoop stopped."
echo

# --------------------------------------------------
# Docker
# --------------------------------------------------

echo "[5/5] Stopping Docker application stack..."

docker compose down

echo "✓ Docker stack stopped."

echo
echo "=================================================="
echo "             SHUTDOWN COMPLETE"
echo "=================================================="
echo
