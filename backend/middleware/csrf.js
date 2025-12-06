import crypto from "crypto";
import { handleError } from "../helpers/handleError.js";

// Store CSRF tokens in memory (in production, use Redis or database)
const csrfTokens = new Map();

// Generate CSRF token
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Get session identifier
const getSessionId = (req) => {
  // Use user ID if authenticated, otherwise use IP + User-Agent
  if (req.user?._id) {
    return `user_${req.user._id}`;
  }
  return `anon_${req.ip}_${req.headers["user-agent"]?.substring(0, 50) || "unknown"}`;
};

// Set CSRF token for a user (called after authentication)
export const setCSRFTokenForUser = (userId, token) => {
  const sessionId = `user_${userId}`;
  csrfTokens.set(sessionId, token);
};

// Get CSRF token for a user
export const getCSRFTokenForUser = (userId) => {
  const sessionId = `user_${userId}`;
  return csrfTokens.get(sessionId);
};

// Create and store CSRF token
export const createCSRFToken = (req, res, next) => {
  const sessionId = getSessionId(req);
  const token = generateCSRFToken();
  
  // Store token
  csrfTokens.set(sessionId, token);
  
  // Set token in cookie (httpOnly: false so JavaScript can read it)
  res.cookie("csrf_token", token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  // Also send in response header for easier access
  res.setHeader("X-CSRF-Token", token);
  
  next();
};

// Verify CSRF token
export const verifyCSRF = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests (safe methods)
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }
  
  const sessionId = getSessionId(req);
  const storedToken = csrfTokens.get(sessionId);
  
  // Get token from header (preferred) or body
  // Only access req.body if it exists (body parser may not have run yet)
  const token = req.headers["x-csrf-token"] || (req.body && req.body.csrfToken) || req.query?.csrfToken;
  
  if (!token) {
    return next(handleError(403, "CSRF token missing. Please refresh the page."));
  }
  
  if (!storedToken) {
    return next(handleError(403, "CSRF token not found. Please refresh the page."));
  }
  if (token !== storedToken) {
    return next(handleError(403, "Invalid CSRF token. Please refresh the page."));
  }
  
  // Token is valid, continue
  next();
};

// Get CSRF token endpoint (for frontend to fetch)
export const getCSRFToken = (req, res, next) => {
  const sessionId = getSessionId(req);
  let token = csrfTokens.get(sessionId);
  
  if (!token) {
    // Generate new token if doesn't exist
    token = generateCSRFToken();
    csrfTokens.set(sessionId, token);
    
    res.cookie("csrf_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  
  res.setHeader("X-CSRF-Token", token);
  
  res.status(200).json({
    success: true,
    csrfToken: token,
  });
};

// Clean up old tokens (call periodically)
export const cleanupCSRFTokens = () => {
  // In production, implement TTL-based cleanup
  // For now, tokens persist until server restart
};
