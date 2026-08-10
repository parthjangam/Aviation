# ✈️ Aviation Analytics Platform

A complete **Big Data, Machine Learning, Streaming Analytics, and Full-Stack Visualization Platform** for aviation flight data.

The platform processes flight records through a real-time streaming pipeline using **Apache Kafka and Apache Spark Structured Streaming**, performs **flight arrival-delay prediction using XGBoost**, stores processed predictions in **PostgreSQL**, and exposes the results through a **FastAPI backend** and an interactive **React dashboard**.

The project also includes a Dockerized application stack for PostgreSQL, FastAPI, and the React/Nginx frontend.

---

# 📌 Project Overview

The Aviation Analytics Platform combines:

- Big Data processing
- Real-time data streaming
- Machine Learning
- Distributed storage
- Relational database storage
- REST APIs
- Interactive data visualization
- Containerization

The system takes flight records from a streaming source, processes them using Spark, applies a trained XGBoost model to predict arrival delay, stores the resulting records in PostgreSQL and Parquet/HDFS, and makes the results available through a web dashboard.

---

# 🏗️ System Architecture

The project uses a hybrid WSL + Docker architecture.

Big Data components run in the WSL environment, while the application stack runs inside Docker.

```text
                         AVIATION ANALYTICS PLATFORM
                                      │
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    │            WSL ENVIRONMENT        │
                    │                                   │
                    │  Kafka Producer                   │
                    │       │                           │
                    │       ▼                           │
                    │  Kafka Broker                    │
                    │       │                           │
                    │       ▼                           │
                    │  Spark Structured Streaming      │
                    │       │                           │
                    │       ├── Preprocessing           │
                    │       │                           │
                    │       ├── XGBoost Prediction      │
                    │       │                           │
                    │       ├── HDFS / Hive             │
                    │       │                           │
                    │       └── Parquet                 │
                    │               │                   │
                    └───────────────┼───────────────────┘
                                    │
                                    │ PostgreSQL
                                    │ localhost:5433
                                    ▼
                    ┌───────────────────────────────────┐
                    │          DOCKER ENVIRONMENT       │
                    │                                   │
                    │        PostgreSQL Database        │
                    │                │                  │
                    │                ▼                  │
                    │          FastAPI Backend           │
                    │                │                  │
                    │                ▼                  │
                    │        React + Nginx Frontend     │
                    │                │                  │
                    └────────────────┼──────────────────┘
                                     │
                                     ▼
                                  Browser
