import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    author: { type: String, default: "Admin" },
    categories: [{ type: String }],
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
    featuredImage: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Post || mongoose.model("Post", PostSchema)
