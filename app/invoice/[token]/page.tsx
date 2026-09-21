import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getInvoiceByToken } from "@/lib/actions/invoice.actions";
import { getCurrentDashboardAccess } from "@/lib/auth/rbac";
import PublicInvoiceView from "@/components/invoice/PublicInvoiceView";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const res = await getInvoiceByToken(token);
  if (!res.success || !res.data) {
    return {
      title: "Invoice Not Found",
      description: "The requested invoice could not be found or the link is invalid.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const data = res.data;
  const client = data.clientCompany || data.clientName;
  const title = `Invoice ${data.invoiceNumber} — ${data.projectName}`;
  const fullTitle = `${title} | RIZMEC`;
  const description = `Commercial invoice ${data.invoiceNumber} for ${data.projectName}${client ? ` issued to ${client}` : ""}. View billing breakdown, milestone schedules, and payment instructions.`;

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
      url: `/invoice/${token}`,
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

export default async function PublicInvoicePage({ params }: Props) {
  const { token } = await params;
  const res = await getInvoiceByToken(token);

  if (!res.success || !res.data) {
    notFound();
  }

  const access = await getCurrentDashboardAccess();
  const isAdmin = Boolean(
    access &&
      (access.isSuperAdmin ||
        access.role === "admin" ||
        access.role === "super_admin")
  );

  return <PublicInvoiceView invoice={res.data} isAdmin={isAdmin} />;
}
