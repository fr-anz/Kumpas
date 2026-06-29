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
        X_train,
        y_train,
        validation_data=(X_validation, y_validation),
        epochs=training["epochs"],
        batch_size=training["batch_size"],
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
