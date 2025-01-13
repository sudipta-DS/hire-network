import jobModel from "../models/job.js";
import jobApplicationModel from "../models/jobApplication.js";
import userModel from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";

// Get user Data
export const getUserData = async (req, res) => {
  const id = req.auth.userId;
  // console.log(req.headers.authorization.split(" ")[1]);
  try {
    const user = await userModel.findById(id);
    if (!user) {
      res.json({ success: false, message: "no user found" });
    } else {
      res.json({ success: true, user });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;
  try {
    const isAlreadyApplied = await jobApplicationModel.find({ jobId, userId });
    if (isAlreadyApplied.length > 0) {
      return res.json({ success: false, message: "Already Applied" });
    }
    const jobData = await jobModel.findById(jobId);
    if (!jobData) {
      res.json({ success: false, message: "Job Not Found" });
    }
    await jobApplicationModel.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully." });
  } catch (error) {
    console.log(error);
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const applications = await jobApplicationModel
      .find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!applications) {
      res.json({ success: false, message: "No Jobs Found." });
    } else {
      res.json({ success: true, applications });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file.path;

    const userData = await userModel.findById(userId);
    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile);
      userData.resume = resumeUpload.secure_url;
    }
    await userData.save();

    res.json({ success: true, message: "Resume Updated." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
