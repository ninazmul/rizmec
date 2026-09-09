import { Schema, model, models, Document } from "mongoose";

export interface IServiceFeature {
  title: string;
  description: string;
}

export interface IServiceProcess {
  step: string;
  title: string;
  description: string;
}

export interface IService extends Document {
  _id: any;
  title: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string; // Lucide icon name, e.g. "Cpu", "Code", "Server", "Boxes"
  features: IServiceFeature[];
  deliverables: string[];
  process: IServiceProcess[];
  technologies: string[];
  order: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceFeatureSchema = new Schema<IServiceFeature>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const ServiceProcessSchema = new Schema<IServiceProcess>(
  {
    step: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    tagline: { type: String, default: "" },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    iconName: { type: String, default: "Terminal" },
    features: { type: [ServiceFeatureSchema], default: [] },
    deliverables: { type: [String], default: [] },
    process: { type: [ServiceProcessSchema], default: [] },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const Service = models?.Service || model<IService>("Service", ServiceSchema);
export default Service;
