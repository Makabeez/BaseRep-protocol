import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "BaseRep Protocol | On-Chain Identity",
  description: "Establish your professional reputation on the Base blockchain ecosystem.",
  
  // Link to the manifest file for Base App compatibility
  manifest: "/manifest.json",

  openGraph: {
    title: "BaseRep Protocol",
    description: "Analyze your on-chain footprint and reveal your architect rank.",
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

  // Farcaster Frames v2 Metadata
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://baserep.xyz/og-image.png?v=4",
    "fc:frame:button:1": "Verify Score",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://baserep.xyz",
    "fc:frame:aspect_ratio": "1.91:1",
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
