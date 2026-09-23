export const dynamic = "force-dynamic";

import React from "react";
import { getProjects } from "@/lib/actions/project.actions";
import { requireDashboardAccess } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectManagementDashboardPage() {
  const access = await requireDashboardAccess("/sign-in");

  // Workers and interns without assigned projects are redirected away
  if (
    (access.role === "worker" || access.role === "intern") &&
    (access.assignedProjectsCount ?? 0) <= 0
  ) {
    redirect("/dashboard/profile");
  }

  const res = await getProjects();
  const projects = res.success ? res.data : [];

  return (
    <ProjectsClient
      initialProjects={projects}
      access={{
        role: access.role,
        isSuperAdmin: access.isSuperAdmin,
      }}
    />
  );
}
