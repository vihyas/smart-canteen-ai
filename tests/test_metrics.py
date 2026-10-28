"""Tests for detector accuracy metrics."""
import pytest

from app.metrics import detection_metrics


def test_perfect_detection():
    m = detection_metrics([3, 5, 8], [3, 5, 8])
    assert m == {"frames": 3, "mae_people": 0.0, "bias_people": 0.0,
                 "exact_pct": 100.0, "within_one_pct": 100.0}


def test_mixed_errors():
    # errors: +1, -2, 0, +3  -> MAE 1.5, bias +0.5
    m = detection_metrics([5, 8, 4, 13], [4, 10, 4, 10])
    assert m["mae_people"] == 1.5
    assert m["bias_people"] == 0.5
    assert m["exact_pct"] == 25.0
    assert m["within_one_pct"] == 50.0


def test_undercounting_gives_negative_bias():
    assert detection_metrics([2, 3], [5, 6])["bias_people"] == -3.0


@pytest.mark.parametrize("pred,act", [
    ([1, 2], [1]),        # length mismatch
    ([], []),             # nothing to compare
    ([-1], [0]),          # negative count
])
def test_invalid_input_rejected(pred, act):
    with pytest.raises(ValueError):
        detection_metrics(pred, act)
