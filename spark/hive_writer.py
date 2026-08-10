def write_to_hive(df):

    spark = df.sparkSession

    print("=" * 60)
    print("Writing to Hive...")
    print("=" * 60)

    spark.sql("CREATE DATABASE IF NOT EXISTS aviation")

    print("Database created.")

    (
        df.write
        .mode("append")
        .saveAsTable("aviation.flight_predictions")
    )

    print("Table write completed.")

    spark.sql("SHOW DATABASES").show()

    spark.sql("SHOW TABLES IN aviation").show()

    spark.sql("SELECT COUNT(*) FROM aviation.flight_predictions").show()

    print("✓ Hive write successful")