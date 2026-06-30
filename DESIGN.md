# DESIGN.md — Kumpas

Offline-first Filipino Sign Language (FSL) communication assistant PWA.

This document defines the product design, visual system, and technical
architecture for Kumpas. It is the design counterpart to the product
specification in [`docs/plan.md`](docs/plan.md) and the model training spec in
[`training/PLAN.md`](training/PLAN.md).

> **Stack note:** `docs/plan.md` was originally written against React + Vite,
> and the current scaffold under `src/` reflects that. This design document
> targets **Next.js** as the application framework. Where the two disagree, this
> document is authoritative for the app layer. The product requirements,
> features, data types, and ML integration plan in `docs/plan.md` remain
> unchanged.

---

## 1. Product Vision

> An offline-first Filipino Sign Language communication assistant for Deaf
> Filipinos in public-service and emergency situations. It does not replace
> interpreters. It helps with essential communication when an interpreter is
> unavailable.

Kumpas is built for two users sharing one device:

- **Deaf Filipinos** who need to communicate essential needs quickly.
- **Hearing staff** (clinic, barangay, transport, school) who need to
  understand and respond.

The app must work with no internet after first load, be readable under stress
and from a distance, and never require sign-in before communicating.

---

## 2. Design Principles

1. **Communicate in three taps or fewer.** Open → choose → speak.
2. **Offline is the default, not a fallback.** Online features are additive.
3. **High contrast, large targets.** Usable in bright sun, in a hurry, by
   users with low vision or motor stress.
4. **Calm under pressure.** Emergency flows are visually distinct but not
   alarming; clear, never cluttered.
5. **Honest scope.** The app assists communication; it does not claim full FSL
   translation. Sign recognition is a demo prototype.
6. **Accessible by construction.** WCAG AA contrast, semantic markup, keyboard
   and screen-reader friendly, respects reduced-motion.

---

## 3. Visual Identity — The Bee Theme

Kumpas uses a **yellow-and-black "bee" palette**: warm, energetic, high
contrast, and instantly legible. Black-on-yellow is one of the most readable
color pairings in nature and signage, which suits an accessibility-first tool.

### 3.1 Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--bee-yellow` | `#F9C800` | Primary brand, key actions, active nav |
| `--bee-yellow-bright` | `#FFD60A` | Hover / focus highlight, accents |
| `--bee-amber` | `#E0A800` | Pressed states, secondary emphasis |
| `--bee-black` | `#121212` | Primary text, headers, on-yellow content |
| `--bee-ink` | `#1E1E1E` | Surface for dark sections / cards |
| `--bee-charcoal` | `#2A2A2A` | Elevated dark surfaces, borders on dark |
| `--bee-white` | `#FFFFFF` | Light surface background |
| `--bee-cream` | `#FFF8E1` | Soft light surface, card background |
| `--bee-gray` | `#6B6B6B` | Secondary text, captions |
| `--danger` | `#D7263D` | Emergency / urgent accents |
| `--success` | `#2E7D32` | Online status, confirmations |
| `--warn` | `#E0A800` | Offline / caution status |

### 3.2 Theme Modes

- **Light mode (default):** cream/white surfaces, black text, yellow accents.
- **Dark mode:** charcoal/ink surfaces, white text, yellow accents — the most
  "bee-like" mode and best for low-light emergencies.

Both modes must maintain **WCAG AA** contrast (≥ 4.5:1 for body text, ≥ 3:1 for
large text and UI components). Yellow is used for fills and accents, never for
small text on white (insufficient contrast).

### 3.3 Color Usage Rules

- **Black text on yellow** for primary buttons and the emergency banner.
- **Yellow on black** for the app header and bottom-nav active state.
- Reserve `--danger` red strictly for emergency/urgent semantics so it keeps
  its signal value.
- Never place yellow text on a white/cream background.

### 3.4 Typography

- **Font family:** system UI stack (`-apple-system, Segoe UI, Roboto, ...`) for
  zero-network, fast loads; optionally `Inter` self-hosted (no CDN) for brand.
- **Scale (mobile-first):**
  - Display / communication text: 32–48px, bold
  - Page title: 24px, semibold
  - Body: 16–18px
  - Caption / meta: 13–14px
- Minimum interactive body text 16px. No text below 13px anywhere.
- Line height ≥ 1.4 for body; generous spacing for readability under stress.

### 3.5 Shape, Spacing, Motion

- **Radius:** cards `16px`, buttons `12px`, pills `999px`.
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32.
- **Touch targets:** minimum `48 × 48px`.
- **Elevation:** soft shadows in light mode; subtle yellow-tinted borders in
  dark mode.
- **Motion:** 150–250ms ease transitions; honor `prefers-reduced-motion` and
  disable non-essential animation.
- **Optional motif:** subtle hexagon (honeycomb) accents in empty states and
  the splash screen — decorative only, never reducing contrast or clarity.

---

## 4. Technical Architecture

### 4.1 Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Rendering:** primarily client components; the app is a static, installable
  PWA (`output: 'export'` / fully static-exportable so it runs offline without
  a Node server). No mandatory backend.
- **Styling:** Tailwind CSS with the bee tokens defined as CSS variables and
  exposed through the Tailwind theme.
- **PWA:** service worker + manifest via `next-pwa` (or an equivalent Workbox
  integration) for precaching the app shell and static assets.
- **Speech:** browser `SpeechSynthesis` API.
- **Storage:** `localStorage` / IndexedDB for profile and settings.
- **Phrase data:** local TypeScript data files (no network).
- **ML (future):** MediaPipe Web (hand landmarks) + TensorFlow.js (sign model),
  consuming the model exported by the training pipeline into
  `public/models/sign-model/`.
- **Optional online services:** `geminiService` (message simplification) and
  `firebaseService` (sync) are placeholder files only; never required for core
  features.

**Excluded:** React Native, native Android, backend-only architecture,
mandatory Firebase login, mandatory internet for core features.

### 4.2 Offline Strategy

- **App shell:** precached at install (static export → all routes cacheable).
- **Static assets** (icons, fonts, phrase JSON/TS bundles): cache-first.
- **TF.js model files:** cache-first once first downloaded; large, so cached
  explicitly and versioned.
- **Online-only calls** (Gemini, Firebase): network-only, fail gracefully when
  offline.
- **Offline/online indicator** driven by `navigator.onLine` + connectivity
  events, surfaced as a `StatusBadge`.

Offline-capable features: phrase library, communication cards, text-to-speech
for local phrases, emergency profile, saved settings, camera page UI, and the
mock sign recognition demo.

### 4.3 Proposed Directory Structure (Next.js App Router)

```txt
app/
  layout.tsx              # Root layout: header, bottom nav, theme provider
  globals.css             # Tailwind + bee CSS variables
  page.tsx                # Home
  library/page.tsx        # Phrase library
  communication/page.tsx  # Communication card
  hearing/page.tsx        # Hearing person mode
  emergency/page.tsx      # Emergency profile + card
  camera/page.tsx         # Camera recognition demo
  settings/page.tsx       # Settings

components/
  AppHeader.tsx
  BottomNav.tsx
  CategoryCard.tsx
  PhraseCard.tsx
  CommunicationCard.tsx
  EmergencyProfileCard.tsx
  CameraPreview.tsx
  StatusBadge.tsx
  OfflineIndicator.tsx

data/
  categories.ts
  phrases.ts

services/
  speechService.ts
  storageService.ts
  simplifierService.ts
  firebaseService.ts      # optional future
  geminiService.ts        # optional future

ml/
  labels.ts
  mockPredictor.ts
  mediapipeHands.ts       # placeholder
  tfjsPredictor.ts        # placeholder

types/
  phrase.ts
  userProfile.ts
  prediction.ts

utils/
  confidence.ts
  text.ts

public/
  manifest.webmanifest
  icons/                  # bee-themed app icons (192, 512, maskable)
  models/sign-model/      # exported TF.js model (future)
```

> The current repo ships a Vite/React scaffold under `src/`. Migrating to the
> structure above is a Phase-1 task (see §8). File responsibilities and data
> types are carried over unchanged from `docs/plan.md`.

### 4.4 Core Data Types

Carried directly from `docs/plan.md`:

```ts
type Phrase = {
  id: string;
  category: "emergency" | "health" | "barangay" | "transportation" | "school" | "basic";
  title: string;
  text: string;
  simplifiedText?: string;
  fslVisualUrl?: string;
  offlineAvailable: boolean;
  priority?: "normal" | "urgent";
};

type UserProfile = {
  name: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  medicalNote: string;
  addressNote: string;
};

type Prediction = {
  label: string;
  phrase: string;
  confidence: number;
};
```

---

## 5. Information Architecture & Navigation

**Persistent bottom navigation** (thumb-reachable, 5 items max):

`Home` · `Library` · `Emergency` · `Hearing` · `Camera`

Settings is reachable from the header. The Emergency tab is visually emphasized
(yellow fill / danger accent) so it is findable instantly.

```
Home
├─ Emergency (big primary action)
├─ Phrase categories  → Library → Communication card
├─ Hearing Person Mode
└─ Camera Recognition Demo
Settings (header)
```

---

## 6. Screen Designs

All screens are mobile-first, single-column, with the bee palette. Header is
black with yellow wordmark; active bottom-nav item is yellow.

### 6.1 Home
- App name + short description (one line).
- **Large Emergency button** (full-width, yellow with black text, or danger
  accent for urgency).
- Grid of phrase category cards (honeycomb-inspired but rectangular for
  legibility).
- Buttons for Hearing Mode and Camera Demo.
- Offline/online `StatusBadge` in the header.

### 6.2 Phrase Library
- Category chips/filter at top.
- Vertical list of `PhraseCard`s; **urgent phrases get a danger-red left border
  / badge**.
- Optional search field if it does not add clutter.

### 6.3 Communication Card
- **Very large phrase text** (32–48px), readable from a distance.
- `Speak` (primary, yellow) and `Copy` buttons.
- Optional FSL visual placeholder area.
- `Back` button.
- Minimal chrome — the text is the interface.

### 6.4 Hearing Person Mode
- Text input for staff message.
- `Simplify` button (local rule-based simplifier; no Gemini required).
- Shows **Original** and **Simplified** messages.
- `Speak simplified` button.
- Suggested matching phrase cards when detectable.

### 6.5 Emergency Page
- If profile exists: `EmergencyProfileCard` showing **"I am Deaf."**, name,
  emergency contact, medical note, address/barangay note.
- **Large "Speak emergency message" button**:
  > I am Deaf. I need help. Please contact my emergency contact.
- `Edit profile` button.
- If no profile: simple setup form (name, contact name, contact number,
  medical note, address note) saved locally.

### 6.6 Camera Recognition Demo
- Camera preview area.
- `Start` / `Stop` camera buttons.
- Prediction label, confidence score (visual meter), output phrase.
- `Speak output` button.
- Uses `mockPredictor` for the MVP; structured so MediaPipe + TF.js can replace
  the mock. Code comments mark the integration points.
- Clear note that this is a prototype, not real-time translation.

### 6.7 Settings
- Edit emergency profile.
- Clear local data (with confirm).
- Speech test button.
- Theme toggle (light / dark / system).
- Offline status + app version / demo label.

---

## 7. Accessibility

- **Contrast:** WCAG AA minimum across both themes; verify yellow/black
  combinations (black-on-yellow passes easily; never yellow-on-white text).
- **Targets:** ≥ 48px; generous spacing.
- **Semantics:** proper headings, landmarks, button vs. link usage, `aria-live`
  for prediction updates and status changes.
- **Keyboard:** full keyboard operability; visible focus rings (yellow-bright).
- **Screen readers:** label icon-only buttons; announce speech start/stop.
- **Reduced motion:** honor `prefers-reduced-motion`.
- **Resilience:** app must not crash if `SpeechSynthesis` or camera is
  unavailable; show clear fallback messaging.

---

## 8. Implementation Phases (App Layer)

Aligned with `docs/plan.md`, adapted for Next.js:

1. **Setup & migration** — scaffold Next.js App Router, port theme tokens and
   Tailwind config, configure PWA (manifest + service worker), bottom nav,
   routing, bee design tokens.
2. **Offline phrase MVP** — phrase/category data, Home, Library, Communication
   card, text-to-speech service.
3. **Emergency profile** — profile type, storage service, setup form,
   emergency card, speak-emergency action (persists across reload, offline).
4. **Hearing person mode** — local simplifier service, input screen, simplified
   output, speak, placeholder Gemini service.
5. **Camera demo** — preview component, permissions, start/stop, mock
   predictor, prediction/confidence/output display, speak output.
6. **Offline & polish** — manifest + caching, offline indicator, empty/error
   states, responsiveness, passing `next build`.

---

## 9. Acceptance Criteria

- Mobile-first, installable Next.js PWA with the yellow-black bee theme in both
  light and dark modes, meeting WCAG AA contrast.
- Core flows (phrase library, communication cards, TTS, emergency profile,
  hearing mode, camera demo) work **offline** after first load.
- No sign-in required to communicate; no mandatory internet, Firebase, or
  Gemini for core features.
- `next build` succeeds; the app installs and runs from the home screen.
- Sign recognition runs on the mock predictor, structured for future
  MediaPipe + TF.js integration consuming `public/models/sign-model/`.

---

## 10. Out of Scope (Do Not Overbuild)

Authentication, complex backends, full sign-language translation, real-time ML
before the UI works, admin dashboards, and social features. The training
pipeline (`training/`) remains a separate concern from the app design and is
governed by `training/PLAN.md`.
