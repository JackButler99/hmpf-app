import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  const uri = process.env.MONGODB_URI;

  // ⛔ Jangan error saat BUILD
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      console.warn("MONGODB_URI missing during build, skipping DB connection.");
      return;
    }
    throw new Error("Please define the MONGODB_URI environment variable.");
  }

  if (isConnected) return;

  try {
    await mongoose.connect(uri);
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
