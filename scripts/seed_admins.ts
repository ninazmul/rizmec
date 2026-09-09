import fs from "fs";
import mongoose from "mongoose";

try {
  if (process.loadEnvFile) {
    process.loadEnvFile(".env.local");
  } else {
    const envConfig = fs.readFileSync(".env.local", "utf8");
    envConfig.split("\n").forEach((line) => {
      const [key, ...values] = line.split("=");
      if (key && values.length) {
        process.env[key.trim()] = values.join("=").trim();
      }
    });
  }
} catch (e) {
  // ignore
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "worker"],
      default: "worker",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    permissions: { type: [{ module: String, actions: [String] }], default: [] },
    teamMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" },
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  const superAdmins = [
    { email: "rizmecofficial@gmail.com", name: "RIZMEC Official" },
    { email: "nazmulsaw@gmail.com", name: "N.I. Nazmul" },
  ];

  for (const entry of superAdmins) {
    let user = await User.findOne({ email: entry.email });

    if (!user) {
      user = await User.create({
        clerkId: `temp_${entry.email}`,
        email: entry.email,
        name: entry.name,
        role: "super_admin",
        status: "active",
        permissions: [],
      });
      console.log(`✅ Created super admin: ${entry.email} (ID: ${user._id})`);
    } else {
      user.role = "super_admin";
      user.status = "active";
      user.name = entry.name;
      await user.save();
      console.log(`✅ Updated to super_admin: ${entry.email} (ID: ${user._id})`);
    }
  }

  // Verify
  const admins = await User.find({ role: "super_admin" }).lean();
  console.log(`\n📋 All super admins (${admins.length}):`);
  admins.forEach((a: any) => console.log(`   - ${a.email} | role: ${a.role} | status: ${a.status}`));

  await mongoose.disconnect();
  console.log("\n✅ Done!");
}

main().catch(console.error);
