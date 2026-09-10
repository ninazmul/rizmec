import { Schema, model, models, Document } from "mongoose";

export interface ISkill {
  name: string;
  level: number; // 0-100
  category: string; // e.g. "Architecture", "Languages", "Cloud", "AI"
}

export interface IExperience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface ICustomProject {
  title: string;
  description: string;
  role?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  metrics?: string[];
  featured?: boolean;
}

export interface IThemeConfig {
  preset?: "obsidian" | "cyber" | "minimal" | "emerald" | "sapphire";
  effect3D?: "tilt" | "particles" | "mesh" | "minimal";
  accentColor?: string;
}

export interface IContactInfo {
  personalEmail?: string;
  publicEmail?: boolean;
  phone?: string;
  calendlyUrl?: string;
  telegram?: string;
  whatsapp?: string;
  discord?: string;
}

export interface IAvailability {
  status?: "open_to_work" | "contract" | "advisory" | "employed";
  label?: string;
}

export interface ISeoConfig {
  customTitle?: string;
  customDescription?: string;
}

export interface ITeamMember extends Document {
  _id: any;
  userId?: Schema.Types.ObjectId;
  name: string;
  slug: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  role: "leadership" | "engineering" | "ai_systems" | "architecture" | "product";
  email: string;
  phone?: string;
  location?: string;
  skills: ISkill[];
  technologies: string[];
  experience: IExperience[];
  education: IEducation[];
  certifications: ICertification[];
  customProjects?: ICustomProject[];
  themeConfig?: IThemeConfig;
  contactInfo?: IContactInfo;
  availability?: IAvailability;
  seo?: ISeoConfig;
  achievements: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  order: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    level: { type: Number, default: 90 },
    category: { type: String, default: "Core" },
  },
  { _id: false },
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const EducationSchema = new Schema<IEducation>(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true },
  },
  { _id: false },
);

const CertificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    year: { type: String, required: true },
    credentialUrl: { type: String, default: "" },
  },
  { _id: false },
);

const CustomProjectSchema = new Schema<ICustomProject>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    role: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    metrics: { type: [String], default: [] },
    featured: { type: Boolean, default: true },
  },
  { _id: false },
);

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "/assets/images/placeholder.webp" },
    coverImage: { type: String, default: "" },
    role: {
      type: String,
      enum: ["leadership", "engineering", "ai_systems", "architecture", "product"],
      default: "engineering",
      index: true,
    },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: { type: [SkillSchema], default: [] },
    technologies: { type: [String], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    customProjects: { type: [CustomProjectSchema], default: [] },
    themeConfig: {
      preset: { type: String, default: "obsidian" },
      effect3D: { type: String, default: "tilt" },
      accentColor: { type: String, default: "" },
    },
    contactInfo: {
      personalEmail: { type: String, default: "" },
      publicEmail: { type: Boolean, default: true },
      phone: { type: String, default: "" },
      calendlyUrl: { type: String, default: "" },
      telegram: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      discord: { type: String, default: "" },
    },
    availability: {
      status: { type: String, default: "open_to_work" },
      label: { type: String, default: "Open for new opportunities & consulting" },
    },
    seo: {
      customTitle: { type: String, default: "" },
      customDescription: { type: String, default: "" },
    },
    achievements: { type: [String], default: [] },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const TeamMember = models?.TeamMember || model<ITeamMember>("TeamMember", TeamMemberSchema);
export default TeamMember;
