"""
Grouped 5-fold cross-validation over the full cached dataset.

Combines the train/validation/test landmark caches, then evaluates the
current model architecture with StratifiedGroupKFold so no group (filename
stem / signer proxy) appears in both the training and evaluation side of a
fold. Reports per-fold accuracy and macro F1 with mean and standard
deviation for honest error bars on a small dataset.

Usage:
    python scripts/cross_validate.py [--folds 5] [--epochs 60]
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import numpy as np

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import accuracy_score, f1_score, recall_score
from sklearn.model_selection import GroupShuffleSplit, StratifiedGroupKFold

sys.path.insert(0, str(Path(__file__).resolve().parent))
from train_model import BalancedAugmentSequence, build_model, load_config

ROOT = Path(__file__).resolve().parents[1]


def load_all_splits(cache_dir: Path) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    sequences, labels, groups = [], [], []
    for split_name in ("train", "validation", "test"):
        with np.load(cache_dir / f"{split_name}.npz") as data:
            sequences.append(data["X"].astype(np.float32))
            labels.append(data["y"].astype(np.int64))
            groups.append(data["group_ids"].astype(str))
    return np.concatenate(sequences), np.concatenate(labels), np.concatenate(groups)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--folds", type=int, default=5)
    parser.add_argument("--epochs", type=int, default=None)
    args = parser.parse_args()

    config = load_config()
    training = config["training"]
    seed = config["random_seed"]
    epochs = args.epochs if args.epochs is not None else training["epochs"]
    num_classes = len(config["labels"])
    cache_dir = ROOT / config["paths"]["cache_dir"]

    X, y, groups = load_all_splits(cache_dir)
    print(f"Dataset: {len(y)} clips, {len(np.unique(groups))} groups, {num_classes} classes")

    outer = StratifiedGroupKFold(n_splits=args.folds, shuffle=True, random_state=seed)
    fold_metrics: list[dict] = []

    for fold_index, (fit_indices, test_indices) in enumerate(
        outer.split(X, y, groups), start=1
    ):
        keras.backend.clear_session()
        np.random.seed(seed + fold_index)
        tf.random.set_seed(seed + fold_index)

        # Carve a group-exclusive early-stopping split out of the training
        # side so the held-out fold is never used for model selection.
        inner = GroupShuffleSplit(n_splits=1, test_size=0.15, random_state=seed + fold_index)
        train_local, val_local = next(
            inner.split(X[fit_indices], y[fit_indices], groups[fit_indices])
        )
        train_indices = fit_indices[train_local]
        val_indices = fit_indices[val_local]

        model = build_model(config)
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=training["learning_rate"]),
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        train_data = BalancedAugmentSequence(
            X[train_indices],
            y[train_indices],
            num_classes=num_classes,
            batch_size=training["batch_size"],
            seed=seed + fold_index,
            augmentation=training["augmentation"],
            balanced=training["balanced_sampling"],
        )
        model.fit(
            train_data,
            validation_data=(
                X[val_indices],
                keras.utils.to_categorical(y[val_indices], num_classes=num_classes),
            ),
            epochs=epochs,
            callbacks=[
                keras.callbacks.EarlyStopping(
                    monitor="val_loss",
                    patience=training["early_stopping_patience"],
                    restore_best_weights=True,
                ),
                keras.callbacks.ReduceLROnPlateau(
                    monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6
                ),
            ],
            verbose=0,
        )

        predictions = model.predict(X[test_indices], verbose=0).argmax(axis=1)
        y_true = y[test_indices]
        label_indices = list(range(num_classes))
        per_class_recall = recall_score(
            y_true, predictions, labels=label_indices, average=None, zero_division=0
        )
        present = np.isin(label_indices, y_true)
        fold_result = {
            "fold": fold_index,
            "train_size": int(len(train_indices)),
            "test_size": int(len(test_indices)),
            "accuracy": float(accuracy_score(y_true, predictions)),
            "macro_f1": float(
                f1_score(y_true, predictions, labels=label_indices, average="macro", zero_division=0)
            ),
            "minimum_class_recall_present": float(per_class_recall[present].min()),
        }
        fold_metrics.append(fold_result)
        print(
            f"Fold {fold_index}/{args.folds}: "
            f"accuracy={fold_result['accuracy']:.3f} "
            f"macro_f1={fold_result['macro_f1']:.3f} "
            f"min_recall={fold_result['minimum_class_recall_present']:.3f} "
            f"(n={fold_result['test_size']})"
        )

    accuracies = np.array([fold["accuracy"] for fold in fold_metrics])
    macro_f1s = np.array([fold["macro_f1"] for fold in fold_metrics])
    summary = {
        "version": config["version"],
        "folds": args.folds,
        "epochs": epochs,
        "sample_count": int(len(y)),
        "group_count": int(len(np.unique(groups))),
        "accuracy_mean": float(accuracies.mean()),
        "accuracy_std": float(accuracies.std()),
        "macro_f1_mean": float(macro_f1s.mean()),
        "macro_f1_std": float(macro_f1s.std()),
        "fold_metrics": fold_metrics,
        "note": (
            "Groups are filename-stem signer proxies; results remain provisional "
            "until authoritative signer metadata exists."
        ),
    }
    output_dir = ROOT / config["paths"]["artifact_dir"] / "evaluation"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "cross_validation.json"
    output_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(
        f"\n{args.folds}-fold grouped CV: "
        f"accuracy {summary['accuracy_mean']:.3f} ± {summary['accuracy_std']:.3f}, "
        f"macro F1 {summary['macro_f1_mean']:.3f} ± {summary['macro_f1_std']:.3f}"
    )
    print(f"Report: {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
