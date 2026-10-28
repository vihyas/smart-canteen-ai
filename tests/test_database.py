"""Unit tests for the SQLite layer (each test uses a fresh temp database)."""
import sqlite3

import pytest

from app import database as db


@pytest.fixture
def path(tmp_path):
    p = str(tmp_path / "test.db")
    db.init_db(p)
    return p


def test_init_is_idempotent(path):
    db.init_db(path)  # second call must not raise or wipe data
    assert db.latest_readings(path) == []


def test_insert_and_read_back(path):
    rid = db.insert_reading(path, 9, 9, "MEDIUM", "manual")
    rows = db.latest_readings(path)
    assert rows[0]["id"] == rid
    assert rows[0]["count"] == 9 and rows[0]["crowd_level"] == "MEDIUM"


def test_latest_is_newest_first_and_respects_limit(path):
    for n in (1, 2, 3, 4):
        db.insert_reading(path, n, n, "LOW")
    rows = db.latest_readings(path, limit=2)
    assert [r["count"] for r in rows] == [4, 3]


def test_database_rejects_negative_count(path):
    with pytest.raises(sqlite3.IntegrityError):
        db.insert_reading(path, -1, 0, "LOW")


def test_database_rejects_invalid_level(path):
    with pytest.raises(sqlite3.IntegrityError):
        db.insert_reading(path, 3, 3, "CROWDED")


def test_hourly_stats_groups_by_hour(path):
    db.insert_reading(path, 4, 4, "LOW", ts="2026-10-28T12:10:00+00:00")
    db.insert_reading(path, 10, 10, "MEDIUM", ts="2026-10-28T12:50:00+00:00")
    db.insert_reading(path, 2, 2, "LOW", ts="2026-10-28T13:05:00+00:00")
    stats = {s["hour"]: s for s in db.hourly_stats(path)}
    assert stats["12"]["avg_count"] == 7.0 and stats["12"]["peak_count"] == 10
    assert stats["13"]["readings"] == 1


def test_evaluation_empty_returns_none(path):
    assert db.evaluation(path) == {"samples": 0, "mae_minutes": None}


def test_evaluation_mean_absolute_error(path):
    db.insert_actual_wait(path, predicted_min=10, actual_min=12)   # error 2
    db.insert_actual_wait(path, predicted_min=8, actual_min=7)     # error 1
    assert db.evaluation(path) == {"samples": 2, "mae_minutes": 1.5}


def test_feedback_summary(path):
    assert db.feedback_summary(path)["responses"] == 0
    db.insert_feedback(path, "student", 5, "clear")
    db.insert_feedback(path, "staff", 3)
    assert db.feedback_summary(path) == {"responses": 2, "avg_rating": 4.0}


def test_feedback_rejects_bad_rating_and_role(path):
    with pytest.raises(sqlite3.IntegrityError):
        db.insert_feedback(path, "student", 9)
    with pytest.raises(sqlite3.IntegrityError):
        db.insert_feedback(path, "visitor", 3)
