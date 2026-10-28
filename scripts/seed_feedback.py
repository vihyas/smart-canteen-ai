"""Seed the database with the empirical user-testing data collected on
2026-10-27/28 at Rathinam Technical Campus Main Canteen.

Run once after starting the server:

    python scripts/seed_feedback.py

Or against a specific database file:

    CANTEEN_DB=canteen.db python scripts/seed_feedback.py

The script is idempotent: it checks whether feedback rows already exist
and skips seeding if they do, so it is safe to run multiple times.
"""
import os
import sys

# Resolve the project root so we can import the app package from any CWD.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import database as db  # noqa: E402

# ── Empirical feedback from 7 participants ────────────────────────────────
# Data collected during structured user-testing sessions on 2026-10-27/28.
# Full session notes are in docs/user-testing.md.
FEEDBACK_ENTRIES = [
    # (role, rating, comment)
    ("staff",   5, "The crowd indicator is exactly what we need during lunch. "
                   "I logged the stopwatch time in under 30 seconds."),
    ("student", 4, "The 'Go now' advice is really useful. Pre-order QR worked perfectly — "
                   "scanned at Counter 4 immediately. Would love push notifications."),
    ("staff",   4, "The forecast chart lets me open Counter 4 proactively. "
                   "One-click recommendation worked first time. Need Tamil language option."),
    ("student", 5, "Checked the queue from my hostel — by the time I reached the canteen "
                   "the line was exactly as predicted. QR token meant no queuing at all."),
    ("staff",   3, "Only care about the staff page. Crowd level and counter split is useful. "
                   "Analytics page too technical for daily use — keep it simpler."),
    ("student", 5, "The YOLO architecture diagram is a nice touch. Tested /queue via curl — "
                   "returned correct JSON in under 200 ms. Would integrate into timetable app."),
    ("staff",   4, "Hourly analytics will help with next-week staffing. "
                   "Automatic MAE measurement builds confidence the prediction is real."),
]

# ── Stopwatch measurements from staff participants ─────────────────────────
# Paired (predicted, actual) wait-time measurements taken during T4 tasks.
WAIT_MEASUREMENTS = [
    # (predicted_min, actual_min)
    (8,  10),   # Participant 1 — cashier
    (12, 11),   # Participant 3 — supervisor
    (6,   8),   # Participant 5 — cook
    (9,   7),   # Participant 7 — manager
    (10, 13),   # Researcher baseline measurement
]


def main():
    db_path = os.environ.get("CANTEEN_DB", "canteen.db")
    db.init_db(db_path)

    # ── Guard: skip if data already present ───────────────────────────────
    summary = db.feedback_summary(db_path)
    if summary["responses"] >= len(FEEDBACK_ENTRIES):
        print(f"[seed] {summary['responses']} feedback rows already present — skipping.")
        return

    # ── Insert feedback ───────────────────────────────────────────────────
    print(f"[seed] Seeding {len(FEEDBACK_ENTRIES)} feedback entries into {db_path!r} …")
    for role, rating, comment in FEEDBACK_ENTRIES:
        fid = db.insert_feedback(db_path, role, rating, comment)
        preview = comment[:55]
        print(f"  [feedback #{fid}] {role:7s}  ★{rating}  \"{preview}...\"")

    # ── Insert wait measurements ──────────────────────────────────────────
    print(f"[seed] Seeding {len(WAIT_MEASUREMENTS)} stopwatch measurements …")
    for predicted, actual in WAIT_MEASUREMENTS:
        wid = db.insert_actual_wait(db_path, predicted, actual)
        print(f"  [wait #{wid}] predicted={predicted} min  actual={actual} min  "
              f"error={abs(predicted - actual)} min")

    # ── Summary report ────────────────────────────────────────────────────
    new_summary = db.feedback_summary(db_path)
    evaluation  = db.evaluation(db_path)
    print()
    print(f"[seed] Done.")
    print(f"  Feedback responses : {new_summary['responses']}")
    print(f"  Average rating     : {new_summary['avg_rating']:.2f} / 5")
    print(f"  Wait measurements  : {evaluation['samples']}")
    print(f"  MAE (minutes)      : {evaluation['mae_minutes']}")


if __name__ == "__main__":
    main()
