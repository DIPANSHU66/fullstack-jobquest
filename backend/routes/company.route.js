import express from "express";
import {
  getcompany,
  getcompanybyid,
  registercompany,
  updatecompanyinfomation,
} from "../controller/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(isAuthenticated, registercompany);

router.route("/get").get(isAuthenticated, getcompany);

router.route("/get/:id").get(isAuthenticated, getcompanybyid);

router.route("/update/:id").put(isAuthenticated, singleUpload, updatecompanyinfomation);

export default router;
