import { Schema, model, models, Document } from "mongoose";

export interface IEmailTemplate extends Document {
  _id: any;
  name: string;
  subject: string;
  bodyHtml: string;
  category: "quotation" | "invoice" | "reminder" | "lead_followup" | "marketing" | "system";
  variables: string[]; // e.g. ["name", "company", "projectName", "link"]
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    bodyHtml: { type: String, required: true },
    category: {
      type: String,
      enum: ["quotation", "invoice", "reminder", "lead_followup", "marketing", "system"],
      default: "lead_followup",
      index: true,
    },
    variables: { type: [String], default: [] },
  },
  { timestamps: true },
);

const EmailTemplate = models?.EmailTemplate || model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
export default EmailTemplate;
