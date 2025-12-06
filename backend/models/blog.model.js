import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    blogContent: {
      type: String,
      required: true,
      trim: true,
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => tags.map((tag) => tag.toLowerCase().trim()),
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: "text", tags: "text" });

const Blog = mongoose.model("Blog", blogSchema, "blogs");
export default Blog;
