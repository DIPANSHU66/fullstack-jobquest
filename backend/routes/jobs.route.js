import express from "express";

import {
  getadminjob,
  getalljobs,
  getjobbyid,
  postjob,
} from "../controller/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/post").post(isAuthenticated, postjob);
router.route("/get").get(isAuthenticated, getalljobs);
router.route("/getadminjobs").get(isAuthenticated, getadminjob);
router.route("/get/:id").get(isAuthenticated, getjobbyid);

export default router;
