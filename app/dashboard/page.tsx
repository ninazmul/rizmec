import React from "react";
import Link from "next/link";
import { requireDashboardAccess } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/database";
import Lead from "@/lib/database/models/lead.model";
import Project from "@/lib/database/models/project.model";
import Quotation from "@/lib/database/models/quotation.model";
import Invoice from "@/lib/database/models/invoice.model";
import Service from "@/lib/database/models/service.model";
import Product from "@/lib/database/models/product.model";
import TeamMember from "@/lib/database/models/teamMember.model";
import {
  Users2,
  FolderGit2,
  FileSpreadsheet,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Boxes,
  Cpu,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const access = await requireDashboardAccess("/sign-in");
  await connectToDatabase();

  const [
    totalLeads,
    newLeads,
    totalProjects,
    activeProjects,
    totalQuotations,
    acceptedQuotations,
    invoices,
    totalServices,
    totalProducts,
    totalMembers,
    recentLeads,
    recentQuotes,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "new" }),
    Project.countDocuments(),
    Project.countDocuments({ published: true }),
    Quotation.countDocuments(),
    Quotation.countDocuments({ status: "accepted" }),
    Invoice.find().select("totalAmount amountPaid amountDue status").lean(),
    Service.countDocuments(),
    Product.countDocuments(),
    TeamMember.countDocuments(),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    Quotation.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  // Aggregate financial metrics
  let totalRevenueInvoiced = 0;
  let totalRevenueCollected = 0;
  let totalOutstanding = 0;

  for (const inv of invoices) {
    totalRevenueInvoiced += inv.totalAmount || 0;
    totalRevenueCollected += inv.amountPaid || 0;
    totalOutstanding += inv.amountDue || 0;
  }

  const quoteAcceptanceRate =
    totalQuotations > 0
      ? Math.round((acceptedQuotations / totalQuotations) * 100)
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Executive Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            EXECUTIVE DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            System Operations & Revenue Metrics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <Link
            href="/dashboard/quotations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Quotation</span>
          </Link>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white uppercase tracking-wider hover:bg-white/5 transition-all"
          >
            <span>CRM Pipeline</span>
          </Link>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Collected */}
        <div className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>COLLECTED REVENUE</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${totalRevenueCollected.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-neutral-400">
            Total Invoiced: ${totalRevenueInvoiced.toLocaleString()}
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>OUTSTANDING RECEIVABLES</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${totalOutstanding.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-neutral-400">
            Across {invoices.length} total invoice records
          </div>
        </div>

        {/* CRM Pipeline Leads */}
        <div className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>PIPELINE LEADS</span>
            <Users2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {totalLeads}
          </div>
          <div className="text-xs font-mono text-emerald-400">
            {newLeads} awaiting initial contact
          </div>
        </div>

        {/* Quotation Acceptance Rate */}
        <div className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>QUOTE CONVERSION</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {quoteAcceptanceRate}%
          </div>
          <div className="text-xs font-mono text-neutral-400">
            {acceptedQuotations} of {totalQuotations} quotes accepted
          </div>
        </div>
      </div>

      {/* Secondary Resource Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/dashboard/projects"
          className="p-4 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-neutral-400">CASE STUDIES</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{totalProjects}</div>
          </div>
          <FolderGit2 className="w-5 h-5 text-neutral-400" />
        </Link>

        <Link
          href="/dashboard/services"
          className="p-4 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-neutral-400">SERVICES CMS</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{totalServices}</div>
          </div>
          <Cpu className="w-5 h-5 text-neutral-400" />
        </Link>

        <Link
          href="/dashboard/products"
          className="p-4 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-neutral-400">PRODUCTS & SAAS</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{totalProducts}</div>
          </div>
          <Boxes className="w-5 h-5 text-neutral-400" />
        </Link>

        <Link
          href="/dashboard/team"
          className="p-4 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-neutral-400">ENGINEERS</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{totalMembers}</div>
          </div>
          <Users2 className="w-5 h-5 text-neutral-400" />
        </Link>
      </div>

      {/* Recent Activity Dual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent CRM Leads */}
        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Recent Inquiries & Leads
              </h3>
              <p className="text-xs text-neutral-400 font-mono">Latest entries in CRM pipeline</p>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-xs font-mono text-neutral-400 hover:text-white uppercase"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-white/5 text-xs font-mono">
            {recentLeads.map((lead: any) => (
              <div key={lead._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 truncate">
                  <div className="font-bold text-white truncate">{lead.name}</div>
                  <div className="text-neutral-400 truncate">
                    {lead.company || "Direct Individual"} // {lead.serviceInterest}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      lead.status === "new"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/10 text-neutral-300"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <div className="text-[10px] text-neutral-400 mt-1">{lead.budget}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Recent Quotations
              </h3>
              <p className="text-xs text-neutral-400 font-mono">Status & e-signature tracking</p>
            </div>
            <Link
              href="/dashboard/quotations"
              className="text-xs font-mono text-neutral-400 hover:text-white uppercase"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-white/5 text-xs font-mono">
            {recentQuotes.map((q: any) => (
              <div key={q._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 truncate">
                  <div className="font-bold text-white truncate">
                    {q.quoteNumber} — {q.clientCompany || q.clientName}
                  </div>
                  <div className="text-neutral-400 truncate">{q.projectName}</div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      q.status === "accepted"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/10 text-neutral-300"
                    }`}
                  >
                    {q.status}
                  </span>
                  <div className="text-xs font-bold text-white mt-1">
                    {q.currency} {q.totalAmount?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
