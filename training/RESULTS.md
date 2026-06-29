# Baseline training result

Current run: `baseline-v2`, 2026-06-29

## Scope

- Labels: `YES`, `NO`, `DEAF`, `THANK YOU`, `SLOW`, `DON’T UNDERSTAND`
- Selected videos: 124
- Group-proxy split: 90 train, 16 validation, 18 test
- Test support: 3 clips per class
- Input: 40 sampled frames × 128 MediaPipe hand features
- Model: two-layer temporal Conv1D classifier, 66,790 parameters

## Baseline-v2 correction

Baseline v1 stored raw image-relative coordinates and placed a one-hand sign in
a left/right slot based on MediaPipe handedness. A webcam with different scale,
position, or selfie mirroring could therefore place the same sign in a feature
distribution the model had never seen.

Baseline v2:

- centers landmarks on the wrist;
- scales landmarks by wrist-to-middle-MCP palm length;
- always places a one-hand sign in the primary feature slot;
- uses the same transformation in offline extraction and webcam testing.

Baseline-v1 artifacts remain under `artifacts/baseline-v1/` for comparison.

## Result

- Test accuracy: 1.000
- Test macro F1: 1.000
- Minimum per-class recall: 1.000
- Winning confidence: 0.940 minimum, 0.998 median, 1.000 maximum
- Webcam-path cached self-test: `YES`, 0.988 confidence
- Numeric metric gate: passed
- Integration ready: no

## Required interpretation

This is a successful pipeline baseline, not production evidence. Filename stems
were used as signer/session group proxies because authoritative participant
metadata is unavailable. The held-out test contains only 18 videos, and the
dataset has no `NO_SIGN` class. Continuous camera inference would therefore
force unrelated motion into one of the six known labels.

Do not export this model into the PWA as a user-facing recognizer until signer
grouping is verified and representative `NO_SIGN` data is collected, retrained,
and evaluated.

## Artifacts

- Model: `artifacts/baseline-v2/model/best.keras`
- Metrics: `artifacts/baseline-v2/evaluation/metrics.json`
- Confusion matrix: `artifacts/baseline-v2/evaluation/confusion_matrix.png`
- Dataset report: `artifacts/baseline-v2/dataset_report.json`
- Split report: `artifacts/baseline-v2/split_report.json`
- Landmark cache: `cache/baseline-v2/`
