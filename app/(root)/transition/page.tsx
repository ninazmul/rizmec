import React from "react";
import type { Metadata } from "next";
import TransitionPageContent from "./TransitionPageContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ARTISTYCODE STUDIO → RIZMEC — The Evolution",
  description:
    "ArtistyCode Studio is evolving into RIZMEC — a technology company focused on software engineering, AI, automation, and intelligent digital infrastructure. Same foundation. Bigger vision. New identity.",
  keywords: [
    "RIZMEC",
    "ArtistyCode Studio",
    "rebrand",
    "evolution",
    "technology company",
    "software engineering",
    "AI systems",
    "automation",
    "digital infrastructure",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "RIZMEC",
    title: "ARTISTYCODE STUDIO → RIZMEC — The Evolution",
    description:
      "ArtistyCode Studio is evolving into RIZMEC. Same foundation. Bigger vision. New identity.",
    images: [
      {
        url: "/assets/images/rizmec-icon.png",
        width: 512,
        height: 512,
        alt: "RIZMEC Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARTISTYCODE STUDIO → RIZMEC — The Evolution",
    description:
      "ArtistyCode Studio is evolving into RIZMEC. Same foundation. Bigger vision. New identity.",
    images: ["/assets/images/rizmec-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TransitionPage() {
  return <TransitionPageContent />;
}
