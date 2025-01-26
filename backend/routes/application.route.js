import express from "express";
const router = express.Router();
import {
  applyjobs,
  getapplicants,
  getappliedjobs,
  updatestatus,
} from "../controller/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

router.route("/apply/:id").get(isAuthenticated, applyjobs);
router.route("/get").get(isAuthenticated, getappliedjobs);
router.route("/:id/applicants").get(isAuthenticated, getapplicants);
router.route("/status/:id/update").post(isAuthenticated, updatestatus);

export default router;
