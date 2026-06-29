# PLAN.md — Offline-First FSL Communicator PWA

## Project Summary

Build a mobile-first, offline-first Progressive Web App for a Filipino Sign Language communication assistant.

The app is designed for Deaf Filipinos and hearing users in public-service and emergency situations. It should not claim to fully translate Filipino Sign Language. The MVP should focus on essential communication through quick phrases, text-to-speech, emergency cards, FSL visual support, and a future-ready sign recognition prototype.

Core pitch:

> An offline-first Filipino Sign Language communication assistant for Deaf Filipinos in public-service and emergency situations. It does not replace interpreters. It helps with essential communication when an interpreter is unavailable.

---

## Important Development Instruction

Before making changes, inspect the existing project structure first. Edit existing files when possible instead of recreating the whole project. Keep changes organized and avoid unnecessary dependencies.

If the project is empty, create the structure described below.

---

## Tech Stack

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- vite-plugin-pwa
- Browser SpeechSynthesis API
- LocalStorage or IndexedDB for offline profile/settings
- Local TypeScript data files for phrase library
- MediaPipe Web placeholder for future hand landmark detection
- TensorFlow.js placeholder for future sign prediction
- Firebase service file only as an optional future integration
- Gemini service file only as an optional future integration

Do not use:

- React Native
- Native Android
- Backend-only architecture
- Mandatory Firebase login
- Mandatory internet connection for core features

The app must run locally with:

```bash
npm install
npm run dev
```

The app must build with:

```bash
npm run build
```

---

## Main MVP Features

### 1. Offline Phrase Library

Create a categorized phrase library for public-service and emergency communication.

Required categories:

- Emergency
- Health
- Barangay
- Transportation
- School
- Basic Needs

Example phrases:

- I am Deaf.
- Please write it down.
- I need help.
- I need medical assistance.
- Where is the clinic?
- Please call my emergency contact.
- I need a barangay certificate.
- Please tell me when we arrive.
- I feel dizzy.
- I am in pain.
- How much should I pay?
- Where should I go?
- Please wait.
- Thank you.

Each phrase should be stored locally and work offline.

---

### 2. Communication Card

When a user taps a phrase, open a communication card with:

- Large readable text
- Speak button
- Copy button
- Optional related FSL visual placeholder
- Back button

The card should be readable from a distance and usable under stress.

---

### 3. Text-to-Speech

Use the browser SpeechSynthesis API.

Create a reusable service:

```ts
speak(text: string): void
stopSpeaking(): void
isSpeechSupported(): boolean
```

The app should not crash if speech synthesis is unavailable.

---

### 4. Emergency Profile Card

Allow the user to save an offline emergency profile:

- Name
- Emergency contact name
- Emergency contact number
- Medical note
- Address or barangay note

Store this locally.

The emergency card should display:

- “I am Deaf.”
- User name
- Emergency contact
- Medical note
- Address/barangay note
- Large button to speak an emergency message aloud

Example emergency speech:

> I am Deaf. I need help. Please contact my emergency contact.

---

### 5. Hearing Person Mode

Create a screen where a hearing person can type a message.

The app should show:

- Original message
- Simplified message
- Speak simplified message button
- Suggested matching phrase cards if possible

For now, implement a local rule-based simplifier. Do not require Gemini.

Example:

Input:

> Please wait outside because your document is still being processed.

Output:

> Please wait outside. Your document is not ready yet.

Create a placeholder `geminiService.ts` for future online simplification.

---

### 6. Camera Recognition Demo

Create a camera page for the sign recognition prototype.

Required UI:

- Camera preview
- Start camera button
- Stop camera button
- Prediction label
- Confidence score
- Output phrase
- Speak output button

For the MVP, use a mock predictor first.

Mock labels:

- HELP → I need help.
- YES → Yes.
- NO → No.
- HOSPITAL → I need to go to the hospital.
- I_AM_DEAF → I am Deaf.
- PAIN → I am in pain.

The camera module should be structured so the mock predictor can later be replaced with MediaPipe Web + TensorFlow.js.

---

### 7. Offline-First Support

The app must still work without internet after first load.

Offline features:

- Phrase library
- Communication cards
- Text-to-speech for local phrases
- Emergency profile
- Local saved settings
- Camera page UI
- Mock sign recognition demo

Online-only future features:

- Gemini message simplification
- Firebase sync
- Downloadable phrase packs
- Cloud analytics
- Remote interpreter support

Add an online/offline status indicator.

---

### 8. PWA Support

Configure the app as an installable PWA.

Requirements:

- Web app manifest
- App name
- Short name
- Theme color
- Mobile viewport support
- Service worker through vite-plugin-pwa
- Cache static assets
- Offline fallback behavior

Suggested app name:

- Full name: FSL Communicator
- Short name: FSL Assist

---

## Suggested File Structure

```txt
src/
  App.tsx
  main.tsx
  index.css

  data/
    categories.ts
    phrases.ts

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

  pages/
    HomePage.tsx
    PhraseLibraryPage.tsx
    CommunicationPage.tsx
    HearingModePage.tsx
    EmergencyPage.tsx
    CameraPage.tsx
    SettingsPage.tsx

  services/
    speechService.ts
    storageService.ts
    simplifierService.ts
    firebaseService.ts
    geminiService.ts

  ml/
    labels.ts
    mockPredictor.ts
    mediapipeHands.ts
    tfjsPredictor.ts

  types/
    phrase.ts
    userProfile.ts
    prediction.ts

  utils/
    confidence.ts
    text.ts
```

---

## Data Types

### Phrase

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
```

### UserProfile

```ts
type UserProfile = {
  name: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  medicalNote: string;
  addressNote: string;
};
```

### Prediction

```ts
type Prediction = {
  label: string;
  phrase: string;
  confidence: number;
};
```

---

## UI / UX Requirements

The design must be mobile-first and accessible.

Use:

- Large buttons
- High contrast
- Clear typography
- Rounded cards
- Bottom navigation
- Minimal clutter
- Big emergency button
- Large communication text
- Simple icons if available
- Clear loading and error states

Avoid:

- Tiny text
- Complex forms
- Too many screens before the user can communicate
- Full-screen clutter
- Required sign-in before using the app

Main user flow should be fast:

1. Open app
2. Choose category or emergency
3. Tap phrase
4. Show large text
5. Speak phrase aloud

---

## Page Requirements

### Home Page

Show:

- App name
- Short description
- Emergency button
- Quick access to phrase categories
- Button for Hearing Person Mode
- Button for Camera Recognition Demo
- Offline/online status

---

### Phrase Library Page

Show:

- Categories
- Phrase cards
- Search/filter if easy
- Urgent phrases visually emphasized

---

### Communication Page

Show selected phrase as:

- Large text
- Speak button
- Copy button
- Related visual placeholder
- Back button

---

### Hearing Mode Page

Show:

- Text input
- Simplify button
- Original message
- Simplified message
- Speak button
- Suggested phrase cards

---

### Emergency Page

Show:

- Saved emergency profile
- Emergency message
- Speak emergency message button
- Edit profile button

If no profile exists, show a simple setup form.

---

### Camera Page

Show:

- Camera preview
- Start/Stop buttons
- Mock prediction button or timed mock predictions
- Prediction label
- Confidence score
- Output phrase
- Speak output button

Add comments in the code explaining where MediaPipe and TensorFlow.js will be integrated later.

---

### Settings Page

Show:

- Edit emergency profile
- Clear local data button
- Speech test button
- Offline status
- App version or demo label

---

## ML Integration Plan

For now, implement placeholders only.

Future real pipeline:

1. Camera frame is captured from browser.
2. MediaPipe Web detects hand landmarks.
3. Landmark sequence is collected over several frames.
4. TensorFlow.js model predicts the sign.
5. App maps the label to a phrase.
6. App displays text and optionally speaks it aloud.

Create these files:

### `src/ml/labels.ts`

Contains label-to-phrase mapping.

### `src/ml/mockPredictor.ts`

Returns mock predictions for demo.

### `src/ml/mediapipeHands.ts`

Placeholder for future MediaPipe hand landmark extraction.

### `src/ml/tfjsPredictor.ts`

Placeholder for future TensorFlow.js model loading and prediction.

The app should compile even though real ML is not implemented yet.

---

## Implementation Order

### Phase 1 — Setup

1. Inspect existing repo.
2. Confirm whether Vite, React, TypeScript, and Tailwind are already installed.
3. Add missing dependencies only if needed.
4. Create or adjust folder structure.
5. Set up basic navigation.
6. Set up PWA plugin.

---

### Phase 2 — Offline Phrase MVP

1. Create phrase data.
2. Create categories.
3. Build Home page.
4. Build Phrase Library page.
5. Build Communication Card page.
6. Add text-to-speech.

Acceptance criteria:

- User can select a phrase.
- User can see the phrase in large text.
- User can make the app speak the phrase.

---

### Phase 3 — Emergency Profile

1. Create profile type.
2. Create local storage service.
3. Build emergency profile form.
4. Save profile locally.
5. Show emergency card.
6. Add speak emergency message button.

Acceptance criteria:

- User can save emergency profile.
- Profile persists after refresh.
- Emergency card works offline.

---

### Phase 4 — Hearing Person Mode

1. Create simplifier service.
2. Build text input screen.
3. Show simplified output.
4. Add speak button.
5. Add placeholder Gemini service.

Acceptance criteria:

- User can type a message.
- App displays a simplified version.
- App can speak the simplified version.

---

### Phase 5 — Camera Demo

1. Build camera preview component.
2. Request camera permission.
3. Add start/stop camera functions.
4. Add mock predictor.
5. Display prediction, confidence, and output phrase.
6. Add speak output button.

Acceptance criteria:

- Camera preview opens on supported devices.
- Mock prediction appears.
- Prediction maps to a useful phrase.
- Output can be spoken aloud.

---

### Phase 6 — Offline and Polish

1. Add PWA manifest.
2. Configure service worker caching.
3. Add offline indicator.
4. Add empty states.
5. Add error handling.
6. Improve mobile responsiveness.
7. Test build.

Acceptance criteria:

- App builds successfully.
- App can be installed as PWA.
- Main features work after reload.
- Offline-ready features do not depend on Firebase or Gemini.

---

## Final Demo Script

The demo should show:

1. User opens the mobile-first PWA.
2. User taps “Emergency.”
3. App displays large text: “I am Deaf. I need help.”
4. App speaks the phrase aloud.
5. User opens Hearing Person Mode.
6. A staff message is simplified into clearer text.
7. User opens Camera Demo.
8. Mock sign recognition shows “HELP” with confidence.
9. App converts “HELP” into “I need help.” and speaks it.
10. Presenter explains that future versions replace mock prediction with MediaPipe + TensorFlow.js.

---

## Do Not Overbuild

Prioritize:

1. Offline communication
2. Emergency usefulness
3. Clear mobile UI
4. Text-to-speech
5. Camera recognition demo structure
6. Future-ready ML integration

Do not spend too much time on:

- Login/authentication
- Complex backend
- Full sign translation
- Real-time ML before the UI works
- Large admin dashboards
- Social features

---

## Final Output Expected

When finished, the app should have:

- Mobile-first PWA interface
- Offline phrase library
- Communication cards
- Text-to-speech
- Emergency profile card
- Hearing person simplifier
- Camera recognition demo with mock predictions
- Clean ML placeholder structure
- PWA configuration
- Build passing successfully

