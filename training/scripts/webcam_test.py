from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
from tensorflow import keras

from extract_landmarks import create_landmarker, result_to_features


ROOT = Path(__file__).resolve().parents[1]
WINDOW_NAME = "Kumpas webcam test"


def load_config() -> dict:
    with (ROOT / "config.json").open(encoding="utf-8") as handle:
        return json.load(handle)


def open_camera(index: int) -> cv2.VideoCapture:
    capture = cv2.VideoCapture(index, cv2.CAP_DSHOW)
    if capture.isOpened():
        capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        return capture
    capture.release()
    capture = cv2.VideoCapture(index)
    capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    return capture


def prepare_frame(frame: np.ndarray, width: int, height: int) -> np.ndarray:
    return cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)


def put_lines(
    frame: np.ndarray,
    lines: list[tuple[str, tuple[int, int, int]]],
    start_y: int = 32,
) -> None:
    y = start_y
    for text, color in lines:
        cv2.putText(
            frame,
            text,
            (16, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (0, 0, 0),
            4,
            cv2.LINE_AA,
        )
        cv2.putText(
            frame,
            text,
            (16, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            color,
            2,
            cv2.LINE_AA,
        )
        y += 28


def capture_clip(
    capture: cv2.VideoCapture,
    seconds: float,
    width: int,
    height: int,
) -> tuple[list[np.ndarray], bool]:
    frames: list[np.ndarray] = []
    started = time.perf_counter()
    cancelled = False

    while True:
        elapsed = time.perf_counter() - started
        if elapsed >= seconds:
            break
        ok, frame = capture.read()
        if not ok:
            continue
        frame = prepare_frame(frame, width, height)
        frames.append(frame.copy())
        remaining = max(0.0, seconds - elapsed)
        preview = frame.copy()
        put_lines(
            preview,
            [
                (f"RECORDING  {remaining:0.1f}s", (40, 40, 255)),
                ("Perform one sign now", (255, 255, 255)),
                ("Q / Esc: cancel", (220, 220, 220)),
            ],
        )
        progress = min(1.0, elapsed / seconds)
        cv2.rectangle(preview, (16, height - 30), (width - 16, height - 16), (60, 60, 60), -1)
        cv2.rectangle(
            preview,
            (16, height - 30),
            (16 + round((width - 32) * progress), height - 16),
            (30, 180, 255),
            -1,
        )
        cv2.imshow(WINDOW_NAME, preview)
        key = cv2.waitKey(1) & 0xFF
        if key in (ord("q"), 27):
            cancelled = True
            break
    return frames, cancelled


def extract_sequence(
    frames: list[np.ndarray],
    config: dict,
    landmarker,
) -> tuple[np.ndarray, float]:
    if not frames:
        raise RuntimeError("No webcam frames were captured.")
    crop = config["temporal_crop"]
    first_frame = round((len(frames) - 1) * crop["start_ratio"])
    last_frame = round((len(frames) - 1) * crop["end_ratio"])
    indices = np.rint(
        np.linspace(first_frame, last_frame, config["sequence_length"])
    ).astype(int)
    sequence = np.zeros(
        (config["sequence_length"], config["feature_count"]), dtype=np.float32
    )

    for sequence_index, frame_index in enumerate(indices):
        rgb = cv2.cvtColor(frames[int(frame_index)], cv2.COLOR_BGR2RGB)
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        sequence[sequence_index] = result_to_features(landmarker.detect(image))

    coverage = float(sequence[:, 126:128].max(axis=1).mean())
    return sequence, coverage


def predict(model: keras.Model, sequence: np.ndarray) -> np.ndarray:
    return model.predict(sequence[np.newaxis, ...], verbose=0)[0]


def run_self_test(config: dict, model: keras.Model) -> int:
    cache_path = ROOT / config["paths"]["cache_dir"] / "test.npz"
    if not cache_path.is_file():
        print(f"Missing test cache: {cache_path}")
        return 1
    with np.load(cache_path) as data:
        sequence = data["X"][0].astype(np.float32)
        expected = int(data["y"][0])
    probabilities = predict(model, sequence)
    predicted = int(probabilities.argmax())
    result = {
        "expected": config["labels"][expected],
        "predicted": config["labels"][predicted],
        "confidence": float(probabilities[predicted]),
        "passed": predicted == expected,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result["passed"] else 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Manually capture a webcam sign and classify it with the baseline model."
    )
    parser.add_argument("--camera", type=int, default=0, help="OpenCV camera index")
    parser.add_argument(
        "--probe", action="store_true", help="Read one webcam frame and exit"
    )
    parser.add_argument(
        "--self-test", action="store_true", help="Test model loading on cached data"
    )
    args = parser.parse_args()

    config = load_config()
    paths = config["paths"]
    webcam = config["webcam_test"]
    model_path = ROOT / paths["artifact_dir"] / "model" / "best.keras"
    landmarker_path = ROOT / paths["hand_landmarker_model"]

    if not model_path.is_file():
        print(f"Missing trained model: {model_path}")
        return 1
    model = keras.models.load_model(model_path)
    if args.self_test:
        return run_self_test(config, model)

    # Open camera AFTER model load to avoid DirectShow timeout on Windows.
    capture = open_camera(args.camera)
    if not capture.isOpened():
        print(f"Could not open camera index {args.camera}.")
        print("Close other camera applications or try --camera 1.")
        return 1
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, webcam["width"])
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, webcam["height"])

    # Warm-up: discard frames until the camera auto-exposes and stabilizes.
    warmup_deadline = time.perf_counter() + 2.0
    while time.perf_counter() < warmup_deadline:
        capture.read()
        time.sleep(0.03)

    if args.probe:
        ok = False
        frame = None
        for _ in range(10):
            ok, frame = capture.read()
            if ok:
                break
        capture.release()
        if not ok or frame is None:
            print(f"Camera index {args.camera} opened but returned no frame.")
            return 1
        print(
            json.dumps(
                {
                    "camera": args.camera,
                    "opened": True,
                    "frame_width": int(frame.shape[1]),
                    "frame_height": int(frame.shape[0]),
                },
                indent=2,
            )
        )
        return 0

    if not landmarker_path.is_file():
        capture.release()
        print(f"Missing Hand Landmarker model: {landmarker_path}")
        return 1

    latest_result: dict | None = None
    try:
        cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
        with create_landmarker(config, landmarker_path) as landmarker:
            while True:
                ok, frame = capture.read()
                if not ok:
                    print("The webcam stopped returning frames.")
                    return 1
                frame = prepare_frame(frame, webcam["width"], webcam["height"])
                preview = frame.copy()
                lines = [
                    ("SPACE: capture a 4-second sign", (255, 255, 255)),
                    ("Q / Esc: quit", (220, 220, 220)),
                ]
                if latest_result is not None:
                    confident = (
                        latest_result["confidence"] >= webcam["confidence_threshold"]
                        and latest_result["coverage"] >= webcam["minimum_hand_coverage"]
                    )
                    status = "RESULT" if confident else "UNSURE"
                    color = (60, 220, 60) if confident else (0, 180, 255)
                    lines.extend(
                        [
                            (
                                f"{status}: {latest_result['label']}  {latest_result['confidence']:.1%}",
                                color,
                            ),
                            (
                                f"Hand coverage: {latest_result['coverage']:.1%}",
                                color,
                            ),
                            (
                                "Top 3: " + " | ".join(latest_result["top_three"]),
                                (255, 255, 255),
                            ),
                        ]
                    )
                put_lines(preview, lines)
                cv2.putText(
                    preview,
                    "TEST ONLY - NO_SIGN class is missing",
                    (16, webcam["height"] - 18),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    (0, 0, 255),
                    2,
                    cv2.LINE_AA,
                )
                cv2.imshow(WINDOW_NAME, preview)
                key = cv2.waitKey(1) & 0xFF
                if key in (ord("q"), 27):
                    break
                if key != ord(" "):
                    continue

                frames, cancelled = capture_clip(
                    capture,
                    webcam["capture_seconds"],
                    webcam["width"],
                    webcam["height"],
                )
                if cancelled:
                    break
                processing = frames[-1].copy()
                put_lines(processing, [("Processing 40 frames...", (255, 255, 255))])
                cv2.imshow(WINDOW_NAME, processing)
                cv2.waitKey(1)
                sequence, coverage = extract_sequence(frames, config, landmarker)
                probabilities = predict(model, sequence)
                top_indices = np.argsort(probabilities)[::-1][:3]
                latest_result = {
                    "label": config["labels"][int(top_indices[0])],
                    "confidence": float(probabilities[top_indices[0]]),
                    "coverage": coverage,
                    "top_three": [
                        f"{config['labels'][int(index)]} {probabilities[index]:.0%}"
                        for index in top_indices
                    ],
                }
                print(json.dumps(latest_result, ensure_ascii=False))
    finally:
        capture.release()
        cv2.destroyAllWindows()
    return 0


if __name__ == "__main__":
    sys.exit(main())
