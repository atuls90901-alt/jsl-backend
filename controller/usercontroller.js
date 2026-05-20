import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../model/usermodel.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// REGISTER USER
export const registerUser = async (
  req,
  res
) => {
  try {
    console.log(
      "REQ BODY:",
      req.body
    );

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK EMPTY FIELDS
    if (
      !name ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({
          message:
            "All fields are required",
        });
    }

    // CHECK EXISTING USER
    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res
        .status(400)
        .json({
          message:
            "User already exists",
        });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE USER
    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role: "user",
      });

    // GENERATE TOKEN
    const token =
      generateToken(
        user._id
      );

    res.status(201).json({
      success: true,
      message:
        "Registration successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Registration failed",

      error:
        error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // CHECK EMPTY FIELDS
    if (
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({
          message:
            "Email and password required",
        });
    }

    // FIND USER
    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Invalid credentials",
        });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res
        .status(401)
        .json({
          message:
            "Invalid credentials",
        });
    }

    // GENERATE TOKEN
    const token =
      generateToken(
        user._id
      );

    res.status(200).json({
      success: true,
      message:
        "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Login failed",

      error:
        error.message,
    });
  }
};

// ADMIN LOGIN
export const adminLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Admin not found",
        });
    }

   
    if (
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          message:
            "Not an admin",
        });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res
        .status(401)
        .json({
          message:
            "Invalid credentials",
        });
    }

    
    const token =
      generateToken(
        user._id
      );

    res.status(200).json({
      success: true,
      message:
        "Admin login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(
      "ADMIN LOGIN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Admin login failed",

      error:
        error.message,
    });
  }
};