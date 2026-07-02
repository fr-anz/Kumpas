# Controlled-demo training result

Current run: `baseline-v12`, 2026-07-02

## Scope

- Labels: `YES`, `NO`, `DEAF`, `THANK YOU`, `SLOW`, `DON’T UNDERSTAND`, `BARANGAY CLEARANCE`, `BLOTTER REPORT`, `CEDULA`, `DRIVERS LICENSE`, `LAND DEED`, `NO_SIGN`
- Selected unique videos: 248
- Content-exclusive split: 176 train, 36 validation, 36 test
- Test support: 3 clips per class
- Input: 40 sampled frames × 128 MediaPipe hand features
- Model: two-layer temporal Conv1D classifier
- Training: class-balanced batches with dynamic temporal and landmark augmentation

## Result

- Test accuracy: 0.944 (34/36)
- Test macro F1: 0.943
- Minimum per-class recall: 0.667
- Numeric metric gate: passed
- Integration ready: no

`BARANGAY CLEARANCE` and `LAND DEED` each recalled 2 of 3 held-out clips. All
other classes recalled 3 of 3. `CEDULA` and `DRIVERS LICENSE` each had one
false-positive assignment, giving each 0.75 precision.

## Required interpretation

Baseline-v12 improves the controlled offline result while expanding from seven
to twelve classes. Exact duplicate contents are collapsed before splitting,
and the known Certificate of Residency contents were removed from the Drivers
License metadata. It is still provisional because authoritative signer/session
metadata is unavailable and the held-out test has only 36 videos.

The browser now detects motion-delimited sign intervals, requires agreement
across three boundary variants, applies confidence and top-two-margin gates,
and requires a confident `NO_SIGN` result before accepting another phrase.
Live false-activation and signer-independent performance remain unverified.

## Artifacts

- Model: `artifacts/baseline-v12/model/best.keras`
- Metrics: `artifacts/baseline-v12/evaluation/metrics.json`
- Confusion matrix: `artifacts/baseline-v12/evaluation/confusion_matrix.png`
- Dataset report: `artifacts/baseline-v12/dataset_report.json`
- Split report: `artifacts/baseline-v12/split_report.json`
- Landmark cache: `cache/baseline-v12/`
