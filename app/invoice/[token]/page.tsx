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
    return { title: "Invoice Not Found" };
  }
  return {
    title: `Invoice ${res.data.invoiceNumber} — RIZMEC Engineering`,
    description: `Invoice for project: ${res.data.projectName}`,
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
