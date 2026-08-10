import joblib
import pandas as pd
from pathlib import Path

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

# ==========================================================
# Global variables (loaded lazily)
# ==========================================================

model = None
feature_columns = None
label_encoders = None

# ==========================================================
# Load artifacts only once
# ==========================================================

def load_artifacts():

    global model
    global feature_columns
    global label_encoders

    if model is None:

        print("Loading ML artifacts...")

        model = joblib.load(MODEL_DIR / "xgboost_regressor.pkl")

        feature_columns = joblib.load(
            MODEL_DIR / "feature_columns.pkl"
        )

        label_encoders = joblib.load(
            MODEL_DIR / "label_encoders.pkl"
        )

        print("Artifacts loaded successfully.")

# ==========================================================
# Safe Label Encoding
# ==========================================================

def safe_encode(value, encoder):

    if pd.isna(value):
        return -1

    if value in encoder.classes_:
        return encoder.transform([value])[0]

    return -1

# ==========================================================
# Encode categorical columns
# ==========================================================

def encode_dataframe(df):

    categorical_columns = [
        "AIRLINE",
        "ORIGIN",
        "DEST",
        "FLIGHT_CATEGORY"
    ]

    for column in categorical_columns:

        encoder = label_encoders[column]

        df[column] = df[column].apply(
            lambda x: safe_encode(x, encoder)
        )

    return df

# ==========================================================
# Prediction
# ==========================================================

def predict(df):

    load_artifacts()

    df = encode_dataframe(df)

    X = df[feature_columns]

    predictions = model.predict(X)

    df["PREDICTED_ARR_DELAY"] = predictions

    return df