"""Crowd-level classification and wait-time prediction.

Pure functions only (no I/O), so they are easy to unit test.
"""
import math
from typing import Sequence

# Thresholds on the number of people in the queue.
LOW_MAX = 6
MEDIUM_MAX = 14

# Average students served per minute at the counter. Calibrate this
# from your own field stopwatch measurements.
DEFAULT_SERVICE_RATE = 1.1

# Minimum readings before a trend line is trusted.
MIN_POINTS_FOR_TREND = 3


def crowd_level(count: int) -> str:
    """Map a people count to 'LOW', 'MEDIUM' or 'HIGH'."""
    if count < 0:
        raise ValueError("count must be >= 0")
    if count <= LOW_MAX:
        return "LOW"
    if count <= MEDIUM_MAX:
        return "MEDIUM"
    return "HIGH"


def estimate_wait_minutes(count: int, service_rate: float = DEFAULT_SERVICE_RATE,
                          counters: int = 1) -> int:
    """Estimated wait = people in queue / (service rate x open counters)."""
    if count < 0:
        raise ValueError("count must be >= 0")
    if service_rate <= 0:
        raise ValueError("service_rate must be > 0")
    if counters < 1:
        raise ValueError("counters must be >= 1")
    if count == 0:
        return 0
    return max(1, math.ceil(count / (service_rate * counters)))


def forecast_count(recent_counts: Sequence[int], horizon_steps: int = 3) -> int:
    """Forecast queue length `horizon_steps` readings ahead.

    Fits a straight line (least squares) through the recent readings and
    extrapolates it. Needs at least MIN_POINTS_FOR_TREND readings; with fewer
    it returns the last value, because a line through 2 points is unreliable.
    Never returns a negative number.
    """
    if horizon_steps < 0:
        raise ValueError("horizon_steps must be >= 0")
    n = len(recent_counts)
    if n == 0:
        raise ValueError("recent_counts must not be empty")
    if n < MIN_POINTS_FOR_TREND:
        return max(0, recent_counts[-1])

    xs = range(n)
    mean_x = (n - 1) / 2
    mean_y = sum(recent_counts) / n
    denom = sum((x - mean_x) ** 2 for x in xs)
    slope = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, recent_counts)) / denom
    predicted = recent_counts[-1] + slope * horizon_steps
    return max(0, round(predicted))


def advice(level: str, wait: int) -> str:
    """Plain-language message shown to students."""
    if level == "LOW":
        return f"Short wait (about {wait} min). Go now."
    if level == "MEDIUM":
        return f"Moderate queue (about {wait} min). Your call."
    return f"Long queue (about {wait} min). Consider coming back later."
