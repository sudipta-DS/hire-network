import express from "express";
import {
  ChangeJobApplicationsStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyControllers.js";
import upload from "../config/multer.js";
import protectCompany from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company", protectCompany, getCompanyData);

router.post("/post-job", protectCompany, postJob);

router.get("/applicants", protectCompany, getCompanyJobApplicants);

router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

router.post("/change-status", protectCompany, ChangeJobApplicationsStatus);

router.post("/change-visibility", protectCompany, changeVisibility);

export default router;
