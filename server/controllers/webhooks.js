import { Webhook } from "svix";
import userModel from "../models/user.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verfying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting data from request body
    const { data, type } = req.body;

    // Switch Cases for different Events
    switch (type) {
      case "user.created":
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await userData.save();
        res.json({});
        break;
      case "user.updated":
        const userRes = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await userModel.findByIdAndUpdate(data.id, userRes);
        res.json({});
        break;
      case "user.deleted":
        await userModel.findByIdAndDelete(data.id);
        res.json({});
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false });
  }
};