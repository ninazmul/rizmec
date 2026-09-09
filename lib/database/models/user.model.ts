import { Schema, model, models, Document } from "mongoose";

export interface IUserPermission {
  module: string;
  actions: string[];
}

export interface IUser extends Document {
  _id: any;
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
  role: "super_admin" | "admin" | "moderator" | "worker";
  status: "active" | "suspended";
  permissions: IUserPermission[];
  teamMemberId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserPermissionSchema = new Schema<IUserPermission>(
  {
    module: { type: String, required: true },
    actions: { type: [String], default: ["read"] },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "worker"],
      default: "worker",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },
    permissions: { type: [UserPermissionSchema], default: [] },
    teamMemberId: { type: Schema.Types.ObjectId, ref: "TeamMember" },
  },
  { timestamps: true },
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
