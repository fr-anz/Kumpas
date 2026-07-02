from __future__ import annotations

import json
import os
import random
import sys
from pathlib import Path

import numpy as np

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
import tensorflow as tf
from tensorflow import keras


ROOT = Path(__file__).resolve().parents[1]


def load_config() -> dict:
    with (ROOT / "config.json").open(encoding="utf-8") as handle:
        return json.load(handle)


def load_split(cache_dir: Path, split_name: str) -> tuple[np.ndarray, np.ndarray]:
    with np.load(cache_dir / f"{split_name}.npz") as data:
        return data["X"].astype(np.float32), data["y"].astype(np.int64)


def augment_sequence(
    sequence: np.ndarray, settings: dict, rng: np.random.Generator
) -> np.ndarray:
    """Apply geometry-preserving noise to one landmark sequence."""
    augmented = sequence.copy()
    length = len(augmented)

    jitter = int(settings["temporal_jitter_frames"])
    scale_low, scale_high = settings["temporal_scale_range"]
    scale = rng.uniform(scale_low, scale_high)
    center = ((length - 1) / 2.0) + rng.uniform(-jitter, jitter)
    half_span = ((length - 1) * scale) / 2.0
    positions = np.linspace(center - half_span, center + half_span, length)
    positions = np.clip(positions, 0, length - 1)
    left = np.floor(positions).astype(int)
    right = np.ceil(positions).astype(int)
    weight = (positions - left).astype(np.float32)[:, None]
    augmented = (augmented[left] * (1.0 - weight)) + (augmented[right] * weight)
    augmented[:, 126:128] = (augmented[:, 126:128] >= 0.5).astype(np.float32)

    angle = np.deg2rad(
        rng.uniform(-settings["max_rotation_degrees"], settings["max_rotation_degrees"])
    )
    cosine, sine = np.cos(angle), np.sin(angle)
    for slot in range(2):
        present = augmented[:, 126 + slot] > 0.5
        coordinates = augmented[:, slot * 63 : (slot + 1) * 63].reshape(
            length, 21, 3
        )
        x = coordinates[:, :, 0].copy()
        y = coordinates[:, :, 1].copy()
        coordinates[:, :, 0] = (cosine * x) - (sine * y)
        coordinates[:, :, 1] = (sine * x) + (cosine * y)
        noise = rng.normal(
            0.0, settings["coordinate_noise_stddev"], size=coordinates.shape
        ).astype(np.float32)
        coordinates[present] += noise[present]

        mask = rng.random((length, 21)) < settings["landmark_mask_probability"]
        mask &= present[:, None]
        coordinates[mask] = 0.0
        coordinates[~present] = 0.0

    dropped = rng.random(length) < settings["frame_drop_probability"]
    for frame_index in np.flatnonzero(dropped):
        source_index = max(0, frame_index - 1)
        augmented[frame_index] = augmented[source_index]
    return augmented.astype(np.float32)


class BalancedAugmentSequence(keras.utils.Sequence):
    def __init__(
        self,
        X: np.ndarray,
        y: np.ndarray,
        *,
        batch_size: int,
        seed: int,
        augmentation: dict,
        balanced: bool,
    ) -> None:
        super().__init__()
        self.X = X
        self.y = y
        self.batch_size = batch_size
        self.seed = seed
        self.augmentation = augmentation
        self.balanced = balanced
        self.epoch = -1
        self.indices = np.empty(0, dtype=np.int64)
        self.on_epoch_end()

    def __len__(self) -> int:
        return int(np.ceil(len(self.indices) / self.batch_size))

    def __getitem__(self, batch_index: int) -> tuple[np.ndarray, np.ndarray]:
        start = batch_index * self.batch_size
        indices = self.indices[start : start + self.batch_size]
        batch = self.X[indices].copy()
        if self.augmentation.get("enabled", False):
            rng = np.random.default_rng(
                self.seed + (self.epoch * 1_000_003) + batch_index
            )
            batch = np.stack(
                [augment_sequence(sequence, self.augmentation, rng) for sequence in batch]
            )
        return batch, self.y[indices]

    def on_epoch_end(self) -> None:
        self.epoch += 1
        rng = np.random.default_rng(self.seed + self.epoch)
        if self.balanced:
            class_indices = [np.flatnonzero(self.y == label) for label in np.unique(self.y)]
            target_count = max(len(indices) for indices in class_indices)
            self.indices = np.concatenate(
                [rng.choice(indices, target_count, replace=True) for indices in class_indices]
            )
        else:
            self.indices = np.arange(len(self.y), dtype=np.int64)
        rng.shuffle(self.indices)


def build_model(config: dict) -> keras.Model:
    inputs = keras.Input(
        shape=(config["sequence_length"], config["feature_count"]),
        name="landmark_sequence",
    )
    x = keras.layers.Conv1D(64, 5, padding="same", name="temporal_conv_1")(inputs)
    x = keras.layers.BatchNormalization(name="batch_norm_1")(x)
    x = keras.layers.Activation("relu", name="relu_1")(x)
    x = keras.layers.MaxPooling1D(2, name="temporal_pool")(x)
    x = keras.layers.Conv1D(96, 3, padding="same", name="temporal_conv_2")(x)
    x = keras.layers.BatchNormalization(name="batch_norm_2")(x)
    x = keras.layers.Activation("relu", name="relu_2")(x)
    x = keras.layers.GlobalAveragePooling1D(name="temporal_average")(x)
    x = keras.layers.Dropout(0.3, name="dropout_1")(x)
    x = keras.layers.Dense(64, activation="relu", name="embedding")(x)
    x = keras.layers.Dropout(0.2, name="dropout_2")(x)
    outputs = keras.layers.Dense(
        len(config["labels"]), activation="softmax", name="sign_probabilities"
    )(x)
    model_name = f"kumpas_{config['version'].replace('-', '_')}"
    return keras.Model(inputs, outputs, name=model_name)


def main() -> int:
    config = load_config()
    paths = config["paths"]
    cache_dir = ROOT / paths["cache_dir"]
    artifact_dir = ROOT / paths["artifact_dir"] / "model"
    artifact_dir.mkdir(parents=True, exist_ok=True)

    required = [cache_dir / f"{name}.npz" for name in ("train", "validation")]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        print(f"Missing landmark caches: {missing}")
        return 1

    seed = config["random_seed"]
    random.seed(seed)
    np.random.seed(seed)
    tf.random.set_seed(seed)
    try:
        tf.config.experimental.enable_op_determinism()
    except RuntimeError:
        pass

    X_train, y_train = load_split(cache_dir, "train")
    X_validation, y_validation = load_split(cache_dir, "validation")
    model = build_model(config)
    training = config["training"]
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=training["learning_rate"]),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    train_data = BalancedAugmentSequence(
        X_train,
        y_train,
        batch_size=training["batch_size"],
        seed=seed,
        augmentation=training["augmentation"],
        balanced=training["balanced_sampling"],
    )

    best_model_path = artifact_dir / "best.keras"
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=training["early_stopping_patience"],
            restore_best_weights=True,
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6
        ),
        keras.callbacks.ModelCheckpoint(
            filepath=best_model_path,
            monitor="val_loss",
            save_best_only=True,
        ),
    ]
    history = model.fit(
        train_data,
        validation_data=(X_validation, y_validation),
        epochs=training["epochs"],
        callbacks=callbacks,
        verbose=2,
    )
    model.save(artifact_dir / "final.keras")
    (artifact_dir / "history.json").write_text(
        json.dumps(
            {key: [float(value) for value in values] for key, values in history.history.items()},
            indent=2,
        ),
        encoding="utf-8",
    )
    (artifact_dir / "labels.json").write_text(
        json.dumps(config["labels"], indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (artifact_dir / "config_snapshot.json").write_text(
        json.dumps(config, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Best model: {best_model_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
