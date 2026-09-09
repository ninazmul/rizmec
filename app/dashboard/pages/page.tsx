import { getPages } from "@/lib/actions/page.actions";
import { requirePermission } from "@/lib/auth/rbac";
import PagesClient from "./PagesClient";

export const dynamic = "force-dynamic";

export default async function DynamicPagesDashboard() {
  const access = await requirePermission("dashboard", "read");
  const result = await getPages();
  const pages = result?.pages || [];

  return <PagesClient initialPages={pages} access={access} />;
}
