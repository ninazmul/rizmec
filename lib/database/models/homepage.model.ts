import { Document, Schema, Types, model, models } from "mongoose";

export interface IHomepageSection {
  sectionType:
    | "hero"
    | "missionCards"
    | "aboutPreview"
    | "featuredProjects"
    | "galleryPreview"
    | "statistics"
    | "volunteerCareerCta"
    | "donationCta"
    | "contactCta";
  title?: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface IHomepage extends Document {
  _id: Types.ObjectId;
  sections: IHomepageSection[];
  aboutPreview?: {
    title?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  donationCta?: {
    title?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    externalUrl?: string;
    bankDetails?: string;
    bkashNumber?: string;
    nagadNumber?: string;
    rocketNumber?: string;
    qrCodeImage?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const HomepageSectionSchema = new Schema({
  sectionType: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  config: { type: Schema.Types.Mixed, default: {} },
});

const HomepageSchema = new Schema(
  {
    sections: { type: [HomepageSectionSchema], default: [] },
    aboutPreview: {
      title: { type: String, default: "About Our Organization" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
      buttonText: { type: String, default: "Learn More" },
      buttonUrl: { type: String, default: "/about" },
    },
    donationCta: {
      title: { type: String, default: "Support Our Cause" },
      description: { type: String, default: "Your contribution changes lives." },
      image: { type: String, default: "" },
      buttonText: { type: String, default: "Donate Now" },
      externalUrl: { type: String, default: "" },
      bankDetails: { type: String, default: "" },
      bkashNumber: { type: String, default: "" },
      nagadNumber: { type: String, default: "" },
      rocketNumber: { type: String, default: "" },
      qrCodeImage: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Homepage = models.Homepage || model("Homepage", HomepageSchema);

export default Homepage;
