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
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bee-black"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5 gap-0.5 px-1 sm:gap-1 sm:px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
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
                className={`flex w-full min-h-14 flex-col items-center justify-start gap-1 rounded-button px-0.5 pt-2 text-center font-bold leading-[1.05] transition-colors ${
                  isActive
                    ? "bg-bee-yellow text-bee-black"
                    : item.emphasized
                      ? "text-danger hover:bg-white/10"
                      : "text-white/70 hover:bg-white/10"
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
                {/*
                  Fixed, compact label size that does NOT scale with the
                  global text-size setting, so all five labels stay on their
                  own line and never collide. Uses rem-independent px + break.
                */}
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
  );
}
