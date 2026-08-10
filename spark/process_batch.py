from preprocessing import preprocess
from prediction import predict
from parquet_writer import write_parquet
from postgres_writer import write_postgres

def process_batch(batch_df, batch_id):

    print("=" * 60)
    print(f"Processing Batch : {batch_id}")
    print("=" * 60)

    # ======================================================
    # Spark Preprocessing
    # ======================================================

    spark_df = preprocess(batch_df)

    # ======================================================
    # Spark -> Pandas
    # ======================================================

    pandas_df = spark_df.toPandas()

    if pandas_df.empty:
        print("Empty Batch")
        return

    # ======================================================
    # ML Prediction
    # ======================================================

    pandas_df = predict(pandas_df)

    print(
        pandas_df[
            [
                "AIRLINE",
                "ORIGIN",
                "DEST",
                "ARR_DELAY",
                "PREDICTED_ARR_DELAY"
            ]
        ].head()
    )

    # ======================================================
    # Write Predictions as Parquet
    # ======================================================
    print(pandas_df.columns.tolist())

    write_parquet(pandas_df)
    
    write_postgres(pandas_df)

    print("Parquet write completed.")

    print(f"Batch {batch_id} Completed\n")