"use server";

import { connectToDatabase } from "@/lib/database";
import Client, { IClient } from "@/lib/database/models/client.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getClients(params?: {
  status?: string;
  search?: string;
  limit?: number;
}) {
  try {
    await requirePermission("clients", "read");
    await connectToDatabase();

    const query: any = {};
    if (params?.status && params.status !== "all") query.status = params.status;
    if (params?.search) {
      const regex = new RegExp(params.search, "i");
      query.$or = [{ company: regex }, { contactPerson: regex }, { email: regex }];
    }

    let q = Client.find(query).sort({ company: 1 });
    if (params?.limit) q = q.limit(params.limit);

    const clients = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(clients)) };
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createClient(data: Partial<IClient>) {
  try {
    await requirePermission("clients", "create");
    await connectToDatabase();

    const newClient = await Client.create(data);
    revalidatePath("/dashboard/clients");
    return { success: true, data: JSON.parse(JSON.stringify(newClient)) };
  } catch (error: any) {
    console.error("Error creating client:", error);
    return { success: false, error: error.message };
  }
}

export async function updateClient(id: string, data: Partial<IClient>) {
  try {
    await requirePermission("clients", "update");
    await connectToDatabase();

    const updated = await Client.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    revalidatePath("/dashboard/clients");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating client:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteClient(id: string) {
  try {
    await requirePermission("clients", "delete");
    await connectToDatabase();

    await Client.findByIdAndDelete(id);
    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting client:", error);
    return { success: false, error: error.message };
  }
}
