"use server";

import { connectToDatabase } from "@/lib/database";
import CompanySetting, { ICompanySetting } from "@/lib/database/models/companySetting.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getCompanySettings(): Promise<any> {
  const fallbackSettings = {
    companyName: "RIZMEC",
    tagline: "From Algorithms to Engineered Intelligence",
    positioning: "Engineering digital infrastructure that helps businesses operate, automate, and scale.",
    philosophy: "From Algorithms to Engineered Intelligence.",
    contactEmail: "hello@rizmec.com",
    contactPhone: "",
    address: "Gazipur 1750, Dhaka, Bangladesh",
    paymentInstructions:
      "Bank Wire / International Transfer: Inquire with billing at hello@rizmec.com for verified account details.",
  };

  try {
    await connectToDatabase();
    let setting = await CompanySetting.findOne().lean();
    if (!setting) {
      return fallbackSettings;
    }
    return JSON.parse(JSON.stringify(setting));
  } catch (error) {
    console.warn("Error fetching company settings, using verified fallbacks:", error);
    return fallbackSettings;
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
