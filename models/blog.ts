import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL-friendly title
    description: { type: String },
    content: [
      {
        type: {
          type: String,
          enum: ["h2", "p", "img", "video", "code", "quote"],
          required: true,
        },
        data: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible, based on type
      },
    ],
    tags: [String],
    thumbnail: { type: String }, // cover image URL
    author: { type: String, default: "Me" },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", BlogSchema);
