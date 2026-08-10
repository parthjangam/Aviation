BOOTSTRAP_SERVER = "localhost:9092"

TOPIC_NAME = "flight_stream"

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET = str(PROJECT_ROOT / "datasets" / "simulation" / "simulation_dataset.csv")

STREAM_DELAY = 0.5

CHECKPOINT_INTERVAL = 100

CHUNK_SIZE = 1000