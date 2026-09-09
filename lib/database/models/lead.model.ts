import { Schema, model, models, Document } from "mongoose";

export interface ILeadTimelineItem {
  date: Date;
  note: string;
  author: string;
}

export interface ILead extends Document {
  _id: any;
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  source: "website" | "referral" | "linkedin" | "import" | "outbound" | "other";
  serviceInterest: string;
  budget: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
  assignedTo?: Schema.Types.ObjectId; // Ref to User or TeamMember
  tags: string[];
  timeline: ILeadTimelineItem[];
  importedBatchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadTimelineSchema = new Schema<ILeadTimelineItem>(
  {
    date: { type: Date, default: Date.now },
    note: { type: String, required: true },
    author: { type: String, default: "System" },
  },
  { _id: false },
);

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },
    source: {
      type: String,
      enum: ["website", "referral", "linkedin", "import", "outbound", "other"],
      default: "website",
      index: true,
    },
    serviceInterest: { type: String, default: "General Inquiry" },
    budget: { type: String, default: "Not specified" },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"],
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    notes: { type: String, default: "" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String], default: [], index: true },
    timeline: { type: [LeadTimelineSchema], default: [] },
    importedBatchId: { type: String, default: null, index: true },
  },
  { timestamps: true },
);

const Lead = models?.Lead || model<ILead>("Lead", LeadSchema);
export default Lead;
