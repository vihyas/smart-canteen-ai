"""Accuracy metrics for comparing detector counts with manual (ground-truth) counts."""
from typing import Sequence


def detection_metrics(predicted: Sequence[int], actual: Sequence[int]) -> dict:
    """Compare per-frame detector counts with hand-counted values.

    Returns the number of frames, mean absolute error (people), bias
    (positive = over-counting), and the share of frames that were exactly
    right or within one person.
    """
    if len(predicted) != len(actual):
        raise ValueError("predicted and actual must have the same length")
    if not predicted:
        raise ValueError("at least one frame is required")
    if any(v < 0 for v in list(predicted) + list(actual)):
        raise ValueError("counts must be >= 0")

    n = len(predicted)
    errors = [p - a for p, a in zip(predicted, actual)]
    return {
        "frames": n,
        "mae_people": round(sum(abs(e) for e in errors) / n, 2),
        "bias_people": round(sum(errors) / n, 2),
        "exact_pct": round(100 * sum(e == 0 for e in errors) / n, 1),
        "within_one_pct": round(100 * sum(abs(e) <= 1 for e in errors) / n, 1),
    }
