"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import Homepage from "@/lib/database/models/homepage.model";
import { requirePermission } from "@/lib/auth/rbac";

export async function getHomepageConfig() {
  try {
    await connectToDatabase();
    let config = await Homepage.findOne().lean();
    if (!config) {
      const defaultSections = [
        { sectionType: "hero", title: "Hero Slider", enabled: true, order: 1 },
        {
          sectionType: "missionCards",
          title: "Our Missions",
          enabled: true,
          order: 2,
        },
        {
          sectionType: "aboutPreview",
          title: "About Us",
          enabled: true,
          order: 3,
        },
        {
          sectionType: "featuredProjects",
          title: "Featured Projects",
          enabled: true,
          order: 4,
        },
        {
          sectionType: "galleryPreview",
          title: "Photo Gallery",
          enabled: true,
          order: 5,
        },
        {
          sectionType: "statistics",
          title: "Impact Statistics",
          enabled: true,
          order: 6,
        },
        {
          sectionType: "donationCta",
          title: "Support Our Cause",
          enabled: true,
          order: 7,
        },
        {
          sectionType: "volunteerCareerCta",
          title: "Join Us",
          enabled: true,
          order: 8,
        },
        {
          sectionType: "contactCta",
          title: "Contact Us",
          enabled: true,
          order: 9,
        },
      ];

      const newConfig = await Homepage.create({ sections: defaultSections });
      config = newConfig.toObject();
    }
    return { success: true, data: JSON.parse(JSON.stringify(config)) };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch homepage configuration",
    };
  }
}

export async function updateHomepageConfig(data: {
  sections?: any[];
  aboutPreview?: any;
  donationCta?: any;
}) {
  await requirePermission("dashboard", "update");
  try {
    await connectToDatabase();
    let config = await Homepage.findOne();
    if (!config) {
      config = await Homepage.create(data);
    } else {
      if (data.sections !== undefined) config.sections = data.sections;
      if (data.aboutPreview !== undefined)
        config.aboutPreview = { ...config.aboutPreview, ...data.aboutPreview };
      if (data.donationCta !== undefined)
        config.donationCta = { ...config.donationCta, ...data.donationCta };
      await config.save();
    }

    revalidatePath("/");
    revalidatePath("/dashboard/homepage");

    return { success: true, data: JSON.parse(JSON.stringify(config)) };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update homepage configuration",
    };
  }
}
