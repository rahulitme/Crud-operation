import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, maxlength: 300 },
    categories: [{ type: String }],
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: true },
    featuredImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.models.Post || mongoose.model("Post", PostSchema)
