import express from "express";

import {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompanyInformation,
} from "../controller/company.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();


// ======================================
// Company Routes
// ======================================

// Register new company
router.post(
  "/register",
  isAuthenticated,
  registerCompany
);


// Get all recruiter companies
router.get(
  "/",
  isAuthenticated,
  getCompanies
);


// Get single company by ID
router.get(
  "/:id",
  isAuthenticated,
  getCompanyById
);


// Update company
router.put(
  "/update/:id",
  isAuthenticated,
  singleUpload,
  updateCompanyInformation
);

router.put(
  "/:id",
  isAuthenticated,
  singleUpload,
  updateCompanyInformation
);


export default router;