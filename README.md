# Kumpas

## Team Information

**Team Name:**
F4

**Project Name:**
Kumpas

---

## Project Brief

### The Problem
Access to public services and emergency response in the Philippines is heavily restricted for Deaf citizens. The Philippine Statistics Authority reports over 1.1 million Deaf Filipinos, yet there are only roughly 180 professional Filipino Sign Language (FSL) interpreters nationwide. During critical transactions (e.g., medical crises, emergency evacuations, obtaining a Cedula, or filing a blotter report), Deaf individuals face structural communication barriers. Traditional translation tools fail to bridge this gap because they depend on cloud connectivity, which is often slow or unavailable in remote municipal halls or emergency shelters.

### The Proposed Solution
Kumpas is an offline-first, shared-device FSL communication assistant PWA. Grounded in Republic Act No. 11106 (The FSL Act), it runs lightweight ML models and translation utilities entirely in the browser. 

The application is structured into three primary workflows:
1. **Instant Outbound (Phrase Library & Emergency ID):** A high-contrast, 3-tap action interface that lets Deaf users speak essential needs aloud via text-to-speech.
2. **Intelligent Inbound (Hearing Person Mode):** A simplified input box for hearing desk staff that simplifies complex administrative jargon into plain text.
3. **Edge Sign Recognition:** A camera interface that translates live FSL signs to text in real-time with zero data dependency.

### Intended Users
* **Deaf Filipinos** who need to navigate public transactional spaces or report crises.
* **Hearing Frontline Workers** (barangay staff, police officers, clinic receptionists, and disaster responders) who need to receive and respond to their requests.

### Project Impact
Kumpas eliminates the dependency on high-speed internet, allowing immediate, face-to-face communication in the most remote areas of the Philippines. By running local models with sub-50ms latency, it provides a secure, private, and cost-free solution that can scale instantly across all 42,000 barangays.

---

## Team Members

| Name | Role |
| --- | --- |
| **Baes, Franz Emmanuel** | Machine Learning Engineer |
| **Delos Santos, Christian Joseph** | UI/UX & Frontend Designer |
| **Javier, Salvador Vincent** | Systems Architect & Fullstack Developer |
| **A Jose, Justin Gabriel** | Frontend Developer & Data Coordinator |

---

## Google Technologies Used

* **Gemini API (via `gemini-2.0-flash`)**
  Used in *Hearing Person Mode* to simplify complex, bureaucratic sentences typed by hearing staff into short, plain-text instructions. It includes a fallback mechanism that shifts to a local rule-based simplification script if the device loses connection.
* **TensorFlow.js**
  Loads and executes our custom-trained 1D Temporal Convolutional neural network model directly in the browser using WebGL acceleration, enabling local classification of sign language.
* **MediaPipe Tasks Vision (Web)**
  Extracts 21 3D hand landmarks per hand from the webcam feed, mapping raw camera frames into normalized, wrist-relative, and palm-scaled 128-D feature vectors at the edge.

---

## SparkFest 2026

This project was developed as part of **SparkFest 2026**, the flagship hackathon organized by the **Google Developer Groups on Campus – Polytechnic University of the Philippines (GDG on Campus PUP)**.

---

## Repository Information

* **Live Demo:** [kumpas-opal.vercel.app](https://kumpas-opal.vercel.app)
* **Presentation Deck:** [Google Drive Link](https://drive.google.com/drive/folders/16E8Z9l4o12Q8x9vN98N3t15_82y9Z1kC) *(Anyone with the link can view)*
* **Project Document:** [Kumpas Project Brief (PDF)](https://drive.google.com/drive/folders/16E8Z9l4o12Q8x9vN98N3t15_82y9Z1kC)
