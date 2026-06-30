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

## Dataset storage (DVC + Google Drive)

The raw training data is too large for Git (~520 MB). Git only tracks small
`.dvc` pointer files; the actual data lives in Google Drive via
[DVC](https://dvc.org/).

| Path | Contents | Size |
|------|----------|------|
| `clips/` | 2,130 phrase `.MOV` videos | ~372 MB |
| `archive/` | 11,700 alphabet images (future use) | ~134 MB |
| `models/` | MediaPipe `hand_landmarker.task` | ~8 MB |

Generated outputs (`cache/`, `artifacts/`) stay local and are not in DVC.

### One-time setup

Install DVC and rclone (rclone is optional but useful for manual Drive browsing):

```powershell
python -m pip install "dvc[gdrive]"
winget install Rclone.Rclone
```

Create a folder in Google Drive, e.g. `Kumpas/dvc`, and copy its folder ID from
the browser URL (`https://drive.google.com/drive/folders/<FOLDER_ID>`). Point
the remote at it (replace the placeholder):

```powershell
cd ..   # repo root
python -m dvc remote modify gdrive url "gdrive://<FOLDER_ID>/kumpas-dvc"
```

On first push, DVC opens a browser for Google OAuth. Each teammate authorizes
once; credentials are cached locally.

For heavy use or if Google blocks the default DVC app, create your own
[Google Cloud OAuth client](https://dvc.org/doc/user-guide/data-management/remote-storage/google-drive#using-a-custom-google-cloud-project-recommended)
and store secrets in `.dvc/config.local` (already git-ignored):

```powershell
python -m dvc remote modify --local gdrive gdrive_client_id "<your-client-id>"
python -m dvc remote modify --local gdrive gdrive_client_secret "<your-secret>"
```

### Daily workflow

Clone the repo, then pull data from Drive:

```powershell
cd "C:\path\to\Kumpas"
python -m dvc pull
```

After adding or changing tracked data:

```powershell
python -m dvc add training/clips    # only if clips changed
python -m dvc push
git add training/*.dvc training/.gitignore
git commit -m "update training data pointers"
```

### Notes

- If `dvc pull` fails with a malware/spam warning, `gdrive_acknowledge_abuse`
  is already enabled in `.dvc/config`.
- Old copies of the dataset may still exist in Git history from before this
  migration. If the repo was already pushed, consider cleaning history with
  [git filter-repo](https://github.com/newren/git-filter-repo) to shrink the
  remote.

## Versioned pipeline

The repository-level `dvc.yaml` versions the complete training DAG. It invokes
the Python interpreter in `training/.venv` for ML stages. Run DVC from the
repository root using the Python installation where DVC is installed:

```powershell
python -m dvc repro
python -m dvc metrics show
```

DVC skips unchanged stages. A change to the clips, metadata, scripts, selected
labels, or training parameters reruns that stage and its downstream stages.
The resulting `dvc.lock` records the exact inputs, parameters, metrics, and
output hashes for the run.

To start a new model version, update all three version fields in `config.json`:

```json
{
  "version": "baseline-v3",
  "paths": {
    "cache_dir": "cache/baseline-v3",
    "artifact_dir": "artifacts/baseline-v3"
  }
}
```

After a successful run, store the generated cache and model artifacts in the
DVC remote and commit only the small version metadata:

```powershell
python -m dvc push
git add dvc.yaml dvc.lock training/config.json
git commit -m "train baseline-v3"
git tag model-baseline-v3
git push --follow-tags
```

Use a unique version name for every retained experiment. Do not reuse an old
version path with different labels or parameters.

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
