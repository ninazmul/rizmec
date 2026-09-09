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
    return { title: "Quotation Not Found" };
  }
  return {
    title: `Quotation ${res.data.quoteNumber} — RIZMEC Engineering`,
    description: `Scope and agreement for project: ${res.data.projectName}`,
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
