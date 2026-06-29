import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  return (
    <div className="mx-auto min-h-dvh max-w-3xl bg-[#f7f7f2] text-[#172321]">
      <a
        className="sr-only z-50 rounded-md bg-white px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <AppHeader />
      <main id="main-content" className="px-5 pb-28 pt-7 sm:px-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
