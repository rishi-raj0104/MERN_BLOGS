import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateCSRFToken, setCSRFTokenForUser } from "../middleware/csrf.js";

// JWT Expiration time (7 days)
const JWT_EXPIRES_IN = "7d";

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
      return next(handleError(400, "All fields are required."));
    }
    
    // Check if user already exists
    const checkuser = await User.findOne({ email: email.toLowerCase().trim() });
    if (checkuser) {
      return next(handleError(409, "User already registered."));
    }
    
    // Hash password with salt rounds
    const hashedPassword = bcryptjs.hashSync(password, 12);
    
    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const Login = async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return next(handleError(400, "Request body is missing. Please ensure Content-Type is set to application/json."));
    }
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return next(handleError(400, "Email and password are required."));
    }
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return next(handleError(401, "Invalid login credentials."));
    }
    
    const hashedPassword = user.password;
    const comparePassword = await bcryptjs.compare(password, hashedPassword);
    if (!comparePassword) {
      return next(handleError(401, "Invalid login credentials."));
    }
    
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Generate and set CSRF token for authenticated user
    const csrfToken = generateCSRFToken();
    setCSRFTokenForUser(user._id.toString(), csrfToken);
    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.setHeader("X-CSRF-Token", csrfToken);

    const newUser = user.toObject({ getters: true });
    delete newUser.password;
    
    res.status(200).json({
      success: true,
      user: newUser,
      csrfToken: csrfToken,
      message: "Login successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Input validation
    if (!name || !email) {
      return next(handleError(400, "Name and email are required."));
    }
    
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Create new user with random password
      const password = Math.random().toString(36).slice(-12);
      const hashedPassword = bcryptjs.hashSync(password, 12);
      
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        avatar,
      });

      user = await newUser.save();
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Generate and set CSRF token for authenticated user
    const csrfToken = generateCSRFToken();
    setCSRFTokenForUser(user._id.toString(), csrfToken);
    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.setHeader("X-CSRF-Token", csrfToken);

    const newUser = user.toObject({ getters: true });
    delete newUser.password;
    
    res.status(200).json({
      success: true,
      user: newUser,
      csrfToken: csrfToken,
      message: "Login successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Verify token endpoint
export const VerifyToken = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(handleError(401, "Not authenticated."));
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
