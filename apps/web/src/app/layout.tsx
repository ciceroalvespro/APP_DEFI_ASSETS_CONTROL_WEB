import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export const metadata = { title: "DeFi Control", description: "Portfolio + LP Tracker + Simulator" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen text-white">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
