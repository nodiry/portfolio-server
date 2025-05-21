import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String },
  fullDescription: [
    {
      type: { type: String, enum: ['p','h2', 'img', 'video', 'link'], required: true },
      data: { type: mongoose.Schema.Types.Mixed, required: true }
    }
  ],
  techStack: [String], // e.g., ['React', 'Bun', 'MongoDB']
  githubLink: { type: String },
  liveDemo: { type: String },
  tags: [String],
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.model('Project', ProjectSchema);
