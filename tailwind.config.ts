import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ["var(--font-head)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-monospace", "monospace"],
      },
      // Values live in app/globals.css (:root) so the whole theme changes in one place.
      colors: { paper: "var(--paper)", ink: "var(--ink)", mut: "var(--mut)", line: "var(--line)", acc: "var(--acc)" },
    },
  },
  plugins: [],
};
export default config;
