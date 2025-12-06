import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(handleError(401, "Authentication required. Please log in."));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return next(handleError(401, "Session expired. Please log in again."));
      }
      if (jwtError.name === "JsonWebTokenError") {
        return next(handleError(401, "Invalid token. Please log in again."));
      }
      throw jwtError;
    }
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
      } catch (jwtError) {
        // Token invalid or expired, but we continue anyway
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    next(handleError(500, error.message));
  }
};
