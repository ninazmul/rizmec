"use server";

import { connectToDatabase } from "@/lib/database";
import CompanySetting, { ICompanySetting } from "@/lib/database/models/companySetting.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getCompanySettings(): Promise<any> {
  try {
    await connectToDatabase();
    let setting = await CompanySetting.findOne().lean();
    if (!setting) {
      setting = await CompanySetting.create({
        companyName: "Rizmec",
        tagline: "Software Engineering & Intelligent Automation",
        positioning: "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale.",
        philosophy: "From algorithms to engineered intelligence.",
        contactEmail: "hello@rizmec.com",
        contactPhone: "",
        address: "Dhaka, Bangladesh",
        paymentInstructions:
          "Bank Wire Transfer / ACH: Details provided on verified engineering contracts.",
      });
      setting = JSON.parse(JSON.stringify(setting));
    }
    return JSON.parse(JSON.stringify(setting));
  } catch (error) {
    console.error("Error fetching company settings:", error);
    return null;
  }
}

// Backward compatibility alias for public layout
export async function getSetting() {
  const s = await getCompanySettings();
  if (!s) return null;
  return {
    ...s,
    siteName: s.companyName,
    phoneNumber: s.contactPhone,
  };
}

export async function updateCompanySettings(data: Partial<ICompanySetting>) {
  try {
    await requirePermission("settings", "update");
    await connectToDatabase();

    let setting = await CompanySetting.findOne();
    if (!setting) {
      setting = await CompanySetting.create(data);
    } else {
      setting = await CompanySetting.findByIdAndUpdate(setting._id, { $set: data }, { new: true });
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/");
    revalidatePath("/transition", "page");
    return { success: true, data: JSON.parse(JSON.stringify(setting)) };
  } catch (error: any) {
    console.error("Error updating company settings:", error);
    return { success: false, error: error.message };
  }
}
