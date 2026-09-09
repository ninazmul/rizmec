import { Schema, model, models, Document } from "mongoose";

export interface ITestimonial extends Document {
  _id: any;
  clientName: string;
  company: string;
  position: string;
  avatar: string;
  content: string;
  rating: number;
  projectId?: Schema.Types.ObjectId;
  serviceName?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    position: { type: String, default: "" },
    avatar: { type: String, default: "/assets/images/placeholder.webp" },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    serviceName: { type: String, default: "" },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const Testimonial = models?.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;
