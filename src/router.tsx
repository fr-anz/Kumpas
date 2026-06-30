import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { HomePage } from "./pages/HomePage";
import { PhrasesPage } from "./pages/PhrasesPage";
import { CommunicationPage } from "./pages/CommunicationPage";
import { EmergencyPage } from "./pages/EmergencyPage";
import { HearingModePage } from "./pages/HearingModePage";
import { CameraPage } from "./pages/CameraPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/",                          element: <HomePage /> },
      { path: "/phrases",                   element: <PhrasesPage /> },
      { path: "/communication/:phraseId",   element: <CommunicationPage /> },
      { path: "/emergency",                 element: <EmergencyPage /> },
      { path: "/hearing",                   element: <HearingModePage /> },
      { path: "/camera",                    element: <CameraPage /> },
      { path: "/settings",                  element: <SettingsPage /> },
    ],
  },
]);
