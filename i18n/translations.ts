export type Language = "en" | "fil";

/** BCP-47 language tag used for SpeechSynthesis voice selection. */
export const speechLang: Record<Language, string> = {
  en: "en-US",
  fil: "fil-PH",
};

/**
 * UI string dictionary. Keys are stable identifiers; values are the display
 * text per language. Phrase/category content lives in the data files and is
 * localized there.
 */
type Dict = Record<string, string>;

const en: Dict = {
  // Common
  "common.speak": "Speak",
  "common.stop": "Stop",
  "common.back": "Back",
  "common.copy": "Copy",
  "common.copied": "Copied!",
  "common.cancel": "Cancel",
  "common.loading": "Loading…",

  // Navigation
  "nav.home": "Home",
  "nav.library": "Library",
  "nav.emergency": "Emergency",
  "nav.hearing": "Hearing",
  "nav.camera": "Camera",

  // Status
  "status.online": "Online",
  "status.offlineReady": "Offline ready",
  "status.offlineBanner": "You are offline. Communication features still work.",

  // Header
  "header.settings": "Settings",

  // Install (PWA)
  "install.section": "Install app",
  "install.description":
    "Install Kumpas on your device for faster access and full offline use.",
  "install.button": "Install Kumpas",
  "install.installed": "Kumpas is installed on this device.",
  "install.iosHint":
    "To install: tap the Share button, then choose \"Add to Home Screen\".",
  "install.unavailable":
    "Install isn't available right now. Your browser may not support it, or the app may already be installed.",
  "install.bannerTitle": "Install Kumpas",
  "install.bannerBody": "Add it to your device for offline access.",
  "install.bannerAction": "Install",
  "install.bannerDismiss": "Dismiss",

  // Onboarding
  "onb.welcomeTitle": "Welcome to Kumpas",
  "onb.welcomeMessage":
    "An offline FSL communication assistant for public service and emergencies. Grounded in RA 11106.",
  "onb.badge": "Assists communication • Works 100% Offline",
  "onb.getStarted": "Get Started",
  "onb.prefsTitle": "Choose your preferences",
  "onb.language": "Language",
  "onb.textSize": "Text size",
  "onb.sizeNormal": "Normal",
  "onb.sizeLarge": "Large",
  "onb.sizeXlarge": "Extra Large",
  "onb.sizePreview": "Sample text",
  "onb.next": "Next",
  "onb.back": "Back",
  "onb.profileTitle": "Emergency ID",
  "onb.profileContext":
    "If you are Deaf, having your ID ready helps first responders immediately.",
  "onb.name": "Name",
  "onb.contactNumber": "Emergency contact number",
  "onb.contactHint": "Enter your 10-digit mobile number (9XX XXX XXXX).",
  "onb.contactValid": "Valid number",
  "onb.contactInvalid": "Enter a valid Philippine mobile number.",
  "onb.setupLater": "Set up later in Emergency tab",
  "onb.finish": "Finish & Start Communicating",
  "onb.step": "Step",
  "onb.of": "of",

  // Home
  "home.eyebrow": "Offline-first FSL communicator",
  "home.title": "\"Para sa\\ninklusibong bukas.\"",
  "home.emergency": "Emergency",
  "home.phraseCategories": "Phrase categories",
  "home.recentlyUsed": "Recently used",
  "home.moreTools": "More tools",
  "home.hearingMode": "Hearing person mode",
  "home.cameraDemo": "FSL Camera",

  // Library
  "library.title": "Phrase library",
  "library.search": "Search phrases",
  "library.all": "Show all",
  "library.noResults": "No phrases match your search.",
  "library.filterAria": "Filter by category",
  "library.category": "Category",
  "library.loading": "Loading phrases…",
  "library.urgent": "Urgent",

  // Communication card
  "comm.fslPlaceholder": "FSL visual coming soon",
  "comm.fslBadge": "FSL",
  "comm.aslBadge": "ASL",
  "comm.signAlt": "Sign language demonstration for: ",

  // Hearing mode
  "hearing.title": "Hearing person mode",
  "hearing.subtitle":
    "Type a message for the Deaf person. It will be simplified into clearer text.",
  "hearing.yourMessage": "Your message",
  "hearing.placeholder":
    "e.g. Please wait outside because your document is still being processed.",
  "hearing.simplify": "Simplify",
  "hearing.original": "Original",
  "hearing.simplified": "Simplified",
  "hearing.speakSimplified": "Speak simplified",
  "hearing.suggested": "Suggested responses",

  // Emergency
  "emergency.title": "Emergency",
  "emergency.message":
    "I am Deaf. I need help. Please contact my emergency contact.",
  "emergency.speakMessage": "Speak emergency message",
  "emergency.iAmDeaf": "I am Deaf.",
  "emergency.name": "Name",
  "emergency.contact": "Emergency contact",
  "emergency.contactName": "Emergency contact name",
  "emergency.contactNumber": "Emergency contact number",
  "emergency.medicalNote": "Medical note",
  "emergency.addressNote": "Address / barangay note",
  "emergency.address": "Address / barangay",
  "emergency.editProfile": "Edit profile",
  "emergency.setupTitle": "Set up your emergency profile",
  "emergency.editTitle": "Edit profile",
  "emergency.saveProfile": "Save profile",

  // Camera
  "camera.title": "Sign Language Recognition",
  "camera.start": "Start camera",
  "camera.stop": "Stop camera",
  "camera.detectedSign": "Detected sign",
  "camera.confidence": "Confidence",
  "camera.outputPhrase": "Output phrase",
  "camera.didYouMean": "Did you mean:",
  "camera.speakOutput": "Speak output",
  "camera.cameraOff": "Camera is off. Press Start to begin the demo.",
  "camera.notAvailable": "Camera is not available on this device.",
  "camera.denied": "Camera permission was denied or is unavailable.",
  "camera.confLow": "low",
  "camera.confMedium": "medium",
  "camera.confHigh": "high",
  "camera.loadingModel": "Loading sign recognition model…",
  "camera.modelError": "Could not load the sign recognition model.",
  "camera.waitingForSign": "Show a sign to the camera…",
  "camera.detecting": "Detecting…",
  "camera.noHand": "No hand detected",
  "camera.handDetected": "Hand detected",
  "camera.useMock": "Use demo mode",
  "camera.useReal": "Use real recognition",

  // Settings
  "settings.title": "Settings",
  "settings.theme": "Theme",
  "settings.light": "light",
  "settings.dark": "dark",
  "settings.system": "system",
  "settings.language": "Language",
  "settings.langEnglish": "English",
  "settings.langFilipino": "Filipino",
  "settings.emergencyProfile": "Emergency profile",
  "settings.editEmergencyProfile": "Edit emergency profile",
  "settings.speech": "Speech",
  "settings.testSpeech": "Test speech",
  "settings.speechTestText": "This is a Kumpas speech test.",
  "settings.voiceWarning":
    "Filipino speech uses an online voice for natural pronunciation. When offline, it falls back to your device's closest available voice, which may sound imperfect.",
  "settings.data": "Data",
  "settings.clearData": "Clear local data",
  "settings.dataCleared": "Local data cleared.",
  "settings.confirmClear":
    "Clear all local data? This removes your emergency profile and settings, and returns to the setup screen.",
  "settings.battery": "Battery optimization",
  "settings.batteryDesc":
    "Freeze the animated background to save battery. Recommended on mobile.",
  "settings.batteryOn": "On",
  "settings.batteryOff": "Off",
  "settings.restartSetup": "Restart setup",
  "settings.confirmRestart":
    "Restart setup? This clears your data and takes you back to the welcome screens.",
  "settings.tagline": "Kumpas — offline-first FSL communicator",
  "settings.version": "Version",

  // Online AI consent (Settings)
  "settings.onlineAi": "Online AI features",
  "settings.onlineAiDesc":
    "Allow typed messages to be sent to Google Gemini for smarter simplification. Off by default — Hearing Mode works fully offline without it.",
  "settings.privacyLink": "Privacy & Terms",

  // Privacy & Terms page
  "privacy.title": "Privacy & Terms",
  "privacy.intro":
    "Kumpas is built to protect your privacy. It works offline and needs no account. In plain terms:",
  "privacy.p1": "Camera frames are processed on your device and are not uploaded or stored.",
  "privacy.p2": "Sign recognition data stays in memory only and is deleted when the session ends.",
  "privacy.p3": "Your typed messages are not sent to Google Gemini unless you turn on Online AI features and give consent.",
  "privacy.p4": "Online AI features are optional and clearly labeled when they are active.",
  "privacy.p5": "Filipino speech uses an online voice service only while you are online; otherwise your device's built-in voice is used.",
  "privacy.p6": "Your emergency profile and settings are stored only on this device.",
  "privacy.p7": "You can clear all local data at any time — useful on shared or public devices.",
  "privacy.p8": "No account or sign-in is required for offline use.",
  "privacy.back": "Back to Settings",

  // Not found
  "notFound.title": "Page not found",
  "notFound.body": "That page does not exist. Let's get you back.",
  "notFound.goHome": "Go home",

  // Speak button
  "speak.notAvailable": "Speech is not available on this device.",
};

const fil: Dict = {
  // Common
  "common.speak": "Bigkasin / Pakinggan",
  "common.stop": "Hinto",
  "common.back": "Balik",
  "common.copy": "Kopyahin",
  "common.copied": "Nakopya na!",
  "common.cancel": "Kanselahin",
  "common.loading": "Sandali lang…",

  // Navigation
  "nav.home": "Home",
  "nav.library": "Mga Parirala",
  "nav.emergency": "Saklolo",
  "nav.hearing": "Para sa Nakaririnig",
  "nav.camera": "Kamera",

  // Status
  "status.online": "Konektado",
  "status.offlineReady": "Pwede nang gamitin offline",
  "status.offlineBanner":
    "Offline ka ngayon, pero huwag mag-alala dahil gumagana pa rin ang lahat ng chat at komunikasyon dito.",

  // Header
  "header.settings": "Mga Setting",

  // Install (PWA)
  "install.section": "I-download ang app",
  "install.description":
    "I-install ang Kumpas sa iyong device para mas mabilis mong magamit kahit walang internet.",
  "install.button": "I-install ang Kumpas",
  "install.installed": "Naka-install na ang Kumpas sa iyong device.",
  "install.iosHint":
    "Para mai-save sa phone: pindutin ang \"Share\" button at piliin ang \"Add to Home Screen\".",
  "install.unavailable":
    "Hindi pa pwedeng i-install sa ngayon. Maaaring hindi ito suportado ng iyong browser o naka-install na ang app.",
  "install.bannerTitle": "I-save ang Kumpas sa Phone",
  "install.bannerBody": "Idagdag ito sa iyong device para magamit mo kahit saan, kahit offline.",
  "install.bannerAction": "I-install",
  "install.bannerDismiss": "Isara",

  // Onboarding
  "onb.welcomeTitle": "Maligayang pagdating sa Kumpas",
  "onb.welcomeMessage":
    "Gabay mo sa offline na FSL communication para sa serbisyo publiko at emerhensiya batay sa RA 11106.",
  "onb.badge": "Tulong sa Komunikasyon • 100% Offline Gumagana",
  "onb.getStarted": "Magsimula Na",
  "onb.prefsTitle": "Ayusin ang Wika at Sukat ng Teksto",
  "onb.language": "Wika",
  "onb.textSize": "Sukat ng Teksto",
  "onb.sizeNormal": "Katamtaman",
  "onb.sizeLarge": "Malaki",
  "onb.sizeXlarge": "Napakalaki",
  "onb.sizePreview": "Ganito ang magiging hitsura ng teksto",
  "onb.next": "Kasunod",
  "onb.back": "Balik",
  "onb.profileTitle": "Iyong Emergency ID",
  "onb.profileContext":
    "Kung ikaw ay may kapansanan sa pandinig, malaking tulong ang Emergency ID na ito para agad kang maunawaan ng mga first responder.",
  "onb.name": "Pangalan",
  "onb.contactNumber": "Pangalan at Numero ng Iyong Kasama o Kamag-anak",
  "onb.contactHint": "Ilagay ang iyong 10-digit na mobile number (9XX XXX XXXX).",
  "onb.contactValid": "Ayos ang numero!",
  "onb.contactInvalid": "Pakisiguradong tama at wastong numero sa Pilipinas ang inilagay mo.",
  "onb.setupLater": "Mamaya na lang i-set up (Pumunta sa Emergency Tab)",
  "onb.finish": "Tapusin at Simulan Na",
  "onb.step": "Hakbang",
  "onb.of": "ng",

  // Home
  "home.eyebrow": "Offline-first na FSL Communicator",
  "home.title": "\"Para sa\\ninklusibong bukas.\"",
  "home.emergency": "Emergency / Saklolo",
  "home.phraseCategories": "Mga Kategorya",
  "home.recentlyUsed": "Mga Huling Ginamit",
  "home.moreTools": "Iba Pang Kagamitan",
  "home.hearingMode": "Pang-nakaririnig",
  "home.cameraDemo": "Kumpas Camera",

  // Library
  "library.title": "Listahan ng mga Parirala",
  "library.search": "Maghanap ng parirala...",
  "library.all": "Ipakita Lahat",
  "library.noResults": "Paumanhin, walang nahanap na parirala na katugma ng iyong hinahanap.",
  "library.filterAria": "Salain ayon sa kategorya",
  "library.category": "Kategorya",
  "library.loading": "Kinukuha ang mga parirala…",
  "library.urgent": "Kailangan Agad",

  // Communication card
  "comm.fslPlaceholder": "Lalabas dito ang FSL video gabay",
  "comm.fslBadge": "FSL",
  "comm.aslBadge": "ASL",
  "comm.signAlt": "Senyas para sa pariralang: ",

  // Hearing mode
  "hearing.title": "Para sa Nakaririnig",
  "hearing.subtitle":
    "Mag-type ng mensahe para sa taong may kapansanan sa pandinig upang awtomatiko itong pasimplehin ng app para sa mas malinaw na pag-unawa.",
  "hearing.yourMessage": "Iyong Mensahe",
  "hearing.placeholder":
    "hal. Pakihintay po muna sa labas habang pinoproseso ang inyong dokumento.",
  "hearing.simplify": "Pasimplehin ang Teksto",
  "hearing.original": "Orihinal na Mensahe",
  "hearing.simplified": "Pinasimpleng Mensahe",
  "hearing.speakSimplified": "Ipabasa nang malakas ang pinasimple",
  "hearing.suggested": "Mga mungkahing tugon",

  // Emergency
  "emergency.title": "Emergency / Saklolo",
  "emergency.message":
    "May kapansanan po ako sa pandinig (Bingi). Kailangan ko po ng tulong ninyo. Paki-kontak po ang aking emergency contact na nakasulat sa ibaba.",
  "emergency.speakMessage": "Ipabasa ang emergency message",
  "emergency.iAmDeaf": "Bingi ako / May kapansanan ako sa pandinig.",
  "emergency.name": "Pangalan",
  "emergency.contact": "Emergency Contact Person",
  "emergency.contactName": "Pangalan ng Tatawagan",
  "emergency.contactNumber": "Numero ng Telepono",
  "emergency.medicalNote": "Mahalagang Tala sa Medikal",
  "emergency.addressNote": "Address o Barangay",
  "emergency.address": "Tirahan / Barangay",
  "emergency.editProfile": "Baguhin ang Profile",
  "emergency.setupTitle": "I-set up ang Emergency Profile",
  "emergency.editTitle": "Baguhin ang Profile",
  "emergency.saveProfile": "I-save ang Profile",

  // Camera
  "camera.title": "Kumpas Kamera Mode",
  "camera.start": "Buksan ang Kamera",
  "camera.stop": "Isara ang Kamera",
  "camera.detectedSign": "Natukoy na Senyas",
  "camera.confidence": "Katiyakan ng Senyas",
  "camera.outputPhrase": "Resultang Parirala",
  "camera.didYouMean": "Ang ibig mo bang sabihin:",
  "camera.speakOutput": "Patunugin ang Resulta",
  "camera.cameraOff": "Naka-off ang kamera. Pindutin ang \"Buksan ang Kamera\" para magsimula.",
  "camera.notAvailable": "Hindi available o walang kamera ang device na ito.",
  "camera.denied": "Tinanggihan ang pahintulot sa kamera o hindi ito magamit.",
  "camera.confLow": "mababa",
  "camera.confMedium": "katamtaman",
  "camera.confHigh": "mataas",
  "camera.loadingModel": "Inihahanda ang sign recognition model…",
  "camera.modelError": "Paumanhin, hindi ma-load ang sign recognition model sa ngayon.",
  "camera.waitingForSign": "Senyas po kayo sa harap ng kamera…",
  "camera.detecting": "Sinusuri ang senyas…",
  "camera.noHand": "Walang kamay na makita sa kamera",
  "camera.handDetected": "May nakitang kamay",
  "camera.useMock": "Subukan ang Demo Mode",
  "camera.useReal": "Gamitin ang AI Recognition",

  // Settings
  "settings.title": "Mga Setting",
  "settings.theme": "Tema ng App",
  "settings.light": "maliwanag",
  "settings.dark": "madilim",
  "settings.system": "default ng system",
  "settings.language": "Wika",
  "settings.langEnglish": "English",
  "settings.langFilipino": "Filipino",
  "settings.emergencyProfile": "Emergency Profile",
  "settings.editEmergencyProfile": "Ayusin ang detalye ng iyong profile",
  "settings.speech": "Pagsasalita at Boses",
  "settings.testSpeech": "Subukan ang boses ng app",
  "settings.speechTestText": "Magandang araw! Ito ay isang pagsubok sa boses at pagsasalita ng Kumpas.",
  "settings.voiceWarning":
    "Ang natural na pagbigkas sa wikang Filipino ay mas gumagana kapag online. Kung offline, gagamitin ng app ang built-in na boses ng iyong device na maaaring magbago ang kalidad ng tunog.",
  "settings.data": "Imbakan ng Datos",
  "settings.clearData": "Burahin ang naka-save na datos",
  "settings.dataCleared": "Nabura na ang lahat ng lokal na datos.",
  "settings.confirmClear":
    "Sigurado ka bang buburahin mo ang lahat ng lokal na datos? Mawawala ang iyong emergency profile pati mga setting at babalik ka sa panimulang screen.",
  "settings.battery": "Pag-optimize ng baterya",
  "settings.batteryDesc":
    "I-freeze ang animated na background para makatipid sa baterya. Inirerekomenda sa mobile.",
  "settings.batteryOn": "Naka-on",
  "settings.batteryOff": "Naka-off",
  "settings.restartSetup": "Ulitin ang setup ng app",
  "settings.confirmRestart":
    "Ulitin ang setup? Buburahin nito ang iyong kasalukuyang datos para magsimula ka ulit sa welcome screen.",
  "settings.tagline": "Kumpas — offline-first na FSL communicator",
  "settings.version": "Bersyon ng App",

  // Online AI consent (Settings)
  "settings.onlineAi": "Mga online AI feature",
  "settings.onlineAiDesc":
    "Payagan na maipadala ang mga na-type na mensahe sa Google Gemini para sa mas mahusay na pagpapasimple. Naka-off bilang default — gumagana nang buong offline ang Hearing Mode kahit wala ito.",
  "settings.privacyLink": "Privacy at mga Tuntunin",

  // Privacy & Terms page
  "privacy.title": "Privacy at mga Tuntunin",
  "privacy.intro":
    "Ginawa ang Kumpas para protektahan ang iyong privacy. Gumagana ito offline at hindi nangangailangan ng account. Sa simpleng salita:",
  "privacy.p1": "Ang mga frame ng kamera ay pinoproseso sa iyong device at hindi ini-upload o iniimbak.",
  "privacy.p2": "Ang datos ng pagkilala ng senyas ay nasa memory lamang at binubura kapag natapos ang session.",
  "privacy.p3": "Ang iyong mga na-type na mensahe ay hindi ipinapadala sa Google Gemini maliban kung i-on mo ang Online AI features at magbigay ng pahintulot.",
  "privacy.p4": "Opsyonal ang mga online AI feature at malinaw na nakalabel kapag aktibo ang mga ito.",
  "privacy.p5": "Gumagamit ang Filipino na boses ng online na serbisyo kapag online ka lamang; kung hindi, ginagamit ang boses ng iyong device.",
  "privacy.p6": "Ang iyong emergency profile at mga setting ay iniimbak lamang sa device na ito.",
  "privacy.p7": "Maaari mong burahin ang lahat ng lokal na datos anumang oras — kapaki-pakinabang sa mga hiniram o pampublikong device.",
  "privacy.p8": "Walang account o pag-sign-in na kailangan para sa paggamit offline.",
  "privacy.back": "Bumalik sa Settings",

  // Not found
  "notFound.title": "Hindi nahanap ang pahina",
  "notFound.body": "Mukhang wala rito ang pahinang hinahanap mo. Ibalik ka namin sa ligtas na lugar.",
  "notFound.goHome": "Bumalik sa Home",

  // Speak button
  "speak.notAvailable": "Paumanhin, hindi suportado ang voice synthesis sa device na ito.",};

export const translations: Record<Language, Dict> = { en, fil };
