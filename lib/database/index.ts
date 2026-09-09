import mongoose, { ConnectOptions } from "mongoose";
import "./models/user.model";
import "./models/teamMember.model";
import "./models/service.model";
import "./models/product.model";
import "./models/project.model";
import "./models/client.model";
import "./models/lead.model";
import "./models/quotation.model";
import "./models/invoice.model";
import "./models/payment.model";
import "./models/paymentReminder.model";
import "./models/mailCampaign.model";
import "./models/emailTemplate.model";
import "./models/testimonial.model";
import "./models/companySetting.model";
import "./models/auditLog.model";
import "./models/notification.model";
import "./models/contactMessage.model";

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("returnDocument", "after");
mongoose.set("strictQuery", false);

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongoose || {
  conn: null,
  promise: null,
};

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing from environment");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "rizmec",
      bufferCommands: false,
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
    } as ConnectOptions);

  try {
    cached.conn = await cached.promise;
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ MongoDB connected to rizmec");
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    cached.conn = null;
    cached.promise = null;
    throw err;
  }

  global.mongoose = cached;

  return cached.conn;
};
