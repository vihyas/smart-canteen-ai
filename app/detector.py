"""Sources of the 'people in queue' count.

Selected at start-up with the CANTEEN_DETECTOR environment variable
(see `detector_from_env`):

  simulated  lunch-rush curve based on the real clock (default)
  demo       fast looping lunch rush, for presentations and recordings
  yolo       real person detection with YOLOv8-nano on a camera or video file
"""
import math
import os
import random
from datetime import datetime
from typing import Mapping


class DetectorError(RuntimeError):
    """Raised when a detector cannot be created or cannot produce a count."""


def _rush_count(t: float, rng: random.Random) -> int:
    """Queue size for t in [0, 1] across a lunch window, peaking at t = 0.58."""
    bell = math.exp(-((t - 0.58) ** 2) / (2 * 0.16 ** 2))
    return max(0, round(2 + bell * 20 + rng.uniform(-1.5, 1.5)))


class SimulatedDetector:
    """Synthetic counts that follow the real clock (peak near 12:45)."""
    name = "simulated"

    def __init__(self, seed=None):
        self._rng = random.Random(seed)

    def count_people(self) -> int:
        now = datetime.now()
        window_start, window_len = 11 * 60, 180          # 11:00 - 14:00
        t = (now.hour * 60 + now.minute - window_start) / window_len
        if not 0 <= t <= 1:          # outside lunch time: quiet baseline
            t = -1.0
        return _rush_count(t, self._rng)


class DemoRushDetector:
    """Loops through a whole lunch rush every `period` calls."""
    name = "demo"

    def __init__(self, period: int = 60, seed=None):
        if period < 2:
            raise ValueError("period must be >= 2")
        self._period = period
        self._step = 0
        self._rng = random.Random(seed)

    def count_people(self) -> int:
        t = (self._step % self._period) / (self._period - 1)
        self._step += 1
        return _rush_count(t, self._rng)


class YoloDetector:
    """Counts people (COCO class 0) with YOLOv8 on a camera or video file.

    Needs the optional packages `ultralytics` and `opencv-python`.
    Only the count leaves this class: frames are never stored.
    """
    name = "yolov8n"

    def __init__(self, source=0, model_path="yolov8n.pt", conf=0.4):
        try:
            import cv2
            from ultralytics import YOLO
        except ImportError as e:
            raise DetectorError(
                "Install ultralytics and opencv-python to use YoloDetector") from e
        self._cv2 = cv2
        self._model = YOLO(model_path)
        self._conf = conf
        self._cap = cv2.VideoCapture(source)
        if not self._cap.isOpened():
            raise DetectorError(f"Cannot open video source: {source!r}")

    def _count_in_frame(self, frame) -> int:
        result = self._model(frame, classes=[0], conf=self._conf, verbose=False)[0]
        return len(result.boxes)

    def count_people(self) -> int:
        ok, frame = self._cap.read()
        if not ok:  # loop recorded videos
            self._cap.set(self._cv2.CAP_PROP_POS_FRAMES, 0)
            ok, frame = self._cap.read()
            if not ok:
                raise DetectorError("No frame available from source")
        return self._count_in_frame(frame)

    def count_at(self, frame_index: int) -> int:
        """Count people in one specific frame (used by the evaluation script)."""
        self._cap.set(self._cv2.CAP_PROP_POS_FRAMES, frame_index)
        ok, frame = self._cap.read()
        if not ok:
            raise DetectorError(f"Cannot read frame {frame_index}")
        return self._count_in_frame(frame)


def detector_from_env(env: Mapping[str, str] = os.environ):
    """Build the detector chosen by CANTEEN_DETECTOR (default 'demo').

    For 'yolo' also set CANTEEN_VIDEO (a file path, or 0 for a webcam) and
    optionally CANTEEN_MODEL (default yolov8n.pt) and CANTEEN_CONF (default 0.4).
    """
    kind = env.get("CANTEEN_DETECTOR", "demo").strip().lower()
    if kind == "simulated":
        return SimulatedDetector()
    if kind == "demo":
        return DemoRushDetector()
    if kind == "yolo":
        video = env.get("CANTEEN_VIDEO")
        if not video:
            raise DetectorError("CANTEEN_VIDEO must be set when CANTEEN_DETECTOR=yolo")
        source = int(video) if video.isdigit() else video
        return YoloDetector(source=source,
                            model_path=env.get("CANTEEN_MODEL", "yolov8n.pt"),
                            conf=float(env.get("CANTEEN_CONF", "0.4")))
    raise DetectorError(
        f"Unknown CANTEEN_DETECTOR {kind!r} (use simulated, demo or yolo)")
