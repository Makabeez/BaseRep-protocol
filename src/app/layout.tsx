import type { Metadata } from "next";
import "./globals.css";

// Cette structure est la méthode officielle Next.js pour injecter les tags Meta
export const metadata: Metadata = {
  title: "BASEREP - On-Chain DNA",
  description: "Verify your reputation on Base",
  other: {
    // Ton ID spécifique fourni par Base.dev
    "base:app_id": "698e57733e2ef73e3a3541e7",
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
