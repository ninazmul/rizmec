import { Schema, model, models, Document } from "mongoose";

export interface INotification extends Document {
  _id: any;
  userId?: string; // If empty, visible to all admins
  title: string;
  message: string;
  type: "lead" | "quote" | "invoice" | "system";
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, default: "", index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["lead", "quote", "invoice", "system"],
      default: "system",
    },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Notification = models?.Notification || model<INotification>("Notification", NotificationSchema);
export default Notification;
