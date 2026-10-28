"""Measure YOLO detection accuracy and speed against your own manual counts.

Step 1 - write a label template (frame numbers to count by hand):
    python scripts/evaluate_detector.py --video canteen.mp4 --template labels.csv --every 30

Step 2 - watch the video, type the number of people you count at each frame
         into the `count` column of labels.csv.

Step 3 - run the evaluation:
    python scripts/evaluate_detector.py --video canteen.mp4 --labels labels.csv

Requires: pip install ultralytics opencv-python
"""
import argparse
import csv
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.detector import DetectorError, YoloDetector  # noqa: E402
from app.metrics import detection_metrics  # noqa: E402


def write_template(video: str, path: str, every: int) -> None:
    import cv2
    cap = cv2.VideoCapture(video)
    total, fps = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)), cap.get(cv2.CAP_PROP_FPS) or 25
    if total <= 0:
        raise SystemExit(f"Cannot read video: {video}")
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["frame", "seconds", "count"])
        for frame in range(0, total, every):
            w.writerow([frame, round(frame / fps, 1), ""])
    print(f"Wrote {path}. Fill in the 'count' column, then run with --labels.")


def read_labels(path: str):
    rows = []
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            if str(r["count"]).strip() != "":
                rows.append((int(r["frame"]), int(r["count"])))
    if not rows:
        raise SystemExit("No labelled rows found: fill in the 'count' column first.")
    return rows


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("--video", required=True)
    ap.add_argument("--labels")
    ap.add_argument("--template")
    ap.add_argument("--every", type=int, default=30, help="frame step for --template")
    ap.add_argument("--model", default="yolov8n.pt")
    ap.add_argument("--conf", type=float, default=0.4)
    a = ap.parse_args()

    if a.template:
        return write_template(a.video, a.template, a.every)
    if not a.labels:
        ap.error("--labels is required (or use --template)")

    labels = read_labels(a.labels)
    try:
        det = YoloDetector(source=a.video, model_path=a.model, conf=a.conf)
    except DetectorError as e:
        raise SystemExit(str(e))

    predicted, times = [], []
    for frame, _ in labels:
        t0 = time.perf_counter()
        predicted.append(det.count_at(frame))
        times.append((time.perf_counter() - t0) * 1000)

    result = detection_metrics(predicted, [c for _, c in labels])
    result["avg_inference_ms"] = round(sum(times) / len(times), 1)
    print(f"Model {a.model}, confidence {a.conf}")
    for k, v in result.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
