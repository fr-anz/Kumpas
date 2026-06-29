import { Link } from "react-router-dom";

const routes = [
  { label: "Browse phrases", to: "/phrases" },
  { label: "Hearing person mode", to: "/hearing" },
  { label: "Camera recognition", to: "/camera" },
];

export function HomePage() {
  return (
    <section aria-labelledby="home-title">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#46736a]">
        Offline-first FSL communicator
      </p>
      <h1
        id="home-title"
        className="max-w-2xl text-5xl font-black leading-[0.96] tracking-[-0.06em] sm:text-6xl"
      >
        Essential communication, within reach.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[#53615f]">
        The application foundation is ready. Features will be implemented one
        phase at a time without requiring sign-in or a permanent connection.
      </p>

      <Link
        className="mt-8 flex min-h-16 w-full items-center justify-center rounded-2xl bg-[#b42318] px-6 text-center text-lg font-black text-white transition-colors hover:bg-[#8f1c14] sm:w-auto"
        to="/emergency"
      >
        Emergency card
      </Link>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {routes.map((route) => (
          <Link
            className="flex min-h-28 items-end rounded-2xl border border-black/10 bg-white p-5 text-lg font-extrabold transition-transform hover:-translate-y-0.5"
            key={route.to}
            to={route.to}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
