from pathlib import Path
from typing import Any

try:
    import joblib
except ModuleNotFoundError:  # pragma: no cover - exercised in minimal environments
    joblib = None

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_DIR = BASE_DIR / "models"

# Attempt to load the serialized label encoders. If the artifact is
# missing (common in dev checkouts), fall back to empty maps so the
# application stays up and the frontend can gracefully show raw ids.
if joblib is None:
    label_encoders: dict[str, Any] = {}
else:
    try:
        label_encoders: dict[str, Any] = joblib.load(MODEL_DIR / "label_encoders.pkl")
    except Exception:
        label_encoders = {}


# Build lookup dictionaries when encoders are available
if "AIRLINE" in label_encoders:
    AIRLINE_MAP = {index: value for index, value in enumerate(label_encoders["AIRLINE"].classes_)}
else:
    AIRLINE_MAP = {}

if "ORIGIN" in label_encoders:
    ORIGIN_MAP = {index: value for index, value in enumerate(label_encoders["ORIGIN"].classes_)}
else:
    ORIGIN_MAP = {}

if "DEST" in label_encoders:
    DEST_MAP = {index: value for index, value in enumerate(label_encoders["DEST"].classes_)}
else:
    DEST_MAP = {}

if "FLIGHT_CATEGORY" in label_encoders:
    FLIGHT_CATEGORY_MAP = {index: value for index, value in enumerate(label_encoders["FLIGHT_CATEGORY"].classes_)}
else:
    FLIGHT_CATEGORY_MAP = {}


def airline_name(id: int) -> str:
    return AIRLINE_MAP.get(id, "Unknown")


def origin_name(id: int) -> str:
    return ORIGIN_MAP.get(id, "Unknown")


def dest_name(id: int) -> str:
    return DEST_MAP.get(id, "Unknown")


def category_name(id: int) -> str:
    return FLIGHT_CATEGORY_MAP.get(id, "Unknown")