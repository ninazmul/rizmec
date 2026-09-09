import { Schema, model, models, Document } from "mongoose";

export interface IAuditLog extends Document {
  _id: any;
  actorId: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: String, required: true },
    actorEmail: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const AuditLog = models?.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
export default AuditLog;
