import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
  toggleBookmark,
  getBookmarks,
  checkBookmark,
} from "../controllers/User.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const UserRoute = express.Router();

// All routes require authentication
UserRoute.use(authenticate);

// User profile routes
UserRoute.get("/get-user/:userid", getUser);
UserRoute.put("/update-user/:userid", upload.single("file"), updateUser);
UserRoute.get("/get-all-user", getAllUser);
UserRoute.delete("/delete/:id", deleteUser);

// Bookmark routes
UserRoute.post("/bookmark/:blogid", toggleBookmark);
UserRoute.get("/bookmarks", getBookmarks);
UserRoute.get("/bookmark/check/:blogid", checkBookmark);

export default UserRoute;
