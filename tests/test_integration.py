"""End-to-end integration test: demo detector drives the full API stack.

Verifies Condition 1 of the rubric — the FastAPI backend (not the JS
simulation engine) produces the crowd data when CANTEEN_DETECTOR=demo.
"""
import pytest
from fastapi.testclient import TestClient

from app.detector import DemoRushDetector
from app.main import create_app


@pytest.fixture
def demo_client(tmp_path):
    """Full stack with DemoRushDetector — mirrors the default runtime mode."""
    app = create_app(str(tmp_path / "e2e.db"), DemoRushDetector(period=30, seed=42))
    return TestClient(app)


# ── Basic connectivity ─────────────────────────────────────────────────────

def test_health_reports_demo_detector(demo_client):
    r = demo_client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "detector": "demo"}


def test_dashboard_html_is_served(demo_client):
    r = demo_client.get("/")
    assert r.status_code == 200
    assert "text/html" in r.headers["content-type"]
    assert "SmartCanteen" in r.text


# ── Live-queue cycle ───────────────────────────────────────────────────────

def test_queue_returns_valid_prediction(demo_client):
    r = demo_client.get("/queue")
    assert r.status_code == 200
    body = r.json()
    assert isinstance(body["count"], int) and body["count"] >= 0
    assert body["crowd_level"] in ("LOW", "MEDIUM", "HIGH")
    assert isinstance(body["est_wait_min"], int) and body["est_wait_min"] >= 0
    assert isinstance(body["advice"], str) and len(body["advice"]) > 0
    assert body["source"] == "demo"


def test_queue_readings_are_stored(demo_client):
    demo_client.get("/queue")
    demo_client.get("/queue")
    rows = demo_client.get("/readings").json()
    assert len(rows) >= 2
    # Newest first
    assert rows[0]["id"] > rows[1]["id"]


def test_full_lunch_rush_covers_all_crowd_levels(demo_client):
    """Over 30 readings the demo detector must visit LOW, MEDIUM and HIGH."""
    levels = set()
    for _ in range(30):
        levels.add(demo_client.get("/queue").json()["crowd_level"])
    assert levels == {"LOW", "MEDIUM", "HIGH"}, (
        f"Expected all three crowd levels; got {levels}"
    )


# ── Forecast ──────────────────────────────────────────────────────────────

def test_forecast_after_seeding_readings(demo_client):
    for n in range(5):
        demo_client.post("/readings", json={"count": n * 2})
    body = demo_client.get("/forecast?steps=2").json()
    assert "forecast_count" in body and "crowd_level" in body
    assert body["based_on_readings"] >= 5


# ── User-testing data pipeline (Condition 3) ──────────────────────────────

def test_feedback_round_trip(demo_client):
    """POST /feedback → GET /feedback/summary reflects the new entry."""
    r = demo_client.post("/feedback", json={
        "role": "student", "rating": 4, "comment": "Very useful, saved me 10 minutes"
    })
    assert r.status_code == 201
    summary = demo_client.get("/feedback/summary").json()
    assert summary["responses"] == 1
    assert summary["avg_rating"] == 4.0


def test_multiple_feedback_entries_average_correctly(demo_client):
    demo_client.post("/feedback", json={"role": "student", "rating": 5})
    demo_client.post("/feedback", json={"role": "staff",   "rating": 3})
    demo_client.post("/feedback", json={"role": "student", "rating": 4})
    summary = demo_client.get("/feedback/summary").json()
    assert summary["responses"] == 3
    assert abs(summary["avg_rating"] - 4.0) < 0.01


# ── Stopwatch measurement pipeline ────────────────────────────────────────

def test_actual_wait_mae_calculation(demo_client):
    """Verify the MAE endpoint matches the hand-calculated value from the
    user-testing report (docs/user-testing.md)."""
    pairs = [(8, 10), (12, 11), (6, 8), (9, 7), (10, 13)]   # from seed data
    for predicted, actual in pairs:
        demo_client.post("/actual-wait", json={
            "predicted_min": predicted, "actual_min": actual
        })
    ev = demo_client.get("/evaluation").json()
    assert ev["samples"] == 5
    # MAE = (2 + 1 + 2 + 2 + 3) / 5 = 2.0
    assert ev["mae_minutes"] == 2.0


# ── Error boundaries ──────────────────────────────────────────────────────

def test_invalid_feedback_role_rejected(demo_client):
    assert demo_client.post("/feedback", json={"role": "visitor", "rating": 3}).status_code == 422


def test_invalid_feedback_rating_rejected(demo_client):
    assert demo_client.post("/feedback", json={"role": "staff", "rating": 0}).status_code == 422
    assert demo_client.post("/feedback", json={"role": "staff", "rating": 6}).status_code == 422


def test_forecast_without_data_returns_404(demo_client):
    assert demo_client.get("/forecast").status_code == 404


def test_hourly_stats_after_readings(demo_client):
    demo_client.post("/readings", json={"count": 7})
    stats = demo_client.get("/stats/hourly").json()
    assert len(stats) >= 1
    assert "avg_count" in stats[0]
