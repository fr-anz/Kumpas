from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]


def load_config() -> dict:
    with (ROOT / "config.json").open(encoding="utf-8") as handle:
        return json.load(handle)


def normalized_video_path(video_base: str, csv_path: str) -> str:
    relative = Path(csv_path.replace("\\", "/"))
    return (Path(video_base) / relative).as_posix()


def contains_every_label(frame: pd.DataFrame, labels: list[str]) -> bool:
    return set(frame["label"]) == set(labels)


def main() -> int:
    config = load_config()
    paths = config["paths"]
    labels = config["labels"]
    train_source = pd.read_csv(ROOT / paths["train_csv"]).assign(
        source_split="train"
    )
    test_source = pd.read_csv(ROOT / paths["test_csv"]).assign(source_split="test")
    selected = pd.concat([train_source, test_source], ignore_index=True)
    selected = selected[selected["label"].isin(labels)].copy()
    selected["video_path"] = selected["vid_path"].map(
        lambda value: normalized_video_path(paths["video_base"], value)
    )
    selected["group_id"] = selected["vid_path"].map(
        lambda value: Path(value.replace("\\", "/")).stem
    )
    label_to_index = {label: index for index, label in enumerate(labels)}
    selected["class_index"] = selected["label"].map(label_to_index)

    groups = sorted(selected["group_id"].unique(), key=lambda value: int(value))
    ratios = config["split_ratios"]
    validation_count = max(1, round(len(groups) * ratios["validation"]))
    test_count = max(1, round(len(groups) * ratios["test"]))
    rng = np.random.default_rng(config["random_seed"])

    split_frames: dict[str, pd.DataFrame] | None = None
    split_groups: dict[str, list[str]] | None = None
    for _ in range(10_000):
        shuffled = np.array(groups, dtype=str)
        rng.shuffle(shuffled)
        test_groups = shuffled[:test_count].tolist()
        validation_groups = shuffled[test_count : test_count + validation_count].tolist()
        train_groups = shuffled[test_count + validation_count :].tolist()
        candidates = {
            "train": selected[selected["group_id"].isin(train_groups)].copy(),
            "validation": selected[
                selected["group_id"].isin(validation_groups)
            ].copy(),
            "test": selected[selected["group_id"].isin(test_groups)].copy(),
        }
        if all(contains_every_label(frame, labels) for frame in candidates.values()):
            split_frames = candidates
            split_groups = {
                "train": sorted(train_groups, key=int),
                "validation": sorted(validation_groups, key=int),
                "test": sorted(test_groups, key=int),
            }
            break

    if split_frames is None or split_groups is None:
        print("Could not create group-exclusive splits containing every class.")
        return 1

    artifact_dir = ROOT / paths["artifact_dir"]
    split_dir = artifact_dir / "splits"
    split_dir.mkdir(parents=True, exist_ok=True)
    columns = [
        "video_path",
        "label",
        "class_index",
        "group_id",
        "source_split",
    ]
    for split_name, frame in split_frames.items():
        frame = frame.sort_values(["class_index", "group_id", "video_path"])
        frame[columns].to_csv(split_dir / f"{split_name}.csv", index=False)

    all_group_sets = [set(values) for values in split_groups.values()]
    group_overlap = any(
        all_group_sets[left] & all_group_sets[right]
        for left in range(len(all_group_sets))
        for right in range(left + 1, len(all_group_sets))
    )
    report = {
        "provisional": True,
        "group_assumption": "The video filename stem is treated as a signer/session proxy.",
        "group_overlap": group_overlap,
        "groups": split_groups,
        "rows": {name: int(len(frame)) for name, frame in split_frames.items()},
        "class_counts": {
            name: {
                label: int((frame["label"] == label).sum()) for label in labels
            }
            for name, frame in split_frames.items()
        },
    }
    report_path = artifact_dir / "split_report.json"
    report_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(json.dumps(report, indent=2, ensure_ascii=False))
    print(f"Split manifests: {split_dir}")
    return 1 if group_overlap else 0


if __name__ == "__main__":
    sys.exit(main())
