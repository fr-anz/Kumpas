# Kumpas model training

This folder contains the offline phrase-video dataset and the reproducible
training pipeline for the first Kumpas recognition baseline.

The baseline labels are `YES`, `NO`, `DEAF`, `THANK YOU`, `SLOW`, and
`DON’T UNDERSTAND`. It is not suitable for continuous camera inference until a
representative `NO_SIGN` class is collected and included.

## Environment

Use Python 3.12. The checked-in dependency versions are recorded in
`requirements.txt`.

```powershell
.\.python312\python.exe -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The official MediaPipe Hand Landmarker model is expected at
`models/hand_landmarker.task`.

## Pipeline

Run commands from this `training` directory:

```powershell
.\.venv\Scripts\python.exe scripts\validate_dataset.py
.\.venv\Scripts\python.exe scripts\build_splits.py
.\.venv\Scripts\python.exe scripts\extract_landmarks.py
.\.venv\Scripts\python.exe scripts\train_model.py
.\.venv\Scripts\python.exe scripts\evaluate_model.py
```

Generated landmark arrays are written to `cache/baseline-v2/`. Models,
reports, metrics, and plots are written to `artifacts/baseline-v2/`.

Baseline v2 uses wrist-relative, palm-scaled hand geometry. One-hand signs
always occupy the first feature slot, preventing camera mirroring from moving
the same hand into a feature slot that the model did not see during training.

Offline extraction samples 40 non-contiguous frames from the central 70% of
each standardized clip, excluding idle lead-in/out, so it uses MediaPipe image
mode. The later browser pipeline should use video or live-stream mode for
consecutive camera frames.

## Evaluation warning

The source dataset does not document signer identity. The pipeline groups clips
by filename stem as a conservative proxy, but all results remain provisional
until that assumption is verified from authoritative dataset metadata.

## Webcam test

The webcam tester performs one prediction only after a manual four-second
capture. It does not run continuous recognition because the model has no
`NO_SIGN` class.

Check model loading and camera access first:

```powershell
.\.venv\Scripts\python.exe scripts\webcam_test.py --self-test
.\.venv\Scripts\python.exe scripts\webcam_test.py --probe
```

Start the interactive tester:

```powershell
.\.venv\Scripts\python.exe scripts\webcam_test.py
```

Press Space, perform one sign for the full capture, then wait for the label and
confidence. Press `Q` or Escape to quit. If camera index `0` is unavailable,
try `--camera 1`.
