import { handleError } from "../helpers/handleError.js";
import BlogLike from "../models/bloglike.model.js";
export const doLike = async (req, res, next) => {
  try {
    const { user, blogid } = req.body;
    let like;
    like = await BlogLike.findOne({ user, blogid });
    if (!like) {
      const saveLike = new BlogLike({
        user,
        blogid,
      });
      like = await saveLike.save();
    } else {
      await BlogLike.findByIdAndDelete(like._id);
    }

    const likecount = await BlogLike.countDocuments({ blogid });

    res.status(200).json({
      success: true,
      likecount,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
export const likeCount = async (req, res, next) => {
  try {
    const { blogid, userid } = req.params;
    const likecount = await BlogLike.countDocuments({ blogid });

    let isUserliked = false;
    // Only check if user has liked if userid is provided and not empty
    if (userid && userid.trim() !== '') {
      const getuserlike = await BlogLike.countDocuments({
        blogid,
        user: userid,
      });
      if (getuserlike > 0) {
        isUserliked = true;
      }
    }

    res.status(200).json({
      success: true,
      likecount,
      isUserliked,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
