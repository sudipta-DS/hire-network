import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import "./config/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import router from "./routes/companyRoutes.js";
import connectCloudinay from "./config/cloudinary.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import corsOptionsDelegate from "./config/cors.js";

const app = express();

await connectDB();
await connectCloudinay();

// Middlewares
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("server working.");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/company", router);
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server started successfully.");
});
