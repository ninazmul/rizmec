import { Schema, model, models, Document } from "mongoose";

export interface IPayment extends Document {
  _id: any;
  invoiceId: Schema.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  method: "bank_transfer" | "wire" | "stripe" | "credit_card" | "other";
  reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ["bank_transfer", "wire", "stripe", "credit_card", "other"],
      default: "bank_transfer",
    },
    reference: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

const Payment = models?.Payment || model<IPayment>("Payment", PaymentSchema);
export default Payment;
