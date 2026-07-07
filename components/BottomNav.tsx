"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Siren,
  MessageSquare,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const items: Array<{
  labelKey: string;
  href: string;
  icon: LucideIcon;
  emphasized?: boolean;
}> = [
  { labelKey: "nav.home", href: "/", icon: Home },
  { labelKey: "nav.library", href: "/library", icon: BookOpen },
  { labelKey: "nav.emergency", href: "/emergency", icon: Siren, emphasized: true },
  { labelKey: "nav.hearing", href: "/hearing", icon: MessageSquare },
  { labelKey: "nav.camera", href: "/camera", icon: Camera },
];

/**
 * Thumb-reachable persistent navigation.
 * Active item: yellow fill. Emergency: always danger-red text + pulsing dot
 * badge when inactive, so it is findable instantly in a crisis.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Primary navigation"
        className="pointer-events-auto w-full max-w-[26rem] rounded-[2rem] border border-border/30 bg-surface/60 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-lg"
      >
        <ul className="grid grid-cols-5 gap-1 px-2 py-2">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            const label = t(item.labelKey);

            return (
              <li key={item.href} className="relative">
                {/* Pulsing dot on Emergency when NOT active — always findable */}
                {item.emphasized && !isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-danger"
                  />
                )}

                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-[1.25rem] px-0.5 py-1.5 text-center font-bold leading-[1.05] transition-colors ${
                    isActive
                      ? "bg-bee-yellow text-bee-black shadow-sm"
                      : item.emphasized
                        ? "text-danger hover:bg-danger/10"
                        : "text-text-muted hover:bg-text/5"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={
                      item.emphasized && !isActive
                        ? "h-6 w-6 shrink-0"
                        : "h-5 w-5 shrink-0"
                    }
                  />
                  <span
                    className="w-full hyphens-auto break-words text-[0.625rem]"
                    style={{ fontSize: "clamp(9px, 2.6vw, 11px)" }}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
