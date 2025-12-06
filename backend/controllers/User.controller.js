import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import bcryptjs from "bcryptjs";

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return next(handleError(400, "User ID is required."));
    }

    const user = await User.findById(userid)
      .select("-password")
      .lean()
      .exec();

    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      message: "User data found.",
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;

    // Verify user can only update their own profile (unless admin)
    if (req.user._id !== userid && req.user.role !== "admin") {
      return next(handleError(403, "You can only update your own profile."));
    }

    const user = await User.findById(userid);
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    // Update fields
    if (data.name) user.name = data.name.trim();
    if (data.email) user.email = data.email.toLowerCase().trim();
    if (data.bio !== undefined) user.bio = data.bio.trim();

    // Update password if provided
    if (data.password && data.password.length >= 8) {
      const hashedPassword = bcryptjs.hashSync(data.password, 12);
      user.password = hashedPassword;
    }

    // Update avatar if file provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-blog",
        resource_type: "auto",
      });
      user.avatar = uploadResult.secure_url;
    }

    await user.save();

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: newUser,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      user: users,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Bookmark functionality
export const toggleBookmark = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const userId = req.user._id;

    // Verify blog exists
    const blog = await Blog.findById(blogid);
    if (!blog) {
      return next(handleError(404, "Blog not found."));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    const bookmarkIndex = user.bookmarks.indexOf(blogid);
    let isBookmarked;

    if (bookmarkIndex === -1) {
      // Add bookmark
      user.bookmarks.push(blogid);
      isBookmarked = true;
    } else {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1);
      isBookmarked = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isBookmarked,
      message: isBookmarked ? "Blog bookmarked." : "Bookmark removed.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "bookmarks",
        populate: [
          { path: "author", select: "name avatar role" },
          { path: "category", select: "name slug" },
        ],
      })
      .lean()
      .exec();

    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      bookmarks: user.bookmarks || [],
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const checkBookmark = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId).select("bookmarks").lean().exec();
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    const isBookmarked = user.bookmarks.some(
      (id) => id.toString() === blogid
    );

    res.status(200).json({
      success: true,
      isBookmarked,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
