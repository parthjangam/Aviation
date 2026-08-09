from fastapi import APIRouter

from app.services.encoder_service import AIRLINE_MAP, ORIGIN_MAP, DEST_MAP

router = APIRouter(
    prefix="/metadata",
    tags=["Metadata"]
)


@router.get("/")
def metadata():
    """Return available label mappings for airlines and airports.

    This endpoint is read-only and safe to call from the frontend. If
    the backend does not have the serialized encoder artifact, the
    mappings will be empty and the frontend should fall back to raw
    ids or its own lightweight lookup.
    """

    return {
        "airlines": AIRLINE_MAP,
        "origins": ORIGIN_MAP,
        "dests": DEST_MAP,
    }
