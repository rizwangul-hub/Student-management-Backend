import mongoose from "mongoose";

export const connnectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DataBase are connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};
