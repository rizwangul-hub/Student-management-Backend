import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Student } from "../models/Student.js";
import mongoose from "mongoose";

export const studentCreate = async (req, res) => {
  const userId = req.userId;
  const { name, email, phone, age, gender, course, feeStatus } = req.body;
  const isExistEmail = await Student.findOne({ email });
  if (isExistEmail) {
    return res.status(409).json({
      message: "Student alredy exist on this email",
      forword: false,
    });
  }
  const student = await Student.create({
    name,
    email,
    phone,
    age,
    gender,
    course,
    feeStatus,
    createdBy: userId,
  });
  return res.status(201).json({
    message: "Student created successfully",
    forword: true,
    data: student,
  });
};

export const allStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword, course, feeStatus } = req.query;

    const query = {};

    // SEARCH
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { course: { $regex: keyword, $options: "i" } },
      ];
    }

    // FILTER: COURSE
    if (course) {
      query.course = course;
    }

    // FILTER: FEE STATUS
    if (feeStatus) {
      query.feeStatus = feeStatus;
    }

    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.json({
      students,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const searchStudent = async (req, res) => {
  const search = req.query.search;

  try {
    const searchStudent = await Student.aggregate([
      {
        $match: {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { course: { $regex: search, $options: "i" } },
          ],
        },
      },
    ]);

    res.status(200).json({
      message: "Here are the student data",
      data: searchStudent,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const singleStudent = async (req, res) => {
  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({
      message: "Invalid Student ID",
      forward: false,
    });
  }

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        forward: false,
      });
    }
    res.status(200).json({
      message: "Student fetched successfully",
      data: student,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const updateStudent = async (req, res) => {
  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({
      message: "Invalid Student ID",
      forward: false,
    });
  }
  const { name, email, phone, age, gender, course, feeStatus } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        forward: false,
      });
    }
    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.age = age || student.age;
    student.gender = gender || student.gender;
    student.course = course || student.course;
    student.feeStatus = feeStatus || student.feeStatus;

    const updatedStudent = await student.save();

    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({
      message: "Invalid Student ID",
      forward: false,
    });
  }
  try {
    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        forward: false,
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user; // comes from authMiddleware

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const studentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Student.countDocuments();

    const paid = await Student.countDocuments({
      createdBy: userId,
      feeStatus: "Paid",
    });

    const pending = await Student.countDocuments({
      createdBy: userId,
      feeStatus: "Pending",
    });

    res.json({
      total,
      paid,
      pending,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
