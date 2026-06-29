from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


ROOT = Path(__file__).resolve().parents[1]


def load_config() -> dict:
    with (ROOT / "config.json").open(encoding="utf-8") as handle:
        return json.load(handle)


def config_hash(config: dict, model_path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(json.dumps(config, sort_keys=True, ensure_ascii=False).encode("utf-8"))
    digest.update(model_path.read_bytes())
    return digest.hexdigest()


def create_landmarker(config: dict, model_path: Path) -> vision.HandLandmarker:
    settings = config["hand_landmarker"]
    options = vision.HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=str(model_path)),
        running_mode=vision.RunningMode.IMAGE,
        num_hands=settings["num_hands"],
        min_hand_detection_confidence=settings["min_hand_detection_confidence"],
        min_hand_presence_confidence=settings["min_hand_presence_confidence"],
        min_tracking_confidence=settings["min_tracking_confidence"],
    )
    return vision.HandLandmarker.create_from_options(options)


def result_to_features(result: vision.HandLandmarkerResult) -> np.ndarray:
    features = np.zeros(128, dtype=np.float32)
    hands: list[np.ndarray] = []
    for landmarks in result.hand_landmarks:
        coordinates = np.array(
            [[point.x, point.y, point.z] for point in landmarks], dtype=np.float32
        )
        wrist = coordinates[0].copy()
        centered = coordinates - wrist
        palm_scale = float(np.linalg.norm(centered[9, :2]))
        if palm_scale < 1e-6:
            palm_scale = float(np.linalg.norm(centered[:, :2], axis=1).max())
        if palm_scale < 1e-6:
            continue
        hands.append(centered / palm_scale)

    # A single detected hand always occupies slot zero. This avoids a severe
    # train/webcam mismatch when selfie mirroring changes MediaPipe handedness.
    # Two hands are ordered by their original wrist x-coordinate from the
    # Hand Landmarker result, which is deterministic within an image.
    if len(hands) == 2:
        wrist_x = [result.hand_landmarks[index][0].x for index in range(2)]
        hands = [hands[index] for index in np.argsort(wrist_x)]

    for slot, coordinates in enumerate(hands[:2]):
        offset = slot * 63
        features[offset : offset + 63] = coordinates.reshape(-1)
        features[126 + slot] = 1.0
    return features


def extract_video(
    video_path: Path,
    config: dict,
    landmarker: vision.HandLandmarker,
) -> tuple[np.ndarray, dict]:
    sequence_length = config["sequence_length"]
    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise RuntimeError(f"Could not open {video_path}")
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = capture.get(cv2.CAP_PROP_FPS)
    if frame_count <= 0:
        capture.release()
        raise RuntimeError(f"Video has no frames: {video_path}")

    crop = config["temporal_crop"]
    first_frame = round((frame_count - 1) * crop["start_ratio"])
    last_frame = round((frame_count - 1) * crop["end_ratio"])
    frame_indices = np.rint(
        np.linspace(first_frame, last_frame, sequence_length)
    ).astype(int)
    sequence = np.zeros((sequence_length, config["feature_count"]), dtype=np.float32)
    read_failures = 0

    for sequence_index, frame_index in enumerate(frame_indices):
        capture.set(cv2.CAP_PROP_POS_FRAMES, int(frame_index))
        ok, frame = capture.read()
        if not ok:
            read_failures += 1
            continue
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = landmarker.detect(image)
        sequence[sequence_index] = result_to_features(result)
    capture.release()

    diagnostics = {
        "video_path": video_path.as_posix(),
        "source_frame_count": frame_count,
        "fps": float(fps),
        "read_failures": read_failures,
        "primary_hand_coverage": float(sequence[:, 126].mean()),
        "secondary_hand_coverage": float(sequence[:, 127].mean()),
        "any_hand_coverage": float((sequence[:, 126:128].max(axis=1)).mean()),
    }
    return sequence, diagnostics


def extract_split(
    split_name: str,
    manifest: pd.DataFrame,
    config: dict,
    landmarker: vision.HandLandmarker,
    cache_dir: Path,
    limit: int | None,
) -> dict:
    if limit is not None:
        manifest = manifest.head(limit).copy()
    sequences: list[np.ndarray] = []
    labels: list[int] = []
    video_paths: list[str] = []
    group_ids: list[str] = []
    diagnostics: list[dict] = []

    for index, row in enumerate(manifest.itertuples(index=False), start=1):
        relative_path = Path(row.video_path)
        sequence, sample_diagnostics = extract_video(
            ROOT / relative_path, config, landmarker
        )
        sequences.append(sequence)
        labels.append(int(row.class_index))
        video_paths.append(relative_path.as_posix())
        group_ids.append(str(row.group_id))
        diagnostics.append(sample_diagnostics)
        print(
            f"[{split_name}] {index}/{len(manifest)} {row.label}: "
            f"hand coverage={sample_diagnostics['any_hand_coverage']:.1%}"
        )

    output_path = cache_dir / f"{split_name}.npz"
    np.savez_compressed(
        output_path,
        X=np.stack(sequences).astype(np.float32),
        y=np.asarray(labels, dtype=np.int64),
        video_paths=np.asarray(video_paths),
        group_ids=np.asarray(group_ids),
    )
    diagnostics_path = cache_dir / f"{split_name}_diagnostics.csv"
    pd.DataFrame(diagnostics).to_csv(diagnostics_path, index=False)
    return {
        "samples": len(sequences),
        "output": output_path.as_posix(),
        "diagnostics": diagnostics_path.as_posix(),
        "mean_any_hand_coverage": float(
            np.mean([item["any_hand_coverage"] for item in diagnostics])
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    config = load_config()
    paths = config["paths"]
    model_path = ROOT / paths["hand_landmarker_model"]
    if not model_path.is_file():
        print(f"Missing Hand Landmarker model: {model_path}")
        return 1

    split_dir = ROOT / paths["artifact_dir"] / "splits"
    cache_dir = ROOT / paths["cache_dir"]
    cache_dir.mkdir(parents=True, exist_ok=True)
    fingerprint = config_hash(config, model_path)
    metadata_path = cache_dir / "extraction_metadata.json"

    if metadata_path.is_file() and not args.force and args.limit is None:
        existing = json.loads(metadata_path.read_text(encoding="utf-8"))
        outputs_exist = all(
            (cache_dir / f"{name}.npz").is_file()
            for name in ("train", "validation", "test")
        )
        if existing.get("config_hash") == fingerprint and outputs_exist:
            print("Landmark cache is current; use --force to rebuild it.")
            return 0

    report = {
        "config_hash": fingerprint,
        "provisional": True,
        "feature_layout": {
            "shape": [config["sequence_length"], config["feature_count"]],
            "primary_hand_landmarks": [0, 62],
            "secondary_hand_landmarks": [63, 125],
            "primary_hand_present": 126,
            "secondary_hand_present": 127,
            "coordinates": "Wrist-relative x/y/z divided by wrist-to-middle-MCP palm scale",
            "hand_order": "One hand always uses slot zero; two hands are ordered by wrist x-position",
            "extraction_running_mode": "IMAGE for independently sampled frames",
            "temporal_crop": config["temporal_crop"],
        },
        "splits": {},
    }
    with create_landmarker(config, model_path) as landmarker:
        for split_name in ("train", "validation", "test"):
            manifest_path = split_dir / f"{split_name}.csv"
            if not manifest_path.is_file():
                print(f"Missing split manifest: {manifest_path}")
                return 1
            manifest = pd.read_csv(manifest_path, dtype={"group_id": str})
            report["splits"][split_name] = extract_split(
                split_name,
                manifest,
                config,
                landmarker,
                cache_dir,
                args.limit,
            )

    metadata_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
