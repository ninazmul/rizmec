import React from "react";
import type { Metadata } from "next";
import TransitionPageContent from "./TransitionPageContent";
import { getCompanySettings } from "@/lib/actions/setting.actions";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings();
  const canonical =
    settings?.seo?.canonicalUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizmec.com";

  return {
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
    metadataBase: new URL(canonical),
    alternates: { canonical: "/transition" },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: settings?.companyName || "RIZMEC",
      url: `${canonical}/transition`,
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
}

export type TransitionContactInfo = {
  siteUrl: string;
  email?: string;
  phone?: string;
  whatsappHref?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
};

export default async function TransitionPage() {
  const settings = await getCompanySettings();
  const canonical =
    settings?.seo?.canonicalUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizmec.com";
  const phoneRaw = settings?.contactPhone as string | undefined;
  const phoneDigits = phoneRaw ? String(phoneRaw).replace(/[^0-9]/g, "") : "";
  const whatsappHref =
    phoneDigits.length >= 6 ? `https://wa.me/${phoneDigits}` : undefined;

  const isSet = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  const contactInfo: TransitionContactInfo = {
    siteUrl: isSet(canonical) ? canonical : "https://rizmec.com",
    email: isSet(settings?.contactEmail)
      ? (settings.contactEmail as string).trim()
      : undefined,
    phone: isSet(phoneRaw) ? (phoneRaw as string).trim() : undefined,
    whatsappHref,
    social: {
      github: isSet(settings?.socialLinks?.github)
        ? (settings.socialLinks.github as string).trim()
        : undefined,
      linkedin: isSet(settings?.socialLinks?.linkedin)
        ? (settings.socialLinks.linkedin as string).trim()
        : undefined,
      twitter: isSet(settings?.socialLinks?.twitter)
        ? (settings.socialLinks.twitter as string).trim()
        : undefined,
      youtube: isSet(settings?.socialLinks?.youtube)
        ? (settings.socialLinks.youtube as string).trim()
        : undefined,
    },
  };

  return <TransitionPageContent contactInfo={contactInfo} />;
}
