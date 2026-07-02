"""
export_tfjs.py — Convert the trained Keras model to TensorFlow.js format.

Usage (from repo root, with training venv activated):
    python training/scripts/export_tfjs.py

Outputs to public/models/sign-model/:
    model.json          — architecture + weight manifest
    group1-shard*.bin   — weight data
    labels.json         — ordered class names
    metadata.json       — inference parameters (sequence_length, thresholds, etc.)

The output files are consumed directly by ml/tfjsPredictor.ts in the Next.js app.
Run this script after any retraining to keep the browser model in sync.
"""

import json
import pathlib
import sys
import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import sys
import types

# Define a recursive mock module class that handles special attributes correctly
class RecursiveMock(types.ModuleType):
    def __init__(self, name):
        super().__init__(name)
        self.__file__ = None
        self.__path__ = None

    def __getattr__(self, name):
        if name in ('__file__', '__path__', '__name__'):
            return None
        m = RecursiveMock(name)
        setattr(self, name, m)
        return m

# Mock modules to prevent import conflicts
sys.modules['tensorflow_hub'] = RecursiveMock('tensorflow_hub')
sys.modules['tensorflow_decision_forests'] = RecursiveMock('tensorflow_decision_forests')
sys.modules['jax'] = RecursiveMock('jax')
sys.modules['jax.experimental'] = RecursiveMock('jax.experimental')
sys.modules['jax.experimental.jax2tf'] = RecursiveMock('jax2tf')




# ---------------------------------------------------------------------------
# Locate the best available trained model.
# ---------------------------------------------------------------------------
REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
TRAINING_DIR = REPO_ROOT / "training"
ARTIFACTS_DIR = TRAINING_DIR / "artifacts"
OUTPUT_DIR = REPO_ROOT / "public" / "models" / "sign-model"

# Prefer the latest artifact directory by version string.
def find_best_model() -> pathlib.Path:
    candidates = sorted(ARTIFACTS_DIR.glob("*/model/best.keras"), reverse=True)
    if not candidates:
        # Fall back to any .keras file.
        candidates = sorted(ARTIFACTS_DIR.glob("**/*.keras"), reverse=True)
    if not candidates:
        sys.exit(
            f"[export_tfjs] No trained model found under {ARTIFACTS_DIR}. "
            "Run `python -m dvc repro` first."
        )
    chosen = candidates[0]
    print(f"[export_tfjs] Using model: {chosen.relative_to(REPO_ROOT)}")
    return chosen


def load_training_config() -> dict:
    """Load training config.json to pull sequence_length, labels, thresholds."""
    config_path = TRAINING_DIR / "config.json"
    if config_path.exists():
        with open(config_path) as f:
            return json.load(f)
    return {}


def load_evaluation_results(artifact_dir: pathlib.Path) -> dict:
    """Try to load webcam_test parameters from the evaluation output."""
    eval_path = artifact_dir / "evaluation" / "results.json"
    if eval_path.exists():
        with open(eval_path) as f:
            return json.load(f)
    return {}


# ---------------------------------------------------------------------------
# Main conversion.
# ---------------------------------------------------------------------------
def main() -> None:
    # Guard: tensorflowjs must be installed inside the training venv.
    try:
        import tensorflowjs as tfjs  # type: ignore
    except ImportError as e:
        import traceback
        traceback.print_exc()
        sys.exit(
            "[export_tfjs] Missing dependencies. Run:\n"
            "    pip install tensorflowjs\n"
            "inside the training venv before running this script."
        )

    import tensorflow as tf  # type: ignore

    model_path = find_best_model()
    artifact_dir = model_path.parents[1]  # e.g. artifacts/baseline-v3

    print("[export_tfjs] Loading Keras model…")
    model: tf.keras.Model = tf.keras.models.load_model(str(model_path))
    model.summary()

    # Pull metadata from config + evaluation.
    config = load_training_config()
    eval_results = load_evaluation_results(artifact_dir)

    labels: list[str] = config.get("labels", [])
    if not labels:
        # Infer from model output shape.
        output_units = model.output_shape[-1]
        labels = [f"class_{i}" for i in range(output_units)]
        print(
            f"[export_tfjs] WARNING: No labels found in config.json. "
            f"Using generic names for {output_units} classes."
        )

    sequence_length: int = config.get("sequence_length", 40)
    feature_count: int = config.get("feature_count", 128)

    # Webcam test thresholds (used by tfjsPredictor.ts at inference time).
    webcam_cfg = config.get("webcam_test", eval_results.get("webcam_test", {}))
    confidence_threshold: float = webcam_cfg.get("confidence_threshold", 0.8)
    min_hand_coverage: float = webcam_cfg.get("minimum_hand_coverage", 0.25)
    min_top_two_margin: float = webcam_cfg.get("minimum_top_two_margin", 0.15)

    # ---------------------------------------------------------------------------
    # Write outputs.
    # ---------------------------------------------------------------------------
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[export_tfjs] Converting to TF.js format -> {OUTPUT_DIR}")
    tfjs.converters.save_keras_model(model, str(OUTPUT_DIR))

    # labels.json — consumed by tfjsPredictor.loadSignModel()
    labels_path = OUTPUT_DIR / "labels.json"
    with open(labels_path, "w") as f:
        json.dump(labels, f, indent=2)
    print(f"[export_tfjs] Wrote {labels_path.relative_to(REPO_ROOT)}")

    # metadata.json — inference parameters consumed by tfjsPredictor.ts
    meta = {
        "sequence_length": sequence_length,
        "feature_count": feature_count,
        "webcam_test": {
            "confidence_threshold": confidence_threshold,
            "minimum_hand_coverage": min_hand_coverage,
            "minimum_top_two_margin": min_top_two_margin,
        },
        "labels": labels,
        "artifact_dir": str(artifact_dir.relative_to(REPO_ROOT)),
    }
    meta_path = OUTPUT_DIR / "metadata.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"[export_tfjs] Wrote {meta_path.relative_to(REPO_ROOT)}")

    print(
        f"\n[export_tfjs] Done!\n"
        f"  Labels   : {labels}\n"
        f"  Sequence : {sequence_length} frames x {feature_count} features\n"
        f"  Threshold: {confidence_threshold:.0%} confidence, "
        f"{min_hand_coverage:.0%} hand coverage\n"
        f"  Output   : {OUTPUT_DIR.relative_to(REPO_ROOT)}/\n"
        f"\nRestart `npm run dev` for the browser to pick up the new model."
    )


if __name__ == "__main__":
    main()
