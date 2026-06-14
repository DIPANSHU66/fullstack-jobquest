import express from "express";

import {
  applyJobs,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  withdrawApplication,
} from "../controller/application.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


// ======================================
// Application Routes
// ======================================


// Apply For Job
router.post(
  "/apply/:jobId",
  isAuthenticated,
  applyJobs
);


// Get Logged In User Applications
router.get(
  "/",
  isAuthenticated,
  getAppliedJobs
);


// Get Applicants For Specific Job
router.get(
  "/job/:jobId",
  isAuthenticated,
  getApplicants
);


// Update Application Status
router.patch(
  "/:applicationId/status",
  isAuthenticated,
  updateStatus
);


// Withdraw/Cancel Application
router.delete(
  "/withdraw/:applicationId",
  isAuthenticated,
  withdrawApplication
);


export default router;