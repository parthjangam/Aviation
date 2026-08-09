import logging

# ==========================================================
# Logging Configuration
# ==========================================================

logging.basicConfig(

    level=logging.INFO,

    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"

)

# ==========================================================
# Logger Instance
# ==========================================================

logger = logging.getLogger("aviation")