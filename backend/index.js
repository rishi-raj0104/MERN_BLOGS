import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import AuthRoute from "./routes/Auth.route.js";
import UserRoute from "./routes/User.route.js";
import CategoryRoute from "./routes/Category.route.js";
import BlogRoute from "./routes/Blog.route.js";
import CommentRoute from "./routes/Comment.route.js";
import BlogLikeRoute from "./routes/Bloglike.route.js";
import {
  createCSRFToken,
  verifyCSRF,
  getCSRFToken,
} from "./middleware/csrf.js";
import { optionalAuth } from "./middleware/authenticate.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// CORS configuration - MUST be first to handle preflight requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["X-CSRF-Token"],
  })
);

// Security middleware
app.use(cookieParser());

// Body parser middleware - must be before CSRF middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      contentType: req.headers["content-type"],
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
    });
    next();
  });
}
// optional root route so GET / won't show Cannot GET /
app.get("/", (req, res) => {
  res.send("✅ Backend API running.");
});

app.get("/api/csrf-token", optionalAuth, createCSRFToken, getCSRFToken);

app.use(optionalAuth);

app.use(verifyCSRF);

// API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/comment", CommentRoute);
app.use("/api/blog-like", BlogLikeRoute);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "blogs",
  })
  .then(() => {
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
