import { Document, Schema, Types, model, models } from "mongoose";

export interface IPageSection {
  id: string;
  type:
    | "founders"
    | "imageBanner"
    | "contentCards"
    | "ctaBox"
    | "statCards"
    | "accordion"
    | "richText";
  title?: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  founders?: {
    name: string;
    title: string;
    image?: string;
    bio?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  }[];
  images?: {
    url: string;
    caption?: string;
    alt?: string;
    link?: string;
  }[];
  imageLayout?: "banner" | "grid" | "sideBySide";
  cards?: {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    icon?: string;
    linkUrl?: string;
    linkText?: string;
  }[];
  cardColumns?: number;
  cta?: {
    title?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    variant?: "primary" | "dark" | "outline";
  };
  stats?: {
    value: string;
    label: string;
    description?: string;
  }[];
  accordion?: {
    question: string;
    answer: string;
  }[];
  richText?: string;
}

export interface IPage extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  description?: string;
  status: "draft" | "published";
  priority: number;
  showInNav?: boolean;
  parentPage?: Types.ObjectId | null;
  sections?: IPageSection[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    priority: { type: Number, default: 0 },
    showInNav: { type: Boolean, default: false },
    parentPage: {
      type: Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },
    sections: { type: [Schema.Types.Mixed], default: [] },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

if (models.Page) {
  delete (models as any).Page;
}
const Page = model("Page", PageSchema);

export default Page;
