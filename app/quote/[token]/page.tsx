import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getQuotationByToken } from "@/lib/actions/quotation.actions";
import PublicQuoteView from "@/components/quote/PublicQuoteView";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const res = await getQuotationByToken(token);
  if (!res.success || !res.data) {
    return {
      title: "Quotation Not Found",
      description: "The requested quotation could not be found or has expired.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const data = res.data;
  const client = data.clientCompany || data.clientName;
  const title = `Quotation ${data.quoteNumber} — ${data.projectName}`;
  const fullTitle = `${title} | RIZMEC`;
  const description = `Official engineering quotation ${data.quoteNumber} for ${data.projectName}${client ? ` prepared for ${client}` : ""}. Review scope, milestones, and agreement details.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `/quote/${token}`,
      siteName: "RIZMEC",
      type: "website",
      images: [
        {
          url: "/assets/images/rizmec-icon.png",
          width: 512,
          height: 512,
          alt: "RIZMEC Engineering",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: ["/assets/images/rizmec-icon.png"],
    },
  };
}

export default async function PublicQuotePage({ params }: Props) {
  const { token } = await params;
  const res = await getQuotationByToken(token);

  if (!res.success || !res.data) {
    notFound();
  }

  return <PublicQuoteView quotation={res.data} />;
}
