import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenOps AI - Intelligent Cloud & Server ESG Optimizer",
  description: "Autonomous digital carbon accounting, real-time grid workload shifting, and 1-click ESG compliance audit reporting for cloud servers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
