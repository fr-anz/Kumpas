# Kumpas

## Team Information

**Team Name:**
F4

**Project Name:**
Kumpas

---

## Project Brief

### The Problem
Access to public services and emergency assistance remains difficult for many Deaf Filipinos because of limited communication support at frontline institutions. During critical situations—such as medical emergencies, evacuation procedures, barangay transactions, obtaining a community tax certificate, or filing a police blotter—Deaf individuals may encounter personnel who are unable to communicate in Filipino Sign Language and may not have immediate access to a qualified interpreter. This can lead to delays, misunderstandings, reduced privacy, and dependence on relatives or untrained intermediaries. Existing digital communication tools may also be unreliable in rural municipal offices, evacuation centers, and temporary service locations because many depend on continuous cloud connectivity. These conditions highlight the need for an accessible, offline-capable communication tool that can support basic interactions while preserving the role of professional FSL interpreters in complex, legal, and medical situations.

### The Proposed Solution
Kumpas is an offline-first Filipino Sign Language communication assistant designed for public-service and emergency situations. Based on Republic Act No. 11106, or the Filipino Sign Language Act, it helps Deaf Filipinos communicate with hearing frontline workers when an interpreter is not immediately available.

The application has three main functions:

1. **Offline Phrase Library**
Deaf users can quickly select common phrases for emergencies, healthcare, barangay services, transportation, education, and basic communication. Selected messages can be displayed as text or spoken aloud using text-to-speech.
2. **Hearing Person Mode**
Hearing users can type responses for Deaf users to read. Complex messages can be simplified using the Gemini API when internet access is available or through a built-in rule-based simplifier when offline.
3. **Real-Time FSL Recognition**
The application uses a device camera to recognize selected Filipino Sign Language signs and convert them into text. Recognition runs directly in the browser using MediaPipe and TensorFlow.js.

Kumpas is an assistive communication tool and does not replace professional FSL interpreters, especially during complex medical, legal, or emergency situations.

### Intended Users
* **Deaf Filipinos** who need communication support when accessing public services or requesting emergency assistance.
* **Hearing frontline workers**, including barangay personnel, police officers, clinic staff, transportation workers, school personnel, and emergency responders.

### Project Impact
Kumpas provides an accessible communication option in locations where qualified FSL interpreters or reliable internet connections may not be immediately available. Its offline-first design allows essential features, such as phrase access and sign recognition, to continue working without continuous internet connectivity.

By supporting direct communication between Deaf users and frontline personnel, Kumpas may help reduce misunderstandings, delays, and dependence on untrained intermediaries. It can also support more inclusive public-service environments while reinforcing the importance of professional interpreters for complex interactions.

---

## Team Members

| Name | Role |
| --- | --- |
| **Baes, Franz Emmanuel** | Project Lead |
| **Delos Santos, Christian Joseph** | UI/UX & Front-end Developer|
| **Javier, Salvador Vincent** | Systems & Integration |
| **A Jose, Justin Gabriel** | Data Lead |

---

## Google Technologies Used

* **Gemini API (via `gemini-2.0-flash`)**
  Used in *Hearing Person Mode* to simplify complex administrative or service-related messages into shorter and clearer text. When the device is offline or the API is unavailable, Kumpas uses a built-in rule-based simplifier.
* **TensorFlow.js**
  Runs the custom FSL recognition model directly in the browser. This allows selected signs to be classified locally without requiring continuous communication with a cloud server.
* **MediaPipe Tasks Vision (Web)**
  Detects and tracks hand landmarks from the device camera. These landmarks are processed and used by the recognition model to identify supported FSL signs in real time.

---

## SparkFest 2026

This project was developed as part of **SparkFest 2026**, the flagship hackathon organized by the **Google Developer Groups on Campus – Polytechnic University of the Philippines (GDG on Campus PUP)**.

---

## Repository Information

* **Live Demo:** [Deployment Link](https://kumpas.theavenir.dev/)
* **Presentation Deck:** [Google Drive Link](https://drive.google.com/drive/folders/16E8Z9l4o12Q8x9vN98N3t15_82y9Z1kC) *(Anyone with the link can view)*
* **Project Document:** [Kumpas Project Brief (PDF)](https://drive.google.com/drive/folders/16E8Z9l4o12Q8x9vN98N3t15_82y9Z1kC)

## Credits

* **FSL Dataset**: https://data.mendeley.com/datasets/48y2y99mb9/2
* **Next.js PWA**: @ducanh2912/next-pwa

