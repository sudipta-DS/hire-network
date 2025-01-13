import jobModel from "../models/job.js";

export const getJobs = async (req, res) => {
  try {
    const allJobs = await jobModel
      .find({ visible: true })
      .populate({ path: "companyId", select: "-password" });
    res.json({ success: true, allJobs });
  } catch (error) {
    res.json({ success: false, message: "something went wrong." });
  }
};

export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel
      .findById(id)
      .populate({ path: "companyId", select: "-password" });
    if (!job) {
      res.json({ success: false, message: "Invalid jobId" });
    } else {
      res.json({ success: true, job: job });
    }
  } catch (error) {
    res.json({ success: false, message: "something went wrong" });
  }
};
