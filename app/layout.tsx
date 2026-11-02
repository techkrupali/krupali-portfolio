import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const head = Space_Grotesk({ subsets: ["latin"], variable: "--font-head", display: "swap" });
const body = IBM_Plex_Mono({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Krupali Vekariya | Full-Stack AI Engineer",
  description: "Full-Stack AI Engineer and product builder in Rajkot, India. Web, mobile, AI, SaaS, CRM and ERP.",
  openGraph: { title: "Krupali Vekariya | Building Ideas Into Digital Reality", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f4f1ea" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
