import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Perihelion Travel Hub",
  description: "Systém pro správu cestovních příkazů",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>
        <div className="flex bg-slate-50 min-h-screen">
          <Sidebar />
          <main className="ml-64 flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
