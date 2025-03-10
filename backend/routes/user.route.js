import express from "express";

const router = express.Router();
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controller/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/logout").delete(isAuthenticated,logout);
export default router;
