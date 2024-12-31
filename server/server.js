import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import "./config/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("server working.");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server started successfully.");
});
