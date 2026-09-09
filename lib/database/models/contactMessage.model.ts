import { Schema, model, models, Document } from "mongoose";

export interface IContactMessage extends Document {
  _id: any;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    service: { type: String, default: "General Consultation" },
    budget: { type: String, default: "Not specified" },
    timeline: { type: String, default: "Flexible" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

const ContactMessage =
  models?.ContactMessage || model<IContactMessage>("ContactMessage", ContactMessageSchema);
export default ContactMessage;
