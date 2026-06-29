import { NavLink } from "react-router-dom";

const items = [
  { label: "Home", to: "/" },
  { label: "Phrases", to: "/phrases" },
  { label: "Emergency", to: "/emergency" },
  { label: "Camera", to: "/camera" },
  { label: "Settings", to: "/settings" },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-3xl border-t border-black/10 bg-white/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      <ul className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              className={({ isActive }) =>
                `flex min-h-12 items-center justify-center rounded-xl px-1 text-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#0b3d3a] text-white"
                    : "text-[#53615f] hover:bg-[#edf0eb]"
                }`
              }
              end={item.to === "/"}
              to={item.to}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
