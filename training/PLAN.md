# Implementation Spec

## Goal

Create a reproducible Python training pipeline for a small Filipino Sign Language phrase-recognition baseline that can be exported to TensorFlow.js and consumed by the Kumpas PWA. The first model should prove the end-to-end workflow using a limited set of existing phrase videos before expanding labels or implementing live browser inference.

## Current Behavior

- The repository contains the React/Vite PWA scaffold, but no Python environment, preprocessing scripts, training scripts, trained model, or browser ML integration.
- `training/archive/Collated/` contains 11,700 static alphabet images: 26 labels with 450 images per label.
- `training/clips/clips/` contains 2,130 `.MOV` phrase videos covering 105 labels.
- `training/labels.csv` maps label IDs `0` through `104` to phrase names and categories.
- `training/train.csv` contains 1,704 phrase-video rows and `training/test.csv` contains 426 rows.
- CSV video paths such as `clips\17\6.MOV` resolve relative to `training/clips/`, producing the actual path `training/clips/clips/17/6.MOV`.
- The supplied train and test CSVs do not overlap by video path, but their filename stems overlap completely. If those stems identify signers or recording sessions, the current split leaks identity/session information and must not be used for final evaluation.
- Existing phrase labels include `YES`, `NO`, `DEAF`, `THANK YOU`, `SLOW`, and `DON’T UNDERSTAND`.
- The dataset does not contain the planned MVP labels `HELP`, `HOSPITAL`, or `PAIN`.
- There is no `NO_SIGN` or background class for rejecting idle hands and unrelated movement.
- The development machine currently has Python 3.14, while the intended TensorFlow workflow requires a supported Python version. Python 3.12 is the selected baseline environment.
- FFmpeg is not installed. An NVIDIA RTX 2060 Max-Q is present, but the initial model should run on native Windows CPU to avoid making WSL2/CUDA setup a prerequisite.

## Target Behavior

- A developer can create a Python 3.12 virtual environment inside `training/`, install documented dependencies, and run each pipeline stage from the repository root.
- Dataset validation confirms that labels, CSV rows, paths, decodable videos, and selected classes are consistent before preprocessing starts.
- MediaPipe extracts fixed-length landmark sequences from the selected phrase videos and stores them in a generated cache instead of recomputing them every training run.
- The baseline recognizes these six existing labels:
  - `YES`
  - `NO`
  - `DEAF`
  - `THANK YOU`
  - `SLOW`
  - `DON’T UNDERSTAND`
- A seventh `NO_SIGN` class is required before live-camera integration. The pipeline may be smoke-tested on six labels while collection is pending, but the resulting model must be marked as unsuitable for continuous camera inference.
- Data is split by signer or recording session when identity metadata can be established. If it cannot, metrics must be labeled provisional and must not be presented as real-world generalization results.
- A small, TensorFlow.js-compatible temporal classifier is trained without custom layers.
- Evaluation produces accuracy, macro F1, per-class precision/recall, a confusion matrix, and a machine-readable metrics file.
- The final accepted model is exported into `public/models/sign-model/` as `model.json`, binary weight shards, `labels.json`, and `preprocessing.json`.
- Python and TensorFlow.js predictions are checked for parity before the model is integrated into the app.
- Alphabet images remain untouched and are reserved for a separate future fingerspelling model.

## Relevant Files

- `training/PLAN.md` — this implementation specification.
- `training/labels.csv` — authoritative phrase label metadata.
- `training/train.csv` — supplied provisional training split and video metadata.
- `training/test.csv` — supplied provisional test split and video metadata.
- `training/clips/clips/` — raw phrase-video dataset; read-only input.
- `training/requirements.txt` — to create; Python runtime dependencies for validation, extraction, training, evaluation, and export.
- `training/README.md` — to create; environment setup and exact pipeline commands.
- `training/config.json` — to create; selected labels, frame count, random seed, paths, and model parameters shared across scripts.
- `training/scripts/validate_dataset.py` — to create; validates metadata, paths, video decoding, counts, and split assumptions.
- `training/scripts/extract_landmarks.py` — to create; extracts and normalizes MediaPipe features into the cache.
- `training/scripts/build_splits.py` — to create; creates reproducible grouped train/validation/test manifests.
- `training/scripts/train_model.py` — to create; trains the compact temporal classifier and saves checkpoints/history.
- `training/scripts/evaluate_model.py` — to create; calculates metrics and writes the confusion matrix.
- `training/scripts/export_tfjs.py` — to create; exports the accepted model and its metadata for the PWA.
- `training/cache/` — generated landmark arrays and extraction metadata; do not commit.
- `training/artifacts/` — generated Keras models, metrics, plots, and logs; do not commit.
- `training/data/no_sign/` — to create when background examples are collected.
- `training/signer_groups.csv` — to create if signer/session identity must be mapped manually.
- `public/models/sign-model/` — final browser-ready model output only.
- `.gitignore` — update to exclude raw training data, virtual environments, caches, checkpoints, and temporary artifacts while allowing intentionally exported browser model files.

## Files To Avoid

- Do not rename, move, rewrite, resize, recompress, or delete files under `training/archive/` or `training/clips/`.
- Do not edit `training/labels.csv`, `training/train.csv`, or `training/test.csv` to compensate for path resolution; path handling belongs in the Python pipeline.
- Do not mix alphabet images into the phrase-video classifier.
- Do not modify React components, routes, or app services while implementing the training pipeline.
- Do not add TensorFlow, MediaPipe, OpenCV, or Python artifacts to the JavaScript `package.json`.
- Do not commit `.venv/`, landmark caches, raw datasets, checkpoints, TensorBoard logs, or unaccepted model exports.

## Assumptions

- Phrase recognition is the immediate priority because it supports the app’s camera demo; alphabet/fingerspelling recognition is a separate future model.
- Python 3.12 will be installed and used for the virtual environment.
- Native Windows CPU training is sufficient for the first compact landmark model. WSL2/GPU setup can be considered only if later experiments require it.
- FFmpeg will be installed and available on `PATH` so OpenCV can reliably decode the `.MOV` files.
- The baseline uses both detected hands and preserves a consistent left/right hand slot.
- Each sample is resampled or padded to 40 frames.
- Each hand contributes 21 `(x, y, z)` landmarks. Two additional values indicate whether the left and right hand were detected, producing 128 features per frame.
- Missing hands are represented by zero-filled landmarks with the corresponding detection mask set to zero.
- Landmark normalization must be identical in Python extraction and browser inference. The exact transform is stored in `preprocessing.json`.
- Hand-only landmarks are an intentional baseline limitation. Signs that depend strongly on face contact, facial expression, or body position may require pose/face features later.
- Horizontal flipping is disabled initially because handedness may carry meaning and the dataset’s signing conventions have not been audited.
- Filename stems may represent signers or sessions, but this must be verified rather than assumed.
- The first model is a technical baseline, not a claim of complete FSL translation or production-grade recognition.

## Step-by-Step Implementation

1. Establish the training environment.
   - Install 64-bit Python 3.12.
   - Install FFmpeg and confirm it is available from PowerShell.
   - Create `training/.venv/` and install TensorFlow, MediaPipe, OpenCV, NumPy, pandas, scikit-learn, matplotlib, and TensorFlow.js conversion tooling.
   - Verify TensorFlow imports, MediaPipe imports, and at least one `.MOV` file can be decoded.
   - Record the working dependency versions in `training/requirements.txt`.

2. Add shared configuration and documentation.
   - Create `training/config.json` with dataset roots, metadata paths, selected labels, sequence length `40`, random seed, cache path, artifact path, and export path.
   - Keep path values repository-relative and normalize Windows separators in code.
   - Create `training/README.md` with exact commands for validation, extraction, split creation, training, evaluation, and export.
   - Document that commands run from the repository root.

3. Implement dataset validation before any training.
   - Verify `labels.csv` IDs are unique and contiguous.
   - Verify every train/test metadata row maps to exactly one existing video using `training/clips/` as the CSV path base.
   - Detect duplicate video paths across splits.
   - Confirm selected labels exist and report their sample counts.
   - Attempt to decode every selected video and report unreadable or zero-frame clips.
   - Report frame count, duration, dimensions, and frame-rate distributions.
   - Report filename-stem overlap across supplied splits.
   - Exit with a non-zero status for missing paths, duplicate metadata rows, unknown labels, or undecodable selected videos.
   - Emit `training/artifacts/dataset_report.json` for reproducibility.

4. Resolve signer/session grouping.
   - Inspect multiple labels with matching filename stems to determine whether stems identify the same signer or recording session.
   - Prefer authoritative dataset documentation or contributor metadata over visual inference.
   - If stems are confirmed group IDs, create grouped splits that never place a group in more than one partition.
   - If stems are not group IDs, create `training/signer_groups.csv` from available metadata or manual annotation.
   - If identity cannot be established, preserve the supplied CSV split only for pipeline smoke testing and label all metrics provisional.
   - Use a fixed seed and target approximately 70% train, 15% validation, and 15% test by group while retaining every selected class in every partition.
   - Save generated manifests under `training/artifacts/splits/` without changing the supplied CSV files.

5. Collect the `NO_SIGN` class.
   - Record examples from multiple people, backgrounds, lighting conditions, camera distances, and device orientations.
   - Include idle hands, hands entering/leaving the frame, unrelated gestures, no visible hands, and partial detections.
   - Avoid deriving `NO_SIGN` solely from random frames inside labeled sign clips because transition frames can contain meaningful sign motion.
   - Store collected source clips under `training/data/no_sign/` with signer/session metadata.
   - Do not approve a model for continuous camera inference until this class is included and evaluated.

6. Extract landmark sequences.
   - Use MediaPipe Hand Landmarker in video mode.
   - Decode videos in timestamp order and pass monotonically increasing timestamps.
   - Assign detections to stable left/right slots using handedness output.
   - Preserve two-hand relative motion consistently and document the normalization transform.
   - Resample each clip to exactly 40 frames; avoid simply truncating every clip at the beginning.
   - Store features as `float32`, labels as integer IDs, group IDs, original video paths, and extraction diagnostics.
   - Save a cache version or preprocessing hash so stale arrays are not silently reused after configuration changes.
   - Report hand-detection coverage per clip and flag samples with excessive missing frames for review.

7. Train a compact temporal baseline.
   - Use an input shape of `(40, 128)`.
   - Use only TensorFlow.js-supported standard layers: small `Conv1D` blocks, normalization/activation, pooling, dropout, global average pooling, and a final softmax layer.
   - Keep the parameter count low enough for offline browser inference.
   - Use sparse categorical cross-entropy, Adam, early stopping, model checkpointing, and learning-rate reduction.
   - Derive class weights only if the final grouped split is materially imbalanced.
   - Use conservative landmark augmentation such as small coordinate jitter, mild scale/translation changes, and temporal shifts. Do not horizontally flip by default.
   - Save training history, configuration, label ordering, random seed, best checkpoint, and final Keras model under a timestamped artifact directory.

8. Evaluate honestly.
   - Evaluate once on the held-out grouped test set after model selection is complete.
   - Produce overall accuracy, macro F1, per-class precision, per-class recall, support counts, and a confusion matrix.
   - Inspect confidence distributions for correct, incorrect, and `NO_SIGN` samples.
   - Select a confidence threshold using validation data, not test data.
   - Require macro F1 of at least `0.75` and no selected sign recall below `0.60` before app integration. If the target is missed, prioritize more diverse data over a more complex model.
   - Clearly mark results provisional when signer-independent grouping cannot be verified.

9. Export and verify TensorFlow.js compatibility.
   - Save a reloadable Keras training artifact and convert the accepted model to TensorFlow.js Layers format.
   - Export only the accepted browser model to `public/models/sign-model/`.
   - Write `labels.json` with the exact output-index ordering.
   - Write `preprocessing.json` with frame count, feature count, landmark ordering, normalization, missing-hand behavior, and confidence threshold.
   - Run the converted model on at least 20 cached samples and confirm TensorFlow.js produces the same top prediction as Python with numerically close probabilities.
   - Fail export verification if unsupported operations, missing weight shards, or metadata/model shape mismatches are detected.

10. Hand off to app integration only after the training gate passes.
    - Keep MediaPipe preprocessing behavior identical between Python and the browser.
    - Load `model.json` with TensorFlow.js and use the exported label and preprocessing metadata.
    - Maintain a rolling 40-frame buffer and avoid speaking predictions immediately.
    - Require the same high-confidence label across several consecutive inference windows before displaying or speaking it.
    - Map `DEAF` to the communication phrase `I am Deaf.` while keeping model labels and app phrases as separate metadata.
    - Map `SLOW` to the communication phrase `Please slow down.`
    - Map `DON'T UNDERSTAND` to the communication phrase `I don't understand.`
    - Map `YES` to the communication phrase `Yes.`
    - Map `NO` to the communication phrase `No.`
    - Map `THANK YOU` to the communication phrase `Thank you.`
    - Treat missing MVP concepts as unsupported rather than mapping unrelated signs to `HELP`, `HOSPITAL`, or `PAIN`.

11. Plan later dataset expansion.
    - Collect dedicated, consented videos for `HELP`, `HOSPITAL`, and `PAIN` from multiple signers.
    - Add signer/session metadata at collection time.
    - Target substantially more than the current roughly 20 clips per class and prioritize diversity over repeated clips from one person.
    - Re-run the complete grouped evaluation whenever labels or preprocessing change.
    - Create a separate alphabet/fingerspelling plan only after phrase recognition is functional.

## Edge Cases

- A CSV path exists only after resolving it relative to `training/clips/`.
- `.MOV` decoding can fail because of codec support even when the file exists.
- Videos may have zero or unreliable FPS metadata; timestamp calculation needs a documented fallback.
- Videos may contain one hand, two hands, no hands, or handedness that changes because of detector uncertainty.
- A hand may temporarily leave the frame during a valid sign.
- Clip lengths and frame rates vary, so uniform temporal resampling must handle very short clips.
- Left/right mirroring from front-facing cameras can invert handedness between dataset extraction and browser inference.
- Apostrophes and Unicode punctuation in labels such as `DON’T UNDERSTAND` must remain consistent across CSV parsing, JSON export, and app mapping.
- Two labels may have similar motion and differ by face or body position that hand landmarks do not capture.
- Random clip-level splitting can report inflated accuracy if the same signer or session appears across partitions.
- A six-class model without `NO_SIGN` will always choose one known label, even for unrelated motion.
- TensorFlow.js conversion may reject unsupported or custom TensorFlow operations.
- Model outputs can be correct while label ordering is wrong; exported label order must be verified against the final dense layer.
- Old landmark caches can become invalid when frame count, normalization, MediaPipe version, or selected labels change.

## Testing Checklist

- [ ] Python 3.12 virtual environment can be created from the documented instructions.
- [ ] FFmpeg, TensorFlow, MediaPipe, OpenCV, and TensorFlow.js converter availability checks pass.
- [ ] Dataset validation accounts for all 2,130 phrase videos and all 105 label records.
- [ ] Every selected-label CSV row resolves to an existing, decodable `.MOV` file.
- [ ] Validation reports the CSV path base and filename-stem overlap explicitly.
- [ ] Selected-label sample counts match the source metadata.
- [ ] Generated partitions contain every selected class and have no signer/session group overlap.
- [ ] If grouping cannot be verified, reports and metrics are visibly marked provisional.
- [ ] Landmark cache arrays have shape `(samples, 40, 128)` and `float32` dtype.
- [ ] Extraction metadata maps every cached sample back to its source video.
- [ ] Missing-hand masks match zero-filled landmark slots.
- [ ] Cache invalidation occurs when preprocessing configuration changes.
- [ ] A short smoke-training run completes and reloads its checkpoint.
- [ ] Full training uses early stopping and writes history/configuration artifacts.
- [ ] Evaluation writes JSON metrics and a confusion-matrix image.
- [ ] Test macro F1 and per-class recall are checked against the integration gate.
- [ ] `NO_SIGN` is included before continuous-camera use.
- [ ] TensorFlow.js export contains `model.json` and every referenced binary shard.
- [ ] `labels.json` output order matches the Keras model output order.
- [ ] `preprocessing.json` exactly describes the Python feature pipeline.
- [ ] Python and TensorFlow.js top-1 predictions match on at least 20 cached samples.
- [ ] Raw datasets, `.venv`, caches, and training artifacts remain uncommitted.
- [ ] Existing React build and lint commands still pass after the browser model is exported.

## Handoff Prompt for Implementer

Implement the training pipeline described in `training/PLAN.md` for the Kumpas repository. Start only with the environment documentation, shared configuration, dataset validation, signer/session split audit, and landmark extraction stages; do not train or integrate a browser model until those stages pass. Use Python 3.12, keep all raw dataset files and supplied CSV files unchanged, resolve CSV video paths relative to `training/clips/`, and treat the six labels `YES`, `NO`, `DEAF`, `THANK YOU`, `SLOW`, and `DON’T UNDERSTAND` as the initial baseline. Keep alphabet recognition out of scope. Create only the files listed under Relevant Files, add generated paths to `.gitignore`, use repository-relative configuration, and verify every implementation step with the corresponding Testing Checklist items. If signer/session identity cannot be established from authoritative metadata, preserve the supplied split only for smoke testing and mark all metrics provisional rather than claiming signer-independent performance.
