import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BaseRep Protocol",
  description: "Elevate Your On-Chain DNA",
  openGraph: {
    title: "BaseRep Protocol",
    description: "Elevate Your On-Chain DNA",
    url: "https://baserep.xyz",
    siteName: "BaseRep",
    images: [
      {
        url: "https://baserep.xyz/og-image.png?v=4",
        width: 1200,
        height: 630,
        alt: "BaseRep Futuristic Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Farcaster Frames v2 + Base Verification Metadata
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://baserep.xyz/og-image.png?v=4",
    "fc:frame:button:1": "Verify Score",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://baserep.xyz",
    "fc:frame:aspect_ratio": "1.91:1",
    // AJOUT DE LA VÉRIFICATION BASE ICI
    "base:app_id": "698e57733e2ef73e3a3541e7", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
