"""API tests, including error-boundary behaviour (bad input, detector failure)."""
import pytest
from fastapi.testclient import TestClient

from app.detector import DetectorError
from app.main import create_app


class FakeDetector:
    name = "fake"

    def __init__(self, counts):
        self._counts = iter(counts)

    def count_people(self):
        return next(self._counts)


class BrokenDetector:
    name = "broken"

    def count_people(self):
        raise DetectorError("camera offline")


@pytest.fixture
def client(tmp_path):
    app = create_app(str(tmp_path / "api.db"), FakeDetector([3, 9, 20, 5, 5, 5]))
    return TestClient(app)


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200 and r.json() == {"status": "ok", "detector": "fake"}


def test_queue_returns_prediction_and_is_stored(client):
    r = client.get("/queue")
    body = r.json()
    assert r.status_code == 200
    assert body["count"] == 3 and body["crowd_level"] == "LOW"
    assert client.get("/readings").json()[0]["count"] == 3


def test_queue_high_crowd(client):
    client.get("/queue"); client.get("/queue")
    body = client.get("/queue").json()  # third reading = 20 people
    assert body["crowd_level"] == "HIGH" and body["est_wait_min"] >= 18


def test_detector_failure_gives_503_not_crash(tmp_path):
    c = TestClient(create_app(str(tmp_path / "x.db"), BrokenDetector()))
    r = c.get("/queue")
    assert r.status_code == 503
    assert "camera offline" in r.json()["detail"]


def test_manual_reading(client):
    r = client.post("/readings", json={"count": 12, "source": "field"})
    assert r.status_code == 201
    assert r.json()["crowd_level"] == "MEDIUM"


@pytest.mark.parametrize("payload", [
    {"count": -1}, {"count": 99999}, {"count": "many"}, {},
])
def test_manual_reading_rejects_invalid_input(client, payload):
    assert client.post("/readings", json=payload).status_code == 422


def test_forecast_needs_data(client):
    assert client.get("/forecast").status_code == 404


def test_forecast_follows_rising_trend(client):
    for n in (2, 4, 6, 8):
        client.post("/readings", json={"count": n})
    body = client.get("/forecast?steps=2").json()
    assert body["forecast_count"] == 12 and body["crowd_level"] == "MEDIUM"


def test_forecast_rejects_bad_steps(client):
    assert client.get("/forecast?steps=0").status_code == 422


def test_readings_limit_validation(client):
    assert client.get("/readings?limit=0").status_code == 422


def test_actual_wait_and_evaluation(client):
    client.post("/actual-wait", json={"predicted_min": 10, "actual_min": 13})
    client.post("/actual-wait", json={"predicted_min": 6, "actual_min": 5})
    assert client.get("/evaluation").json() == {"samples": 2, "mae_minutes": 2.0}


def test_actual_wait_rejects_negative(client):
    r = client.post("/actual-wait", json={"predicted_min": -1, "actual_min": 5})
    assert r.status_code == 422


def test_feedback_flow(client):
    assert client.post("/feedback", json={"role": "student", "rating": 4, "comment": "useful"}).status_code == 201
    assert client.get("/feedback/summary").json() == {"responses": 1, "avg_rating": 4.0}


def test_feedback_rejects_invalid_role_and_rating(client):
    assert client.post("/feedback", json={"role": "guest", "rating": 4}).status_code == 422
    assert client.post("/feedback", json={"role": "staff", "rating": 6}).status_code == 422


def test_hourly_stats_endpoint(client):
    client.post("/readings", json={"count": 5})
    assert len(client.get("/stats/hourly").json()) == 1


# ---- dashboard + CORS ----
def test_dashboard_is_served_at_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "SmartCanteen AI" in r.text and "text/html" in r.headers["content-type"]


def test_cors_header_allows_file_origin(client):
    r = client.get("/health", headers={"Origin": "null"})
    assert r.headers.get("access-control-allow-origin") == "*"


def test_demo_detector_drives_the_api(tmp_path):
    from app.detector import DemoRushDetector
    c = TestClient(create_app(str(tmp_path / "d.db"), DemoRushDetector(period=20, seed=2)))
    levels = {c.get("/queue").json()["crowd_level"] for _ in range(20)}
    assert "LOW" in levels and "HIGH" in levels   # a full rush covers both extremes
    assert c.get("/health").json()["detector"] == "demo"
