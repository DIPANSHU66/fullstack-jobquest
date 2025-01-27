import express from "express";

const router = express.Router();
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controller/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleupload } from "../middlewares/multer.js";
router.route("/register").post(singleupload, register);
router.route("/login").post(login);
router
  .route("/profile/update")
  .post(singleupload, isAuthenticated, updateProfile);
router.route("/delete").delete(isAuthenticated, logout);
export default router;
