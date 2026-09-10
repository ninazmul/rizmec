"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/database";
import User, { IUser, IUserPermission } from "@/lib/database/models/user.model";
import Project from "@/lib/database/models/project.model";
import TeamMember from "@/lib/database/models/teamMember.model";
import { CmsModule, CmsAction, UserRole } from "@/constants/permissions";
import { hasPermission, canAccessModule, DashboardAccess } from "./rbac-rules";

// Super Admin override emails
const SUPER_ADMIN_EMAILS = Array.from(
  new Set([
    "rizmecofficial@gmail.com",
    "nazmulsaw@gmail.com",
    ...(process.env.SUPER_ADMIN_EMAILS
      ? process.env.SUPER_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
      : []),
  ])
);

export async function getCurrentDashboardAccess(): Promise<DashboardAccess | null> {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDatabase();

  // Fetch Clerk user details directly via Clerk SDK
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress || "";
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Engineer";
  const imageUrl = clerkUser.imageUrl || "";

  // Find by clerkId or email
  let dbUser = await User.findOne({ clerkId: userId });
  if (!dbUser && email) {
    dbUser = await User.findOne({ email: email.toLowerCase() });
  }

  const isSuperAdmin = SUPER_ADMIN_EMAILS.some(
    (e) => e.toLowerCase() === email.toLowerCase(),
  );

  if (dbUser) {
    // Sync information & update clerkId if placeholder
    const updateData: any = {
      clerkId: userId,
      email: email.toLowerCase(),
      name,
      imageUrl,
    };
    if (isSuperAdmin && dbUser.role !== "super_admin") {
      updateData.role = "super_admin";
    }

    dbUser = await User.findByIdAndUpdate(
      dbUser._id,
      { $set: updateData },
      { returnDocument: "after" },
    );
  } else {
    try {
      dbUser = await User.create({
        clerkId: userId,
        email: email.toLowerCase(),
        name,
        imageUrl,
        role: isSuperAdmin ? "super_admin" : "worker",
        status: "active",
        permissions: [],
      });
    } catch (createError: any) {
      if (createError.code === 11000) {
        dbUser = await User.findOne({ clerkId: userId });
        if (!dbUser && email) {
          dbUser = await User.findOne({ email: email.toLowerCase() });
        }
      } else {
        throw createError;
      }
    }
  }

  if (!dbUser || dbUser.status === "suspended") return null;

  const role: UserRole = isSuperAdmin ? "super_admin" : (dbUser.role || "worker");

  const permissions = (dbUser.permissions ?? []).map((p: IUserPermission) => ({
    module: p.module,
    actions: p.actions,
  }));

  let teamMemberId = dbUser.teamMemberId?.toString();
  if (!teamMemberId && email) {
    const matchedMember = await TeamMember.findOne({ email: email.toLowerCase() })
      .select("_id")
      .lean();
    if (matchedMember) {
      teamMemberId = (matchedMember as any)._id.toString();
      await User.findByIdAndUpdate(dbUser._id, {
        teamMemberId: (matchedMember as any)._id,
      });
    }
  }

  let assignedProjectsCount = 0;
  if ((role === "worker" || role === "intern") && teamMemberId) {
    assignedProjectsCount = await Project.countDocuments({
      teamMemberIds: teamMemberId,
    });
  }

  return {
    userId,
    dbUserId: dbUser._id.toString(),
    email,
    name: dbUser.name,
    role,
    isSuperAdmin: role === "super_admin",
    teamMemberId,
    permissions,
    assignedProjectsCount,
  };
}

/**
 * Ensures the current user has dashboard access.
 */
export async function requireDashboardAccess(
  redirectTo = "/sign-in",
): Promise<DashboardAccess> {
  const access = await getCurrentDashboardAccess();
  if (!access) {
    redirect(redirectTo);
  }
  return access!;
}

/**
 * Guard used inside Server Actions to enforce RBAC.
 */
export async function requirePermission(
  module: CmsModule,
  action: CmsAction,
): Promise<DashboardAccess> {
  const access = await requireDashboardAccess("/sign-in");

  if (!hasPermission(access, module, action)) {
    throw new Error(
      `Forbidden: Access denied for "${action}" on module "${module}".`,
    );
  }

  return access;
}
