import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { HomePage } from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/phrases",
        element: (
          <PlaceholderPage
            title="Phrase library"
            description="Offline categories and communication phrases will be built in Phase 2."
          />
        ),
      },
      {
        path: "/communication/:phraseId",
        element: (
          <PlaceholderPage
            title="Communication card"
            description="Selected phrases will appear here in large, readable text."
          />
        ),
      },
      {
        path: "/hearing",
        element: (
          <PlaceholderPage
            title="Hearing person mode"
            description="Local message simplification will be added in Phase 4."
          />
        ),
      },
      {
        path: "/emergency",
        element: (
          <PlaceholderPage
            title="Emergency card"
            description="The offline emergency profile will be added in Phase 3."
          />
        ),
      },
      {
        path: "/camera",
        element: (
          <PlaceholderPage
            title="Camera demo"
            description="The mock sign-recognition flow will be added in Phase 5."
          />
        ),
      },
      {
        path: "/settings",
        element: (
          <PlaceholderPage
            title="Settings"
            description="Local profile and app settings will be managed here."
          />
        ),
      },
    ],
  },
]);
