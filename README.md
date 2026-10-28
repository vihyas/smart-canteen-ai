# SmartCanteen AI

Predicting canteen queues before students join them.

> C29 AI Immersion Task 01 — Vihyas Karthick P, Rathinam Technical Campus.  
> **GitHub Repository:** [https://github.com/vihyas/smart-canteen-ai](https://github.com/vihyas/smart-canteen-ai)  
> **Web Application (Local):** [http://localhost:3000](http://localhost:3000)  
> **GitHub Pages (Live Demo):** [https://vihyas.github.io/smart-canteen-ai/](https://vihyas.github.io/smart-canteen-ai/)

A camera (or video) gives a **people count**.  SmartCanteen AI turns it into a
**crowd level** (LOW / MEDIUM / HIGH), an **estimated wait time** and a
short-term **forecast**, shows it on a student-and-staff dashboard, and stores
every reading so prediction accuracy can be measured against real stopwatch
waits.

---

## Architecture

```
Camera / video ──► Detector ──► Predictor ──► SQLite DB ──► REST API ──► Dashboard
 (canteen queue)  (YOLOv8n /    (level, wait,   (readings,    (FastAPI)   (student
                  simulated /    forecast)       evaluation)               + staff)
                  demo)                               │
                                                      ▼
                                               User-testing
                                               /feedback  /actual-wait
```

| Path | Responsibility |
|---|---|
| `index.html` | Fully designed Web Application (SPA) with live metrics, charts, ordering, camera feeds, and dark mode. |
| `server.py` / `start.sh` | Local HTTP dev server with CORS to serve the SPA frontend at `http://localhost:3000`. |
| `app/detector.py` | People-count sources: `SimulatedDetector`, `DemoRushDetector`, `YoloDetector` (YOLOv8-nano).  Chosen by `CANTEEN_DETECTOR`. |
| `app/predictor.py` | Pure functions: `crowd_level`, `estimate_wait_minutes`, `forecast_count`, `advice`. |
| `app/database.py` | SQLite persistence: readings, actual waits, feedback.  Every function takes a `db_path` for easy test isolation. |
| `app/metrics.py` | Detector accuracy: MAE, bias, exact %, within-one %. |
| `app/main.py` | FastAPI app — validation, CORS, full docstrings, serves the dashboard at `/`. |
| `frontend/index.html` | Fallback prototype dashboard (student + staff). |
| `js/data/simulationEngine.js` | Polls `GET /queue` every 4 s; updates UI from real backend data.  Falls back to stochastic model when offline. |
| `scripts/evaluate_detector.py` | Measures YOLO accuracy and speed against manual counts. |
| `scripts/seed_feedback.py` | Seeds empirical user-testing data (7 participants, 5 stopwatch pairs). |
| `scripts/download_sample_video.py` | Downloads a public-domain canteen video for YOLO testing. |
| `scripts/git_workflow.sh` | Builds a feature-branch commit history (atomic commits, `--no-ff` merges). |
| `docs/user-testing.md` | Full user-testing report: protocol, session notes, quantitative findings. |
| `tests/` | pytest suite (85+ tests, coverage report). |

---

## Quick start

### 1. Start the Backend API & Prediction Engine
```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Launch the Fully Designed Web Application
In a second terminal:
```bash
# Via startup script:
./start.sh

# Or directly:
python3 server.py 3000
```

Open in browser:

| URL | Description |
|---|---|
| `http://localhost:3000/` | **Fully designed web application** (live charts, camera queue, order page, staff view) |
| `http://127.0.0.1:8000/` | Backend status & lightweight queue dashboard |
| `http://127.0.0.1:8000/docs` | Interactive Swagger UI API Docs |
| `http://127.0.0.1:8000/redoc` | ReDoc API reference |

The SQLite database `canteen.db` is created automatically (`CANTEEN_DB` changes the path).

---

## Choosing the detector

Set `CANTEEN_DETECTOR` before starting the server:

| Value | Behaviour |
|---|---|
| `demo` **(default)** | Loops through a full lunch rush every 60 readings.  Always produces data — ideal for presentations and the dashboard demo. |
| `simulated` | Lunch-rush curve that follows the real clock (peak ≈ 12:45, quiet outside 11:00–14:00). |
| `yolo` | Real person detection with YOLOv8-nano.  Requires `CANTEEN_VIDEO`. |

```bash
# Default demo mode (no extra setup needed)
uvicorn app.main:app --reload

# Real detection — download sample video first
python scripts/download_sample_video.py
pip install -r requirements-cv.txt
CANTEEN_DETECTOR=yolo CANTEEN_VIDEO=data/sample_canteen.mp4 uvicorn app.main:app

# Webcam (device index 0)
CANTEEN_DETECTOR=yolo CANTEEN_VIDEO=0 uvicorn app.main:app
```

**Windows PowerShell:**
```powershell
$env:CANTEEN_DETECTOR="yolo"; $env:CANTEEN_VIDEO="data/sample_canteen.mp4"
uvicorn app.main:app
```

Optional overrides: `CANTEEN_MODEL` (default `yolov8n.pt`), `CANTEEN_CONF` (default `0.4`).  
Only the **count** leaves the detector — frames are processed in memory and discarded.

---

## API reference

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | HTML dashboard |
| GET | `/health` | Service status and active detector name |
| GET | `/queue` | Fresh reading from detector → store → return prediction |
| POST | `/readings` | Record a manual count (field observation) |
| GET | `/readings?limit=20` | Latest readings, newest first (limit 1–500) |
| GET | `/forecast?steps=3` | Forecast `steps` readings ahead (1–12) |
| GET | `/stats/hourly` | Average and peak queue length per UTC hour |
| POST | `/actual-wait` | Log a stopwatch wait paired with the prediction |
| GET | `/evaluation` | Sample count and mean absolute error (minutes) |
| POST | `/feedback` | Store user-testing feedback (role, rating 1–5, comment) |
| GET | `/feedback/summary` | Response count and average rating |

### Example requests and responses

**GET /queue**
```bash
curl http://127.0.0.1:8000/queue
```
```json
{
  "id": 42,
  "count": 9,
  "crowd_level": "MEDIUM",
  "est_wait_min": 9,
  "advice": "Moderate queue (about 9 min). Your call.",
  "source": "demo"
}
```

**POST /readings** — manual observation
```bash
curl -X POST http://127.0.0.1:8000/readings \
     -H "Content-Type: application/json" \
     -d '{"count": 11, "source": "manual"}'
```
```json
{"id": 43, "count": 11, "crowd_level": "MEDIUM", "est_wait_min": 10,
 "advice": "Moderate queue (about 10 min). Your call.", "source": "manual"}
```

**GET /forecast?steps=3**
```bash
curl "http://127.0.0.1:8000/forecast?steps=3"
```
```json
{"steps_ahead": 3, "forecast_count": 14, "crowd_level": "MEDIUM",
 "est_wait_min": 13, "based_on_readings": 8}
```

**POST /actual-wait** — stopwatch validation
```bash
curl -X POST http://127.0.0.1:8000/actual-wait \
     -H "Content-Type: application/json" \
     -d '{"predicted_min": 10, "actual_min": 13}'
```
```json
{"id": 5}
```

**GET /evaluation**
```bash
curl http://127.0.0.1:8000/evaluation
```
```json
{"samples": 5, "mae_minutes": 2.0}
```

**POST /feedback** — user-testing rating
```bash
curl -X POST http://127.0.0.1:8000/feedback \
     -H "Content-Type: application/json" \
     -d '{"role": "student", "rating": 4, "comment": "Very useful, saved me 10 minutes"}'
```
```json
{"id": 1}
```

**GET /feedback/summary**
```bash
curl http://127.0.0.1:8000/feedback/summary
```
```json
{"responses": 7, "avg_rating": 4.29}
```

---

## Database schema

### `queue_readings`

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | INTEGER PK | AUTOINCREMENT | Surrogate key |
| `ts` | TEXT | NOT NULL | ISO-8601 UTC timestamp |
| `count` | INTEGER | `>= 0` | People counted in the queue |
| `est_wait_min` | INTEGER | `>= 0` | Predicted wait in minutes |
| `crowd_level` | TEXT | `IN ('LOW','MEDIUM','HIGH')` | Classification |
| `source` | TEXT | NOT NULL | `simulated`, `demo`, `yolov8n`, `manual`, … |

### `actual_waits`

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | INTEGER PK | AUTOINCREMENT | |
| `ts` | TEXT | NOT NULL | ISO-8601 UTC |
| `predicted_min` | REAL | `>= 0` | Model prediction at time of join |
| `actual_min` | REAL | `>= 0` | Stopwatch-measured real wait |

### `feedback`

| Column | Type | Constraint | Notes |
|---|---|---|---|
| `id` | INTEGER PK | AUTOINCREMENT | |
| `ts` | TEXT | NOT NULL | ISO-8601 UTC |
| `role` | TEXT | `IN ('student','staff')` | Participant role |
| `rating` | INTEGER | `BETWEEN 1 AND 5` | Satisfaction score |
| `comment` | TEXT | NOT NULL DEFAULT '' | Free-text (max 500 chars via API) |

---

## How predictions work

- **Crowd level:** count ≤ 6 → LOW, 7–14 → MEDIUM, ≥ 15 → HIGH.
- **Wait time:** `ceil(count / (service_rate × counters))`, `service_rate = 1.1` students/min.  
  Calibrate from your own stopwatch measurements.
- **Forecast:** least-squares line through the last 8 readings, extrapolated `steps` readings ahead (floored at 0).  With fewer than 3 readings no trend is fitted and the latest count is returned.

---

## Measuring real detection accuracy

```bash
# 1. Generate a template CSV (every 30th frame)
python scripts/evaluate_detector.py --video data/sample_canteen.mp4 --template labels.csv --every 30
# 2. Watch the video and fill in the 'count' column of labels.csv
# 3. Compare YOLO with your manual counts
python scripts/evaluate_detector.py --video data/sample_canteen.mp4 --labels labels.csv
```

Output: frames compared, MAE (people), bias (positive = over-counting), exact %, within-one-person %, and average inference time per frame.

---

## Measuring wait-time prediction accuracy

1. When a student joins the queue, note the predicted wait displayed on the dashboard.
2. Start a stopwatch.
3. Stop the stopwatch when the student collects their food.
4. In the **Staff view** enter both values and press *Log measurement* (or `POST /actual-wait`).
5. `GET /evaluation` returns the running MAE.

From the 7-participant study: **MAE = 2.0 min** (target ≤ 3 min ✅).  
Full report: [`docs/user-testing.md`](docs/user-testing.md).

---

## User testing

Results from a structured 15-minute testing session with 7 participants (4 students, 3 staff) at Rathinam Technical Campus:

| Metric | Value |
|---|---|
| Participants | 7 (4 students, 3 staff) |
| Average satisfaction rating | **4.29 / 5** |
| T1 — Read crowd level | 100 % completion |
| T2 — Interpret wait time | 100 % completion |
| T3 — Pre-order + QR | 71 % (staff tasks excluded) |
| T4 — Log stopwatch wait | 57 % (student role correctly excluded) |
| T5 — Submit feedback | 100 % completion |
| Wait-time prediction MAE | **2.0 min** |

Seed the database with the empirical data:
```bash
python scripts/seed_feedback.py
```

---

## Error handling

| Situation | Behaviour |
|---|---|
| Invalid input (negative count, rating > 5, wrong type, missing field) | `422` with field-level validation message |
| Detector unavailable at runtime (camera offline, model error) | `/queue` returns `503` with reason; `/readings` manual entry still works |
| Bad detector config at start-up (unknown name, missing `CANTEEN_VIDEO`, packages not installed) | Server refuses to start with a clear message |
| `GET /forecast` with no stored data | `404 No readings yet` |
| Invalid values reaching the database | Rejected by `CHECK` constraints, transaction rolled back |
| Dashboard cannot reach the backend | Shows "Backend Offline" badge; falls back to stochastic simulation; retries every 4 s |

---

## Testing

```bash
pip install -r requirements.txt
pytest -v
```

Coverage report is written to `htmlcov/index.html`.

### Test files

| File | What it covers |
|---|---|
| `tests/test_predictor.py` | Threshold boundaries (6/7, 14/15), wait maths, monotonicity, forecast, invalid inputs |
| `tests/test_database.py` | CRUD, ordering, hourly grouping, MAE, constraint violations (temp DB per test) |
| `tests/test_detector.py` | Detector selection from env, demo-rush cycle, missing-package error boundary |
| `tests/test_metrics.py` | Accuracy metric maths and invalid input |
| `tests/test_api.py` | All 10 endpoints, validation errors, `503` on detector failure, dashboard route, CORS |
| `tests/test_integration.py` | End-to-end: demo detector drives full API cycle, feedback pipeline, MAE assertion |

`YoloDetector` (real camera path) is covered by `scripts/evaluate_detector.py` on real footage
rather than by unit tests — isolating network/hardware dependencies from CI.

---

## Git workflow

The repository was developed using feature branches and atomic commits.  To replay
the full history from scratch:

```bash
bash scripts/git_workflow.sh
```

Branches created:

| Branch | Contents |
|---|---|
| `feature/predictor` | `predictor.py` + unit tests |
| `feature/database` | `database.py` + unit tests |
| `feature/detector` | `detector.py`, `metrics.py`, evaluation script, download script + tests |
| `feature/dashboard` | `frontend/index.html`, JS engine (backend-polling), page components, CSS |
| `feature/api` | `main.py` with full docstrings, unit + integration tests |
| `feature/user-testing` | `docs/user-testing.md`, `scripts/seed_feedback.py` |
| `docs/readme` | `README.md`, `scripts/git_workflow.sh` |

---

## Limitations

- Default detector is `demo` (looping synthetic data).  Real accuracy requires your own canteen footage.
- Forecast is a short-term linear trend, not a trained time-series model.
- Wait time assumes one fixed service rate (calibrate via stopwatch data).
- CORS is open (`*`) for prototyping — restrict to known origins before deployment.
- Hours in `/stats/hourly` are UTC.
- No authentication; add OAuth2 / API keys before exposing publicly.
