import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    short: { type: String },
    full: [
      {
        type: {
          type: String,
          enum: ["p", "h2", "img", "video", "link"],
          required: true,
        },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
    tech: [String], // e.g., ['React', 'Bun', 'MongoDB']
    github: { type: String },
    demo: { type: String },
    tags: [String],
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", ProjectSchema);
