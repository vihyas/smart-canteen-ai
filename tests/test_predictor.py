"""Unit tests for crowd levels, wait estimates and forecasting."""
import pytest

from app import predictor as p


# ---- crowd_level: boundaries and error boundary ----
@pytest.mark.parametrize("count,expected", [
    (0, "LOW"), (6, "LOW"),          # upper edge of LOW
    (7, "MEDIUM"), (14, "MEDIUM"),   # edges of MEDIUM
    (15, "HIGH"), (200, "HIGH"),
])
def test_crowd_level_boundaries(count, expected):
    assert p.crowd_level(count) == expected


def test_crowd_level_rejects_negative():
    with pytest.raises(ValueError):
        p.crowd_level(-1)


# ---- estimate_wait_minutes ----
def test_wait_is_zero_for_empty_queue():
    assert p.estimate_wait_minutes(0) == 0


def test_wait_is_at_least_one_minute_when_someone_is_waiting():
    assert p.estimate_wait_minutes(1) == 1


def test_wait_uses_service_rate():
    assert p.estimate_wait_minutes(10, service_rate=1.0) == 10
    assert p.estimate_wait_minutes(10, service_rate=2.0) == 5


def test_more_counters_reduce_wait():
    assert p.estimate_wait_minutes(20, counters=2) < p.estimate_wait_minutes(20, counters=1)


def test_wait_never_decreases_as_queue_grows():
    waits = [p.estimate_wait_minutes(n) for n in range(0, 60)]
    assert waits == sorted(waits)


@pytest.mark.parametrize("kwargs", [
    {"count": -5},
    {"count": 5, "service_rate": 0},
    {"count": 5, "service_rate": -1},
    {"count": 5, "counters": 0},
])
def test_wait_rejects_invalid_input(kwargs):
    with pytest.raises(ValueError):
        p.estimate_wait_minutes(**kwargs)


# ---- forecast_count ----
def test_forecast_rising_trend_goes_up():
    assert p.forecast_count([2, 4, 6, 8], horizon_steps=2) == 12


def test_forecast_falling_trend_goes_down():
    assert p.forecast_count([20, 16, 12, 8], horizon_steps=1) == 4


def test_forecast_flat_trend_stays_flat():
    assert p.forecast_count([9, 9, 9, 9], horizon_steps=5) == 9


def test_forecast_never_negative():
    assert p.forecast_count([6, 4, 2, 0], horizon_steps=10) == 0


def test_forecast_single_reading_returns_it():
    assert p.forecast_count([7]) == 7


def test_forecast_two_readings_is_not_extrapolated():
    # a line through 2 points is unreliable, so the last value is returned
    assert p.forecast_count([3, 12], horizon_steps=3) == 12


def test_forecast_rejects_empty_and_negative_horizon():
    with pytest.raises(ValueError):
        p.forecast_count([])
    with pytest.raises(ValueError):
        p.forecast_count([1, 2], horizon_steps=-1)


# ---- advice ----
def test_advice_mentions_wait_time():
    assert "12 min" in p.advice("HIGH", 12)
