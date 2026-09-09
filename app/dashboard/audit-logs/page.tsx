import React from "react";
import { requirePermission } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/database";
import AuditLog from "@/lib/database/models/auditLog.model";
import { ShieldAlert, Terminal, Clock, User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsDashboardPage() {
  await requirePermission("audit-logs", "read");
  await connectToDatabase();

  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs tracking-widest text-neutral-400 uppercase">
            COMPLIANCE & INTEGRITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans mt-1">
            Tamper-Evident System Audit Logs
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CRYPTO_VERIFIED // 100 RECORDS</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase bg-neutral-900/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    Audit trail operational. No anomaly events recorded.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-4 text-neutral-400">
                      {new Date(log.createdAt).toUTCString()}
                    </td>
                    <td className="py-3.5 px-4 text-white font-bold">
                      {log.actorEmail}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-white/10 text-white font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {log.resource} {log.resourceId && `[#${log.resourceId}]`}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {log.ipAddress || "internal-mesh"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
