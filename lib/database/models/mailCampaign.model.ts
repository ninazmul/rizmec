import { Schema, model, models, Document } from "mongoose";

export interface IMailCampaign extends Document {
  _id: any;
  name: string;
  subject: string;
  previewText?: string;
  contentHtml: string;
  targetStatus: string[]; // e.g. ["new", "qualified", "proposal"]
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: "draft" | "scheduled" | "sending" | "completed";
  scheduledAt?: Date;
  sentAt?: Date;
  unsubscribeList: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MailCampaignSchema = new Schema<IMailCampaign>(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    previewText: { type: String, default: "" },
    contentHtml: { type: String, required: true },
    targetStatus: { type: [String], default: ["qualified", "proposal"] },
    recipientCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "completed"],
      default: "draft",
      index: true,
    },
    scheduledAt: { type: Date },
    sentAt: { type: Date },
    unsubscribeList: { type: [String], default: [] },
  },
  { timestamps: true },
);

const MailCampaign = models?.MailCampaign || model<IMailCampaign>("MailCampaign", MailCampaignSchema);
export default MailCampaign;
