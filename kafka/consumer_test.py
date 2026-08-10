import json

from kafka import KafkaConsumer

from config import (
    BOOTSTRAP_SERVER,
    TOPIC_NAME
)

consumer = KafkaConsumer(
    TOPIC_NAME,

    bootstrap_servers=BOOTSTRAP_SERVER,

    value_deserializer=lambda value:
        json.loads(value.decode("utf-8")),

    auto_offset_reset="earliest",

    enable_auto_commit=True,

    group_id="flight_consumer_test"
)

print("=" * 60)
print("Kafka Consumer Started")
print("=" * 60)

for message in consumer:

    flight = message.value

    print(flight)