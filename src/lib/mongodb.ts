import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  const uri = process.env.MONGODB_URI;

  // ⛔ Skip DB ketika build atau uri = dummy
  if (!uri || uri === "dummy") {
    if (process.env.NODE_ENV === "production") {
      console.warn("Skipping DB connect during build.");
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
