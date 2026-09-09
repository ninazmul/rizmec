import { Schema, model, models, Document } from "mongoose";

export interface IProjectMetric {
  label: string;
  value: string;
  change?: string;
}

export interface IProject extends Document {
  _id: any;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: IProjectMetric[];
  services: string[]; // e.g. ["AI Engineering", "Cloud Infrastructure"]
  technologies: string[]; // e.g. ["Next.js", "Python", "Kubernetes", "PostgreSQL"]
  gallery: string[];
  thumbnail: string;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  completionDate?: string;
  teamMemberIds: Schema.Types.ObjectId[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  featured: boolean;
  published: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMetricSchema = new Schema<IProjectMetric>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    change: { type: String, default: "" },
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    clientName: { type: String, required: true, trim: true },
    industry: { type: String, default: "Enterprise Technology", index: true },
    summary: { type: String, required: true },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: String, default: "" },
    metrics: { type: [ProjectMetricSchema], default: [] },
    services: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    gallery: { type: [String], default: [] },
    thumbnail: { type: String, default: "/assets/images/placeholder.webp" },
    videoUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    completionDate: { type: String, default: "" },
    teamMemberIds: [{ type: Schema.Types.ObjectId, ref: "TeamMember" }],
    testimonial: {
      quote: { type: String, default: "" },
      author: { type: String, default: "" },
      role: { type: String, default: "" },
      avatar: { type: String, default: "" },
    },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

const Project = models?.Project || model<IProject>("Project", ProjectSchema);
export default Project;
