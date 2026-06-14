import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  matchJobs,
} from "../controller/job.controller.js";

const router = express.Router();


// ======================================
// Job Routes
// ======================================


// Create Job
router.post(
  "/post",
  isAuthenticated,
  postJob
);

router.post(
  "/",
  isAuthenticated,
  postJob
);


// Get All Jobs
router.get(
  "/",
  isAuthenticated,
  getAllJobs
);


// Get Recruiter/Admin Jobs
router.get(
  "/admin",
  isAuthenticated,
  getAdminJobs
);


// Match Jobs For Candidate
router.get(
  "/match",
  isAuthenticated,
  matchJobs
);


// Get Single Job
router.get(
  "/:id",
  isAuthenticated,
  getJobById
);


export default router;