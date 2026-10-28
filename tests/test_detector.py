"""Tests for detector selection and the non-camera detectors."""
import pytest

from app import detector as d


def test_default_detector_is_demo():
    """Default changed from 'simulated' to 'demo' so the API is always live."""
    assert d.detector_from_env({}).name == "demo"


def test_env_explicitly_selects_simulated():
    assert d.detector_from_env({"CANTEEN_DETECTOR": "simulated"}).name == "simulated"


def test_env_selects_demo_detector():
    assert d.detector_from_env({"CANTEEN_DETECTOR": "Demo "}).name == "demo"


def test_unknown_detector_name_is_rejected():
    with pytest.raises(d.DetectorError, match="Unknown CANTEEN_DETECTOR"):
        d.detector_from_env({"CANTEEN_DETECTOR": "laser"})


def test_yolo_requires_video_source():
    with pytest.raises(d.DetectorError, match="CANTEEN_VIDEO"):
        d.detector_from_env({"CANTEEN_DETECTOR": "yolo"})


def test_yolo_without_packages_gives_clear_error(monkeypatch):
    # Simulate ultralytics/opencv not being installed.
    import builtins
    real_import = builtins.__import__

    def fake_import(name, *a, **k):
        if name in ("cv2", "ultralytics"):
            raise ImportError(name)
        return real_import(name, *a, **k)

    monkeypatch.setattr(builtins, "__import__", fake_import)
    with pytest.raises(d.DetectorError, match="ultralytics"):
        d.YoloDetector(source="x.mp4")


def test_demo_detector_values_are_valid_counts():
    det = d.DemoRushDetector(period=40, seed=1)
    counts = [det.count_people() for _ in range(80)]
    assert all(isinstance(c, int) and 0 <= c <= 40 for c in counts)


def test_demo_detector_peaks_mid_cycle():
    det = d.DemoRushDetector(period=40, seed=1)
    cycle = [det.count_people() for _ in range(40)]
    assert max(cycle[18:28]) > max(cycle[:5]) + 8      # rush is clearly higher than start
    assert max(cycle[18:28]) > max(cycle[-5:]) + 8     # and than the end


def test_demo_detector_repeats_each_period():
    det = d.DemoRushDetector(period=30, seed=7)
    first = [det.count_people() for _ in range(30)]
    second = [det.count_people() for _ in range(30)]
    assert abs(first.index(max(first)) - second.index(max(second))) <= 3


def test_demo_detector_rejects_tiny_period():
    with pytest.raises(ValueError):
        d.DemoRushDetector(period=1)


def test_simulated_detector_returns_non_negative_int():
    c = d.SimulatedDetector(seed=3).count_people()
    assert isinstance(c, int) and c >= 0
