import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Inter for headlines and UI, DM Mono for labels and the console screen.
// Self-hosted from app/fonts (SIL Open Font License) so builds never depend on Google Fonts being reachable.
const head = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal",
  variable: "--font-head", display: "swap", fallback: ["system-ui", "Arial", "sans-serif"],
});
const body = localFont({
  src: [
    { path: "./fonts/dm-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-body", display: "swap", fallback: ["ui-monospace", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "Krupali Vekariya | Full-Stack AI Engineer",
  description: "Full-Stack AI Engineer and product builder in Rajkot, India. Web, mobile, AI, SaaS, CRM and ERP.",
  openGraph: { title: "Krupali Vekariya | Building Ideas Into Digital Reality", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f5f4ef" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
