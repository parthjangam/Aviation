import json
import time
from pathlib import Path
from datetime import datetime

import pandas as pd
from kafka import KafkaProducer

from config import (
    BOOTSTRAP_SERVER,
    TOPIC_NAME,
    DATASET,
    STREAM_DELAY,
    CHECKPOINT_INTERVAL,
    CHUNK_SIZE
)

producer = KafkaProducer(
    bootstrap_servers=BOOTSTRAP_SERVER,
    value_serializer=lambda value: json.dumps(value).encode("utf-8"),
    acks="all",
    retries=10,
    retry_backoff_ms=1000
)

STATE_FILE = Path("producer_state.json")

DEFAULT_STATE = {
    "last_row": 0,
    "records_sent": 0,
    "status": "READY",
    "started_at": "",
    "updated_at": ""
}


def load_state():

    if not STATE_FILE.exists():

        return DEFAULT_STATE.copy()

    with open(STATE_FILE, "r") as file:

        return json.load(file)


def save_state(state):

    state["updated_at"] = datetime.now().isoformat()

    with open(STATE_FILE, "w") as file:

        json.dump(
            state,
            file,
            indent=4
        )

state = load_state()

start_row = state["last_row"]

if state["started_at"] == "":

    state["started_at"] = datetime.now().isoformat()

state["status"] = "RUNNING"

print("=" * 60)
print("Kafka Flight Producer")
print("=" * 60)
print(f"Resuming from row : {start_row:,}")
print()

current_row = 0

try:

    for chunk in pd.read_csv(
            DATASET,
            chunksize=CHUNK_SIZE):

        for _, row in chunk.iterrows():

            current_row += 1

            if current_row <= start_row:

                continue

            record = row.where(pd.notnull(row), None).to_dict()

            future = producer.send(
                TOPIC_NAME,
                value=record
            )

            future.get()

            state["last_row"] = current_row
            state["records_sent"] += 1

            if state["records_sent"] % CHECKPOINT_INTERVAL == 0:

                save_state(state)

                print(
                    f"Checkpoint Saved | "
                    f"Rows Sent : {state['records_sent']:,}"
                )

            print(
                f"Flight {record['FL_NUMBER']} streamed"
            )

            time.sleep(STREAM_DELAY)

except KeyboardInterrupt:

    print("\nStopping Producer...")

    state["status"] = "STOPPED"

    save_state(state)

finally:

    producer.flush()

    producer.close()

    save_state(state)

    print("\nProducer Closed.")