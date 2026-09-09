import { Schema, model, models, Document } from "mongoose";

export interface IPaymentReminder extends Document {
  _id: any;
  invoiceId: Schema.Types.ObjectId;
  clientEmail: string;
  reminderType: "manual" | "upcoming" | "overdue";
  sentAt: Date;
  status: "sent" | "failed";
  errorMessage?: string;
  createdAt: Date;
}

const PaymentReminderSchema = new Schema<IPaymentReminder>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true },
    clientEmail: { type: String, required: true },
    reminderType: {
      type: String,
      enum: ["manual", "upcoming", "overdue"],
      default: "manual",
    },
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

const PaymentReminder = models?.PaymentReminder || model<IPaymentReminder>("PaymentReminder", PaymentReminderSchema);
export default PaymentReminder;
