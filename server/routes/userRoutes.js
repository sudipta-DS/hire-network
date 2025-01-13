import express from "express";
import {
  applyForJob,
  getUserApplications,
  getUserData,
  updateUserResume,
} from "../controllers/userControllers.js";
import upload from "../config/multer.js";

const userRouter = express.Router();

userRouter.get("/user", getUserData);

userRouter.post("/apply", applyForJob),
  userRouter.get("/applications", getUserApplications);

userRouter.post("/update-resume", upload.single("resume"), updateUserResume);

export default userRouter;
