import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import { encode } from "entities";
import Category from "../models/category.model.js";

// Helper function to calculate reading time
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime < 1 ? 1 : readingTime;
};

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);

    // Validation
    if (!data.title || !data.category || !data.blogContent) {
      return next(handleError(400, "Title, category, and content are required."));
    }

    let featuredImage = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-blog",
        resource_type: "auto",
      });
      featuredImage = uploadResult.secure_url;
    } else {
      return next(handleError(400, "Featured image is required."));
    }

    const readingTime = calculateReadingTime(data.blogContent);

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title.trim(),
      slug: `${data.slug}-${Math.round(Math.random() * 100000)}`,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
      readingTime,
      tags: data.tags || [],
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog added successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;

    if (!blogid) {
      return next(handleError(400, "Blog ID is required."));
    }

    const blog = await Blog.findById(blogid).populate("category", "name");
    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const data = JSON.parse(req.body.data);

    const blog = await Blog.findById(blogid);
    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    blog.category = data.category;
    blog.title = data.title.trim();
    blog.slug = data.slug;
    blog.blogContent = encode(data.blogContent);
    blog.readingTime = calculateReadingTime(data.blogContent);
    blog.tags = data.tags || blog.tags;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-blog",
        resource_type: "auto",
      });
      blog.featuredImage = uploadResult.secure_url;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;

    const blog = await Blog.findByIdAndDelete(blogid);
    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    const user = req.user;
    let blog;

    if (user.role === "admin") {
      blog = await Blog.find()
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } else {
      blog = await Blog.find({ author: user._id })
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return next(handleError(400, "Blog slug is required."));
    }

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name avatar role bio")
      .populate("category", "name slug")
      .lean()
      .exec();

    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getRelatedBlog = async (req, res, next) => {
  try {
    const { category, blog } = req.params;

    if (!category || !blog) {
      return next(handleError(400, "Category and blog slug are required."));
    }

    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) {
      return next(handleError(404, "Category not found."));
    }

    const categoryId = categoryData._id;
    const relatedBlog = await Blog.find({
      category: categoryId,
      slug: { $ne: blog },
    })
      .select("title slug featuredImage")
      .limit(5)
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      relatedBlog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    if (!category) {
      return next(handleError(400, "Category slug is required."));
    }

    const categoryData = await Category.findOne({ slug: category });
    if (!categoryData) {
      return next(handleError(404, "Category not found."));
    }

    const categoryId = categoryData._id;
    const blog = await Blog.find({ category: categoryId })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      blog,
      categoryData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        blog: [],
      });
    }

    const searchQuery = q.trim();
    const blog = await Blog.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { tags: { $in: [new RegExp(searchQuery, "i")] } },
      ],
    })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blog, total] = await Promise.all([
      Blog.find()
        .populate("author", "name avatar role")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .exec(),
      Blog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      blog,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Get trending blogs (most viewed)
export const getTrendingBlogs = async (req, res, next) => {
  try {
    const blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ views: -1, createdAt: -1 })
      .limit(5)
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
