// connected.js
import mongoose from "mongoose";

const connectDBS = async (url) => {
  try {
    await mongoose.connect(url, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default connectDBS;
