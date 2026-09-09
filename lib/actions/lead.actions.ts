"use server";

import { connectToDatabase } from "@/lib/database";
import Lead, { ILead } from "@/lib/database/models/lead.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getLeads(params?: {
  status?: string;
  priority?: string;
  search?: string;
  limit?: number;
  skip?: number;
}) {
  try {
    await requirePermission("leads", "read");
    await connectToDatabase();

    const query: any = {};
    if (params?.status && params.status !== "all") query.status = params.status;
    if (params?.priority && params.priority !== "all") query.priority = params.priority;

    if (params?.search) {
      const regex = new RegExp(params.search, "i");
      query.$or = [{ name: regex }, { company: regex }, { email: regex }, { tags: regex }];
    }

    const total = await Lead.countDocuments(query);
    let q = Lead.find(query).sort({ createdAt: -1 });

    if (params?.skip) q = q.skip(params.skip);
    if (params?.limit) q = q.limit(params.limit);

    const leads = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(leads)), total };
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return { success: false, error: error.message, data: [], total: 0 };
  }
}

export async function createLead(data: Partial<ILead>) {
  try {
    await requirePermission("leads", "create");
    await connectToDatabase();

    const newLead = await Lead.create({
      ...data,
      timeline: [
        {
          date: new Date(),
          note: `Lead created manually: ${data.serviceInterest || "General Inquiry"}`,
          author: "Admin",
        },
      ],
    });

    revalidatePath("/dashboard/leads");
    return { success: true, data: JSON.parse(JSON.stringify(newLead)) };
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLead(
  id: string,
  data: Partial<ILead>,
  timelineNote?: string,
) {
  try {
    const access = await requirePermission("leads", "update");
    await connectToDatabase();

    const updateQuery: any = { $set: data };

    if (timelineNote) {
      updateQuery.$push = {
        timeline: {
          date: new Date(),
          note: timelineNote,
          author: access.name || "Admin",
        },
      };
    }

    const updated = await Lead.findByIdAndUpdate(id, updateQuery, { new: true }).lean();
    revalidatePath("/dashboard/leads");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating lead:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id: string) {
  try {
    await requirePermission("leads", "delete");
    await connectToDatabase();

    await Lead.findByIdAndDelete(id);
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk CSV Lead Import with Duplicate Detection & Batch Processing
 */
export async function importLeadsBatch(
  leads: Array<{
    name: string;
    company?: string;
    email: string;
    phone?: string;
    country?: string;
    source?: string;
    serviceInterest?: string;
    budget?: string;
    priority?: string;
  }>,
) {
  try {
    await requirePermission("leads", "create");
    await connectToDatabase();

    if (!Array.isArray(leads) || leads.length === 0) {
      return { success: false, error: "No lead records provided for import." };
    }

    const batchId = `import_${Date.now()}`;
    const cleanEmails = leads
      .map((l) => l.email?.trim().toLowerCase())
      .filter(Boolean);

    // Efficient duplicate detection against existing DB emails in one query
    const existingLeads = await Lead.find(
      { email: { $in: cleanEmails } },
      { email: 1 },
    ).lean();
    const existingEmailSet = new Set(existingLeads.map((l) => l.email.toLowerCase()));

    const leadsToInsert: any[] = [];
    const skippedDuplicates: string[] = [];

    for (const item of leads) {
      const email = item.email?.trim().toLowerCase();
      if (!email || !item.name?.trim()) continue;

      if (existingEmailSet.has(email)) {
        skippedDuplicates.push(email);
        continue;
      }

      // Add to set to prevent duplicates within the same import file
      existingEmailSet.add(email);

      leadsToInsert.push({
        name: item.name.trim(),
        company: item.company?.trim() || "",
        email: email,
        phone: item.phone?.trim() || "",
        country: item.country?.trim() || "",
        source: item.source || "import",
        serviceInterest: item.serviceInterest || "Digital Engineering",
        budget: item.budget || "Enterprise",
        priority: item.priority || "medium",
        status: "new",
        tags: ["Imported Batch", batchId],
        importedBatchId: batchId,
        timeline: [
          {
            date: new Date(),
            note: `Bulk imported via CSV (Batch: ${batchId})`,
            author: "Import System",
          },
        ],
      });
    }

    let insertedCount = 0;
    if (leadsToInsert.length > 0) {
      // Efficient MongoDB batch insert
      const result = await Lead.insertMany(leadsToInsert, { ordered: false });
      insertedCount = result.length;
    }

    revalidatePath("/dashboard/leads");
    return {
      success: true,
      batchId,
      insertedCount,
      skippedCount: skippedDuplicates.length,
      skippedEmails: skippedDuplicates.slice(0, 20), // summary preview
    };
  } catch (error: any) {
    console.error("Error batch importing leads:", error);
    return { success: false, error: error.message };
  }
}
