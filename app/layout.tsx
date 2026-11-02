import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter } from "next/font/google";
import "./globals.css";

// Inter for headlines and UI, DM Mono for labels and the console screen.
const head = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-head", display: "swap" });
const body = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body", display: "swap" });

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
