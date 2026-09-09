import { Schema, model, models, Document } from "mongoose";

export interface IClient extends Document {
  _id: any;
  company: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country?: string;
  website?: string;
  notes?: string;
  status: "lead" | "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    company: { type: String, required: true, trim: true, index: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },
    website: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["lead", "active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

const Client = models?.Client || model<IClient>("Client", ClientSchema);
export default Client;
