import type { Metadata } from "next";
import "./globals.css";

// Configuration Metadata pour Next.js 15+
export const metadata: Metadata = {
  title: "BASEREP - On-Chain DNA",
  description: "Verify your reputation on Base",
  other: {
    "base:app_id": "698e57733e2ef73e3a3541e7", // Ton ID de vérification
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
