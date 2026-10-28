"""SQLite persistence layer (standard library only).

Every function takes a `db_path`, so tests can use a temporary database.
"""
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone

SCHEMA = """
CREATE TABLE IF NOT EXISTS queue_readings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    ts           TEXT    NOT NULL,            -- ISO-8601 UTC
    count        INTEGER NOT NULL CHECK (count >= 0),
    est_wait_min INTEGER NOT NULL CHECK (est_wait_min >= 0),
    crowd_level  TEXT    NOT NULL CHECK (crowd_level IN ('LOW','MEDIUM','HIGH')),
    source       TEXT    NOT NULL DEFAULT 'simulated'
);
CREATE TABLE IF NOT EXISTS actual_waits (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    ts            TEXT    NOT NULL,
    predicted_min REAL    NOT NULL CHECK (predicted_min >= 0),
    actual_min    REAL    NOT NULL CHECK (actual_min >= 0)
);
CREATE TABLE IF NOT EXISTS feedback (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    ts      TEXT    NOT NULL,
    role    TEXT    NOT NULL CHECK (role IN ('student','staff')),
    rating  INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT    NOT NULL DEFAULT ''
);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


@contextmanager
def connect(db_path: str):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db(db_path: str) -> None:
    with connect(db_path) as c:
        c.executescript(SCHEMA)


def insert_reading(db_path, count, est_wait_min, crowd_level, source="simulated", ts=None) -> int:
    with connect(db_path) as c:
        cur = c.execute(
            "INSERT INTO queue_readings (ts, count, est_wait_min, crowd_level, source) "
            "VALUES (?,?,?,?,?)",
            (ts or _now(), count, est_wait_min, crowd_level, source),
        )
        return cur.lastrowid


def latest_readings(db_path, limit=20) -> list[dict]:
    """Most recent readings, newest first."""
    with connect(db_path) as c:
        rows = c.execute(
            "SELECT * FROM queue_readings ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]


def hourly_stats(db_path) -> list[dict]:
    """Average and peak queue length per hour of day (UTC)."""
    with connect(db_path) as c:
        rows = c.execute(
            "SELECT substr(ts, 12, 2) AS hour, COUNT(*) AS readings, "
            "ROUND(AVG(count), 1) AS avg_count, MAX(count) AS peak_count "
            "FROM queue_readings GROUP BY hour ORDER BY hour"
        ).fetchall()
        return [dict(r) for r in rows]


def insert_actual_wait(db_path, predicted_min, actual_min) -> int:
    with connect(db_path) as c:
        cur = c.execute(
            "INSERT INTO actual_waits (ts, predicted_min, actual_min) VALUES (?,?,?)",
            (_now(), predicted_min, actual_min),
        )
        return cur.lastrowid


def evaluation(db_path) -> dict:
    """Mean absolute error between predicted and stopwatch-measured waits."""
    with connect(db_path) as c:
        row = c.execute(
            "SELECT COUNT(*) AS n, AVG(ABS(predicted_min - actual_min)) AS mae "
            "FROM actual_waits"
        ).fetchone()
        n = row["n"]
        return {"samples": n, "mae_minutes": round(row["mae"], 2) if n else None}


def insert_feedback(db_path, role, rating, comment="") -> int:
    with connect(db_path) as c:
        cur = c.execute(
            "INSERT INTO feedback (ts, role, rating, comment) VALUES (?,?,?,?)",
            (_now(), role, rating, comment),
        )
        return cur.lastrowid


def feedback_summary(db_path) -> dict:
    with connect(db_path) as c:
        row = c.execute("SELECT COUNT(*) AS n, AVG(rating) AS avg FROM feedback").fetchone()
        return {"responses": row["n"], "avg_rating": round(row["avg"], 2) if row["n"] else None}
