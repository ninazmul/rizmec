import { Schema, model, models, Document } from "mongoose";

export interface ICompanySetting extends Document {
  _id: any;
  companyName: string;
  tagline: string;
  positioning: string;
  philosophy: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  globalLocations: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  defaultCurrency: string;
  quotationTerms: string;
  invoiceTerms: string;
  paymentInstructions?: string;
  logoWhiteUrl?: string;
  logoBlackUrl?: string;
  seo: {
    siteTitle: string;
    siteMetaDescription: string;
    keywords: string[];
    canonicalUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySettingSchema = new Schema<ICompanySetting>(
  {
    companyName: { type: String, default: "RIZMEC" },
    tagline: { type: String, default: "From Algorithms to Engineered Intelligence" },
    positioning: {
      type: String,
      default: "Engineering digital infrastructure that helps businesses operate, automate, and scale.",
    },
    philosophy: {
      type: String,
      default: "From Algorithms to Engineered Intelligence.",
    },
    contactEmail: { type: String, default: "hello@rizmec.com" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "Gazipur 1750, Dhaka, Bangladesh" },
    globalLocations: {
      type: [String],
      default: ["Dhaka, Bangladesh"],
    },
    socialLinks: {
      github: { type: String, default: "https://github.com/ninazmul" },
      linkedin: { type: String, default: "https://linkedin.com/company/rizmec" },
      twitter: { type: String, default: "https://x.com/rizmec_tech" },
      youtube: { type: String, default: "" },
    },
    defaultCurrency: { type: String, default: "USD" },
    quotationTerms: {
      type: String,
      default:
        "All engineering deliverables are subject to the Master Services Agreement. Estimates are valid for 30 days from generation date.",
    },
    invoiceTerms: {
      type: String,
      default: "Net 15 days.",
    },
    paymentInstructions: {
      type: String,
      default:
        "Bank Wire / International Transfer: Inquire with billing at hello@rizmec.com for verified account details.",
    },
    logoWhiteUrl: { type: String, default: "" },
    logoBlackUrl: { type: String, default: "" },
    seo: {
      siteTitle: { type: String, default: "RIZMEC — Intelligence. Engineered." },
      siteMetaDescription: {
        type: String,
        default:
          "RIZMEC is a premier global technology engineering company specializing in high-performance software, AI systems, and mission-critical cloud infrastructure.",
      },
      keywords: {
        type: [String],
        default: [
          "RIZMEC",
          "Software Engineering",
          "AI Systems",
          "Cloud Infrastructure",
          "Enterprise Software",
        ],
      },
      canonicalUrl: { type: String, default: "https://rizmec.com" },
    },
  },
  { timestamps: true },
);

const CompanySetting =
  models?.CompanySetting || model<ICompanySetting>("CompanySetting", CompanySettingSchema);
export default CompanySetting;
