import companyModel from "../models/company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import jobModel from "../models/job.js";
import jobApplicationModel from "../models/jobApplication.js";

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const companyExists = await companyModel.findOne({ email });
    if (companyExists) {
      res.json({ success: false, message: "Company already registered." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const uploadResult = await cloudinary.uploader.upload(imageFile.path);

    const company = await companyModel.create({
      name,
      email,
      password: hashPassword,
      image: uploadResult.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    // console.log(error);
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingCompany = await companyModel.findOne({ email });
    if (!existingCompany) {
      res.json({ success: false, message: "company not registered" });
    }
    const passwordCorrect = await bcrypt.compare(
      password,
      existingCompany.password
    );
    if (passwordCorrect) {
      res.json({
        success: true,
        company: {
          _id: existingCompany._id,
          name: existingCompany.name,
          email: existingCompany.email,
          image: existingCompany.image,
        },
        token: generateToken(existingCompany._id),
      });
    } else {
      res.json({ success: false, message: "incorrect password" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  try {
    const companyId = req.company;
    const company = await companyModel.findById(companyId);
    res.json({ success: true, company });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Post a job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company;
  try {
    const newJob = await jobModel.create({
      title,
      description,
      category,
      date: Date.now(),
      level,
      location,
      salary,
      visible: true,
      companyId,
    });
    res.json({
      success: true,
      message: "job added successfully.",
      job: newJob,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "something went wrong" });
  }
};

// Get Applicants Data of Company
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company;
    // console.log(companyId);
    const applications = await jobApplicationModel
      .find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: "No Applicants." });
  }
};

// Get Company Job List
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company;
    const jobs = await jobModel.find({ companyId });

    // Adding No of applicants info in data

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await jobApplicationModel.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    // console.log(jobsData);

    res.json({ success: true, jobData: jobsData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "something went wrong" });
  }
};

// Change Application Status
export const ChangeJobApplicationsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    await jobApplicationModel.findByIdAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "status updated successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change Applications Visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company;
    const job = await jobModel.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: "something went wrong." });
  }
};
