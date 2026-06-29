import { Link } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-[#f7f7f2]/95 px-5 py-4 backdrop-blur sm:px-8">
      <Link className="text-xl font-black tracking-[-0.04em]" to="/">
        Kumpas
      </Link>
      <span className="rounded-full bg-[#dceae4] px-3 py-1 text-xs font-bold text-[#0b3d3a]">
        App scaffold
      </span>
    </header>
  );
}
