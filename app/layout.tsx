import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FontSizeProvider } from "@/components/FontSizeProvider";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AppGate } from "@/components/AppGate";
import { ShapeGridBackground } from "@/components/ShapeGridBackground";
import { BatterySaverProvider } from "@/components/BatterySaverProvider";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Inter, Fredoka } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Rounded, friendly display face for the Kumpas wordmark — echoes the soft
// shapes of the bee logo while staying highly legible.
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["500", "600", "700"],
});


import { DevServiceWorkerCleanup } from "@/components/DevServiceWorkerCleanup";

export const metadata: Metadata = {
  title: "Kumpas — FSL Communicator",
  description:
    "An offline-first Filipino Sign Language communication assistant for public-service and emergency situations.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Kumpas",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, fredoka.variable)}
    >
      <body className="bg-bg">
        <DevServiceWorkerCleanup />
        <BatterySaverProvider>
          {/* Animated honeycomb (ShapeGrid) background — frozen when battery
              optimization is on. */}
          <ShapeGridBackground />

          <ThemeProvider>
            <FontSizeProvider>
              <LanguageProvider>
                <AppGate>
                  <div className="relative z-10 flex min-h-dvh flex-col">
                    <AppHeader />
                    <OfflineIndicator />
                    <a
                      href="#main-content"
                      className="sr-only rounded-md bg-bee-yellow px-4 py-3 font-bold text-bee-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
                    >
                      Skip to content
                    </a>
                    <main
                      id="main-content"
                      className="mx-auto w-full max-w-3xl flex-1 px-5 pb-28 pt-7 sm:px-8 lg:max-w-5xl"
                    >
                      {children}
                    </main>
                    <BottomNav />
                  </div>
                </AppGate>
              </LanguageProvider>
            </FontSizeProvider>
          </ThemeProvider>
        </BatterySaverProvider>
      </body>
    </html>
  );
}
