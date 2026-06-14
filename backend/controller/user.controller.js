import { user as User } from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { parseResume, getEmbedding } from "../utils/ai.js";


// ======================================
// Generate JWT Token
// ======================================
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};


// ======================================
// Register User
// ======================================
export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneno,
      password,
      role,
    } = req.body;

    // Validation
    if (
      !fullname ||
      !email ||
      !phoneno ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Duplicate email check
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    let profilePhoto = "";

    // Optional profile image upload
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "job-portal/profile-images",
        }
      );

      profilePhoto = cloudResponse.secure_url;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      fullname: fullname.trim(),
      email: email.toLowerCase(),
      phoneno,
      password: hashedPassword,
      role,

      profile: {
        profilephoto: profilePhoto,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Login User
// ======================================
export const login = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    // Find user
    const foundUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Password compare
    const isPasswordMatch = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Role validation
    if (role !== foundUser.role) {
      return res.status(403).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Generate token
    const token = generateToken(foundUser._id);

    // Response user object
    const userData = {
      _id: foundUser._id,
      fullname: foundUser.fullname,
      email: foundUser.email,
      phoneno: foundUser.phoneno,
      role: foundUser.role,
      profile: foundUser.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome back ${foundUser.fullname}`,
        user: userData,
      });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Logout User
// ======================================
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });

  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Update Profile
// ======================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;

    const {
      fullname,
      email,
      phoneno,
      bio,
      skills,
    } = req.body;

    // Find user
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Email validation
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Skills array
    let skillsArray = [];

    if (skills) {
      skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Resume upload
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          resource_type: "auto",
          folder: "job-portal/resumes",
        }
      );

      foundUser.profile.resume = cloudResponse.secure_url;
      foundUser.profile.resumeorignalname = req.file.originalname;

      // Extract skills and text from PDF using Gemini
      try {
        const parsedResume = await parseResume(req.file.buffer, req.file.originalname);
        if (parsedResume) {
          foundUser.profile.resumeText = parsedResume.resumeText || "";
          if (parsedResume.skills && parsedResume.skills.length > 0 && (!skills || skills.trim() === "")) {
            skillsArray = parsedResume.skills;
          }
          if (parsedResume.bio && (!bio || bio.trim() === "")) {
            foundUser.profile.bio = parsedResume.bio;
          }
        }
      } catch (err) {
        console.error("Resume Parsing Skip/Error:", err);
      }
    }

    // Update fields
    if (fullname) foundUser.fullname = fullname;
    if (email) foundUser.email = email.toLowerCase();
    if (phoneno) foundUser.phoneno = phoneno;

    if (!foundUser.profile) {
      foundUser.profile = {};
    }

    if (bio) {
      foundUser.profile.bio = bio;
    }

    if (skillsArray.length > 0) {
      foundUser.profile.skills = skillsArray;
    }

    // Generate vector embedding for the profile
    try {
      const profileText = `
        Candidate: ${foundUser.fullname}
        Bio: ${foundUser.profile.bio || ""}
        Skills: ${(foundUser.profile.skills || []).join(", ")}
        Resume: ${foundUser.profile.resumeText || ""}
      `.trim();
      foundUser.profile.embedding = await getEmbedding(profileText);
    } catch (err) {
      console.error("Profile Embedding Generation Error:", err);
    }

    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        _id: foundUser._id,
        fullname: foundUser.fullname,
        email: foundUser.email,
        phoneno: foundUser.phoneno,
        role: foundUser.role,
        profile: foundUser.profile,
      },
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};