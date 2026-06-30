import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Hydrating client-only state from browser APIs (localStorage, the
      // SpeechSynthesis API, navigator.onLine) requires a mount effect because
      // those APIs are unavailable during server rendering. Keep this as a
      // warning rather than a hard error so it stays informative.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    ignores: [".next/**", "out/**", "node_modules/**", "public/sw.js", "public/workbox-*.js"],
  },
];

export default eslintConfig;
