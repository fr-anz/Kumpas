from __future__ import annotations

import json
import statistics
import sys
from pathlib import Path

import cv2
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]


def load_config() -> dict:
    with (ROOT / "config.json").open(encoding="utf-8") as handle:
        return json.load(handle)


def resolve_video(video_base: Path, csv_path: str) -> Path:
    return video_base.joinpath(*Path(csv_path.replace("\\", "/")).parts)


def summary(values: list[float]) -> dict[str, float]:
    return {
        "min": float(min(values)),
        "median": float(statistics.median(values)),
        "max": float(max(values)),
    }


def main() -> int:
    config = load_config()
    paths = config["paths"]
    labels_df = pd.read_csv(ROOT / paths["labels_csv"])
    train_df = pd.read_csv(ROOT / paths["train_csv"])
    test_df = pd.read_csv(ROOT / paths["test_csv"])
    video_base = ROOT / paths["video_base"]
    selected_labels = config["labels"]
    errors: list[str] = []

    expected_ids = list(range(len(labels_df)))
    actual_ids = sorted(labels_df["id"].astype(int).tolist())
    if actual_ids != expected_ids:
        errors.append("labels.csv IDs are not unique and contiguous from zero")

    label_lookup = dict(zip(labels_df["id"].astype(int), labels_df["label"]))
    combined = pd.concat(
        [
            train_df.assign(source_split="train"),
            test_df.assign(source_split="test"),
        ],
        ignore_index=True,
    )

    if combined["vid_path"].duplicated().any():
        errors.append("duplicate video paths exist in the supplied metadata")

    missing_selected = sorted(set(selected_labels) - set(labels_df["label"]))
    if missing_selected:
        errors.append(f"selected labels are missing: {missing_selected}")

    mismatches = combined[
        combined.apply(
            lambda row: label_lookup.get(int(row["id_label"])) != row["label"], axis=1
        )
    ]
    if not mismatches.empty:
        errors.append(f"{len(mismatches)} rows disagree with labels.csv")

    resolved_paths = combined["vid_path"].map(
        lambda value: resolve_video(video_base, value)
    )
    missing_paths = [str(path) for path in resolved_paths if not path.is_file()]
    if missing_paths:
        errors.append(f"{len(missing_paths)} metadata paths do not exist")

    selected = combined[combined["label"].isin(selected_labels)].copy()
    selected["resolved_path"] = selected["vid_path"].map(
        lambda value: resolve_video(video_base, value)
    )

    frame_counts: list[float] = []
    frame_rates: list[float] = []
    durations: list[float] = []
    widths: list[float] = []
    heights: list[float] = []
    undecodable: list[str] = []

    for path in selected["resolved_path"]:
        capture = cv2.VideoCapture(str(path))
        frame_count = capture.get(cv2.CAP_PROP_FRAME_COUNT)
        fps = capture.get(cv2.CAP_PROP_FPS)
        width = capture.get(cv2.CAP_PROP_FRAME_WIDTH)
        height = capture.get(cv2.CAP_PROP_FRAME_HEIGHT)
        ok, _ = capture.read()
        capture.release()

        if not ok or frame_count <= 0:
            undecodable.append(str(path))
            continue

        frame_counts.append(frame_count)
        frame_rates.append(fps)
        widths.append(width)
        heights.append(height)
        durations.append(frame_count / fps if fps > 0 else 0.0)

    if undecodable:
        errors.append(f"{len(undecodable)} selected videos are undecodable")

    train_groups = {
        Path(value.replace("\\", "/")).stem for value in train_df["vid_path"]
    }
    test_groups = {
        Path(value.replace("\\", "/")).stem for value in test_df["vid_path"]
    }
    source_group_overlap = sorted(train_groups & test_groups)

    artifact_dir = ROOT / paths["artifact_dir"]
    artifact_dir.mkdir(parents=True, exist_ok=True)
    report = {
        "status": "failed" if errors else "passed",
        "provisional": True,
        "warnings": [
            "Signer identity is undocumented; filename stems are only a group proxy.",
            "The six-label baseline has no NO_SIGN class and is not suitable for continuous camera inference.",
        ],
        "errors": errors,
        "dataset": {
            "label_count": int(len(labels_df)),
            "metadata_video_count": int(len(combined)),
            "train_rows": int(len(train_df)),
            "test_rows": int(len(test_df)),
            "missing_video_paths": len(missing_paths),
            "source_split_group_overlap": source_group_overlap,
        },
        "selected": {
            "labels": selected_labels,
            "video_count": int(len(selected)),
            "counts": {
                label: int((selected["label"] == label).sum())
                for label in selected_labels
            },
            "undecodable": undecodable,
            "frame_count": summary(frame_counts) if frame_counts else None,
            "fps": summary(frame_rates) if frame_rates else None,
            "duration_seconds": summary(durations) if durations else None,
            "width": summary(widths) if widths else None,
            "height": summary(heights) if heights else None,
        },
    }
    report_path = artifact_dir / "dataset_report.json"
    report_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(json.dumps(report, indent=2, ensure_ascii=False))
    print(f"Dataset report: {report_path}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
