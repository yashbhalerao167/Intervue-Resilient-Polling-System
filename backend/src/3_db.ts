import mongoose from "mongoose";

const MONGO_URL = "mongodb://127.0.0.1:27017/live_polling_system";

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed");
  }
}
