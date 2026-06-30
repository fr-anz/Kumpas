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

/** Thumb-reachable persistent navigation. Active item uses the yellow fill. */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bee-black"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-button px-1 py-1 text-center text-[0.7rem] font-bold transition-colors ${
                  isActive
                    ? "bg-bee-yellow text-bee-black"
                    : item.emphasized
                      ? "text-bee-yellow hover:bg-white/10"
                      : "text-white/70 hover:bg-white/10"
                }`}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
