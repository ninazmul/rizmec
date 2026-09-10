import { Schema, model, models, Document } from "mongoose";

export interface IQuotationLineItem {
  item: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number; // in percentage or fixed
  total: number;
}

export interface IPaymentMilestone {
  milestone: string;   // e.g. "Advance", "Midpoint", "Delivery"
  percent: number;     // e.g. 30, 40, 30
  trigger: string;     // e.g. "On project start", "At 50% completion", "On final delivery"
  dueDate?: Date;
}

export interface IQuotation extends Document {
  _id: any;
  quoteNumber: string;
  secureToken: string; // Unpredictable token for public URL
  clientId?: Schema.Types.ObjectId;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone?: string;
  projectName: string;
  description: string;
  lineItems: IQuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxRate: number; // e.g. 5 for 5%
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  paymentSchedule: IPaymentMilestone[];
  validUntil: Date;
  notes?: string;
  termsConditions?: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  // Electronic Signature / Acceptance Details
  signedAt?: Date;
  signedByName?: string;
  signedByEmail?: string;
  signatureData?: string; // base64 / vector signature data
  signerIp?: string;
  signerUserAgent?: string;
  acceptedSnapshot?: any; // Immutable snapshot of quotation data when signed
  createdAt: Date;
  updatedAt: Date;
}

const QuotationLineItemSchema = new Schema<IQuotationLineItem>(
  {
    item: { type: String, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const QuotationSchema = new Schema<IQuotation>(
  {
    quoteNumber: { type: String, required: true, unique: true, index: true },
    secureToken: { type: String, required: true, unique: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    clientName: { type: String, required: true, trim: true },
    clientCompany: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    clientPhone: { type: String, default: "" },
    projectName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    lineItems: { type: [QuotationLineItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "USD" },
    paymentTerms: { type: String, default: "50% upfront, 50% upon milestone completion" },
    paymentSchedule: {
      type: [
        new Schema(
          {
            milestone: { type: String, required: true },
            percent: { type: Number, required: true },
            trigger: { type: String, default: "" },
            dueDate: { type: Date },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    validUntil: { type: Date, required: true },
    notes: { type: String, default: "" },
    termsConditions: { type: String, default: "Standard RIZMEC Engineering Services Agreement applies." },
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "accepted", "rejected", "expired"],
      default: "draft",
      index: true,
    },
    signedAt: { type: Date },
    signedByName: { type: String },
    signedByEmail: { type: String },
    signatureData: { type: String },
    signerIp: { type: String },
    signerUserAgent: { type: String },
    acceptedSnapshot: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

const Quotation = models?.Quotation || model<IQuotation>("Quotation", QuotationSchema);
export default Quotation;
