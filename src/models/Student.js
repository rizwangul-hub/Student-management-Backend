import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"], // Lower bound
      max: [40, "Age cannot exceed 40"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    course: {
      type: String,
      enum: {
        values: ["MERN Stack", "Python", "Graphic Design", "Digital Marketing"],
      },
      required: [true, "Please select a course"],
      trim: true,
    },
    feeStatus: {
      type: String,
      enum: {
        values: ["Paid", "Pending"],
      },
      default: "Pending",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Student = mongoose.model("Student", studentSchema);
