import mongoose from "mongoose";

let isConnected = false;

export const connnectionDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false, // Disable buffering to fail fast if not connected
    });
    
    isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error; // Rethrow to let the caller handle it
  }
};
