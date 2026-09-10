import { Schema, model, models, Document } from "mongoose";

export interface IInvoiceLineItem {
  item: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  _id: any;
  invoiceNumber: string;
  secureToken: string;
  quotationId?: Schema.Types.ObjectId;
  clientId?: Schema.Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectName: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  lineItems: IInvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: "draft" | "sent" | "viewed" | "partially_paid" | "paid" | "overdue" | "cancelled";
  notes?: string;
  paymentInstructions?: string;
  milestoneLabel?: string;          // e.g. "Advance – 30%"
  paymentSchedule?: Array<{         // full schedule copied from quotation
    milestone: string;
    percent: number;
    trigger: string;
    dueDate?: Date;
  }>;
  remindersCount: number;
  lastReminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceLineItemSchema = new Schema<IInvoiceLineItem>(
  {
    item: { type: String, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    secureToken: { type: String, required: true, unique: true, index: true },
    quotationId: { type: Schema.Types.ObjectId, ref: "Quotation" },
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    clientCompany: { type: String, default: "" },
    projectName: { type: String, required: true, trim: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true, index: true },
    currency: { type: String, default: "USD" },
    lineItems: { type: [InvoiceLineItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, default: 0 },
    amountDue: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "partially_paid", "paid", "overdue", "cancelled"],
      default: "draft",
      index: true,
    },
    notes: { type: String, default: "" },
    paymentInstructions: {
      type: String,
      default: "Bank Wire Transfer: Account Name: RIZMEC Engineering Inc. | SWIFT: RIZMUS33 | IBAN: US34RIZM000192837465",
    },
    milestoneLabel: { type: String, default: "" },
    paymentSchedule: {
      type: [
        new Schema(
          {
            milestone: { type: String },
            percent: { type: Number },
            trigger: { type: String },
            dueDate: { type: Date },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    remindersCount: { type: Number, default: 0 },
    lastReminderSentAt: { type: Date },
  },
  { timestamps: true },
);

const Invoice = models?.Invoice || model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;
