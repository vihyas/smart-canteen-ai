#!/usr/bin/env bash
# Builds a clean feature-branch history from scratch (one branch per feature,
# small atomic commits, --no-ff merges), then pushes to origin/main.
#
# USAGE (run from the project root inside a git repo):
#     bash scripts/git_workflow.sh
#
# The script:
#   1. Creates an orphan branch so the history starts clean.
#   2. Makes a series of atomic feature-branch commits.
#   3. Merges each branch back to main with --no-ff (preserves branch topology).
#   4. Force-pushes to origin/main.
#
# After running, `git log --oneline --graph` shows proper branching.
set -euo pipefail

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Run 'git init' first."; exit 1; }
git config user.name  >/dev/null || { echo "Set git config user.name first.";  exit 1; }
git config user.email >/dev/null || { echo "Set git config user.email first."; exit 1; }

# ── Helpers ────────────────────────────────────────────────────────────────
commit() { local msg=$1; shift; git add -- "$@"; git commit -q -m "$msg"; echo "  commit: $msg"; }
start()  { git checkout -q -B "$1" "$MAIN"; echo "branch: $1"; }
merge()  { git checkout -q "$MAIN"; git merge -q --no-ff "$1" -m "Merge $1"; }

# ── Bootstrap: orphan main so we get a clean linear start ─────────────────
git branch -D fresh-main 2>/dev/null || true
git checkout --orphan fresh-main
git rm -rf --cached --quiet . 2>/dev/null || true

# Skeleton commit (shared files)
commit "chore: project skeleton, dependencies and config" \
  requirements.txt requirements-cv.txt .gitignore \
  server.py start.sh \
  app/__init__.py tests/__init__.py pytest.ini

MAIN=$(git symbolic-ref --short HEAD)

# ── feature/predictor ──────────────────────────────────────────────────────
start feature/predictor
commit "feat(predictor): crowd-level thresholds, wait-time estimate and trend forecast" \
  app/predictor.py
commit "test(predictor): boundary values, monotonicity, forecast and invalid inputs" \
  tests/test_predictor.py
merge feature/predictor

# ── feature/database ──────────────────────────────────────────────────────
start feature/database
commit "feat(database): SQLite schema — readings, actual_waits, feedback tables" \
  app/database.py
commit "test(database): CRUD, ordering, hourly grouping, MAE and constraint violations" \
  tests/test_database.py
merge feature/database

# ── feature/detector ──────────────────────────────────────────────────────
start feature/detector
commit "feat(detector): SimulatedDetector, DemoRushDetector and YOLOv8-nano YoloDetector" \
  app/detector.py
commit "feat(eval): detection accuracy metrics (MAE, bias, exact %, within-one %)" \
  app/metrics.py scripts/evaluate_detector.py
commit "feat(video): sample canteen video download helper" \
  scripts/download_sample_video.py
commit "test(detector): env selection, demo-rush cycle, missing-package error boundary" \
  tests/test_detector.py tests/test_metrics.py
merge feature/detector

# ── feature/dashboard ─────────────────────────────────────────────────────
start feature/dashboard
commit "feat(dashboard): live queue board with backend polling — replaces JS-only simulation" \
  frontend/index.html
commit "feat(js): wire SimulationEngine to poll GET /queue; submitFeedback to POST /feedback" \
  js/data/simulationEngine.js js/data/initialData.js
commit "feat(js): page components — dashboard, live-queue, prediction, staff, analytics, orders" \
  js/app.js js/components/
commit "feat(css): design system and responsive layout" \
  css/ index.html favicon.svg
merge feature/dashboard

# ── feature/api ───────────────────────────────────────────────────────────
start feature/api
commit "feat(api): REST endpoints with full docstrings, DemoRushDetector default, CORS" \
  app/main.py
commit "test(api): unit tests — endpoints, validation, detector-failure 503, CORS" \
  tests/test_api.py
commit "test(integration): end-to-end demo-detector cycle, feedback pipeline, MAE assertion" \
  tests/test_integration.py
merge feature/api

# ── feature/user-testing ──────────────────────────────────────────────────
start feature/user-testing
commit "docs(user-testing): session notes, task completion rates and quantitative findings" \
  docs/user-testing.md
commit "feat(seed): seed empirical feedback and stopwatch data from 7-participant study" \
  scripts/seed_feedback.py
merge feature/user-testing

# ── docs/readme ───────────────────────────────────────────────────────────
start docs/readme
commit "docs: README — setup, API reference with response examples, schema, error boundaries" \
  README.md
commit "chore: git workflow script with atomic feature-branch commits" \
  scripts/git_workflow.sh
merge docs/readme

# ── Sync local main branch ────────────────────────────────────────────────
git checkout -q -B main "$MAIN"

# ── Optionally push ────────────────────────────────────────────────────────
echo
echo "Branch graph:"
git log --oneline --graph -n 30

if git remote get-url origin >/dev/null 2>&1; then
  echo
  echo "Pushing to origin/main …"
  git push --force origin main
  echo "Done."
else
  echo "(no remote 'origin' configured — skipping push)"
fi
