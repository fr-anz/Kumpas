# Kumpas

Offline-first Filipino Sign Language (FSL) communication assistant PWA.

Built with **Next.js (App Router)** + TypeScript + Tailwind CSS, exported as a
fully static, installable PWA that runs offline after first load. See
[`DESIGN.md`](DESIGN.md) for the full product design and architecture.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

`npm run build` produces a static export in `out/` (via `output: 'export'`)
plus a service worker for offline support.

## Project structure

```txt
app/            App Router routes (home, library, communication, hearing,
                emergency, camera, settings) + root layout and globals.css
components/     UI components (header, bottom nav, cards, speak button, theme)
data/           Local phrase + category data (offline, no network)
services/       Speech, storage, simplifier (+ placeholder gemini/firebase)
ml/             Mock predictor + MediaPipe/TF.js placeholders and labels
types/          Phrase, UserProfile, Prediction
utils/          Confidence + text helpers
public/         manifest.webmanifest, app icon, future models/
```

## Features

- Offline phrase library with categories and urgent-phrase emphasis
- Communication cards with large text, speak (TTS) and copy
- Emergency profile (stored locally) with speak-emergency action
- Hearing person mode with a local rule-based message simplifier
- Camera recognition demo using a mock predictor (structured for future
  MediaPipe + TensorFlow.js integration)
- Light / dark / system themes in the yellow-black bee palette (WCAG AA)
- Installable PWA with offline service-worker caching

No sign-in, backend, Firebase, or internet connection is required for core
features.
