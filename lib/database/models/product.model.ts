import { Schema, model, models, Document } from "mongoose";

export interface IPricingTier {
  name: string;
  price: string;
  period: string; // e.g. "per month", "annual", "custom"
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface IProductScreenshot {
  url: string;
  caption: string;
}

export interface IProduct extends Document {
  _id: any;
  title: string;
  slug: string;
  tagline: string;
  category: "SaaS Platform" | "AI Engine" | "Developer Tool" | "Mobile App" | "Enterprise Cloud";
  summary: string;
  description: string;
  features: string[];
  techStack: string[];
  screenshots: IProductScreenshot[];
  videoUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  githubUrl?: string;
  pricingTiers: IPricingTier[];
  status: "active" | "beta" | "coming_soon";
  order: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingTierSchema = new Schema<IPricingTier>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String, default: "per month" },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
  },
  { _id: false },
);

const ProductScreenshotSchema = new Schema<IProductScreenshot>(
  {
    url: { type: String, required: true },
    caption: { type: String, default: "" },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    tagline: { type: String, default: "" },
    category: {
      type: String,
      enum: ["SaaS Platform", "AI Engine", "Developer Tool", "Mobile App", "Enterprise Cloud"],
      default: "SaaS Platform",
      index: true,
    },
    summary: { type: String, required: true },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    screenshots: { type: [ProductScreenshotSchema], default: [] },
    videoUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    documentationUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    pricingTiers: { type: [PricingTierSchema], default: [] },
    status: {
      type: String,
      enum: ["active", "beta", "coming_soon"],
      default: "active",
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const Product = models?.Product || model<IProduct>("Product", ProductSchema);
export default Product;
