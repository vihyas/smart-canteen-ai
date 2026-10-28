"""SmartCanteen AI REST API.  Run:  uvicorn app.main:app --reload"""
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from . import database as db
from . import predictor as pred
from .detector import DetectorError, SimulatedDetector, detector_from_env

FRONTEND = Path(__file__).resolve().parent.parent / "frontend" / "index.html"


class ReadingIn(BaseModel):
    count: int = Field(ge=0, le=500, description="People counted in the queue")
    source: str = Field(default="manual", max_length=30)


class ActualWaitIn(BaseModel):
    predicted_min: float = Field(ge=0, le=180)
    actual_min: float = Field(ge=0, le=180, description="Stopwatch-measured wait")


class FeedbackIn(BaseModel):
    role: Literal["student", "staff"]
    rating: int = Field(ge=1, le=5)
    comment: str = Field(default="", max_length=500)


def create_app(db_path=None, detector=None) -> FastAPI:
    db_path = db_path or os.environ.get("CANTEEN_DB", "canteen.db")
    detector = detector or SimulatedDetector()
    db.init_db(db_path)
    app = FastAPI(title="SmartCanteen AI", version="1.1.0")
    # Lets the dashboard work when index.html is opened straight from disk.
    # Prototype setting: restrict allow_origins before any real deployment.
    app.add_middleware(CORSMiddleware, allow_origins=["*"],
                       allow_methods=["GET", "POST"], allow_headers=["*"])

    @app.get("/", include_in_schema=False)
    def dashboard():
        if not FRONTEND.exists():
            raise HTTPException(status_code=404, detail="frontend/index.html not found")
        return FileResponse(FRONTEND)

    def _snapshot(count: int, source: str) -> dict:
        level = pred.crowd_level(count)
        wait = pred.estimate_wait_minutes(count)
        rid = db.insert_reading(db_path, count, wait, level, source)
        return {"id": rid, "count": count, "crowd_level": level,
                "est_wait_min": wait, "advice": pred.advice(level, wait),
                "source": source}

    @app.get("/health")
    def health():
        return {"status": "ok", "detector": detector.name}

    @app.get("/queue")
    def queue():
        """Take a fresh reading from the detector, store it, return the prediction."""
        try:
            count = detector.count_people()
        except DetectorError as e:
            raise HTTPException(status_code=503, detail=f"Detector unavailable: {e}")
        return _snapshot(count, detector.name)

    @app.post("/readings", status_code=201)
    def add_reading(body: ReadingIn):
        """Record a manual count (e.g. from field observation)."""
        return _snapshot(body.count, body.source)

    @app.get("/readings")
    def readings(limit: int = Query(20, ge=1, le=500)):
        return db.latest_readings(db_path, limit)

    @app.get("/forecast")
    def forecast(steps: int = Query(3, ge=1, le=12)):
        """Extrapolate the recent trend `steps` readings ahead."""
        recent = [r["count"] for r in reversed(db.latest_readings(db_path, 8))]
        if not recent:
            raise HTTPException(status_code=404, detail="No readings yet")
        count = pred.forecast_count(recent, steps)
        level = pred.crowd_level(count)
        return {"steps_ahead": steps, "forecast_count": count, "crowd_level": level,
                "est_wait_min": pred.estimate_wait_minutes(count),
                "based_on_readings": len(recent)}

    @app.get("/stats/hourly")
    def hourly():
        return db.hourly_stats(db_path)

    @app.post("/actual-wait", status_code=201)
    def actual_wait(body: ActualWaitIn):
        """Log a stopwatch measurement to evaluate prediction accuracy."""
        return {"id": db.insert_actual_wait(db_path, body.predicted_min, body.actual_min)}

    @app.get("/evaluation")
    def evaluation():
        return db.evaluation(db_path)

    @app.post("/feedback", status_code=201)
    def feedback(body: FeedbackIn):
        return {"id": db.insert_feedback(db_path, body.role, body.rating, body.comment)}

    @app.get("/feedback/summary")
    def feedback_summary():
        return db.feedback_summary(db_path)

    return app


def _default_app() -> FastAPI:
    """Module-level app for uvicorn; detector chosen by CANTEEN_DETECTOR."""
    return create_app(detector=detector_from_env())


app = _default_app()
