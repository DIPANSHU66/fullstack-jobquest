import { user } from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneno, password, role } = req.body;
    if (!fullname || !email || !phoneno || !password || !role)
      return res.status(400).json({
        message: "Something is Missing",
        success: false,
      });

    const User = await user.findOne({ email });
    if (User)
      return res.status(400).json({
        message: "User already exist    with this email",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.create({
      fullname,
      email,
      phoneno,
      password: hashedPassword,
      role,
    });
    return res.status(200).json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({
        message: "Something is Missing",
        success: false,
      });
    const founduser = await user.findOne({ email });
    if (!founduser) {
      return res
        .status(400)
        .json({ message: "Incorrect  email or Password", success: false });
    }
    const isPasswordmatch = await bcrypt.compare(password, founduser.password);
    if (!isPasswordmatch)
      return res
        .status(400)
        .json({ message: "Incorrect  email or Password", success: false });
    /// check role is correct or  not

    if (role !== founduser.role) {
      return res.status(400).json({
        message: "Account doesn't exist with   This current role.",
        success: false,
      });
    }
    const userdata = {
      _id: founduser.id,
      fullname: founduser.fullname,
      email: founduser.email,
      phoneno: founduser.phoneno,
      role: founduser.role,
      profie: founduser.profile,
    };

    const tokendata = { userid: founduser.id };

    const token = jwt.sign(tokendata, process.env.SECERT_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: `Welcome back ${userdata.fullname}`,
        success: true,
        userdata,
      });
  } catch (err) {
    console.log(err);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", null, { maxAge: 0 }).json({
      message: "Logout SuccessFully",
      Success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneno, bio, skills } = req.body;
    const file = req.file;
    const userid = req.id;
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    let userdata = await user.findById(userid);
    if (!userdata)
      return res
        .status(400)
        .json({ message: "User not  found", success: false });

    if (fullname) userdata.fullname = fullname;
    if (email) userdata.email = email;
    if (phoneno) userdata.phoneno = phoneno;
    if (bio) userdata.profile.bio = bio;
    if (skills) userdata.profile.skills = skillsArray;
    if (file) userdata.profile.resume = file.path;
    await userdata.save();

    return res.status(200).json({
      message: "Profile Updated Successfully",
      success: true,
      user: {
        _id: userdata.id,
        fullname: userdata.fullname,
        email: userdata.email,
        phoneno: userdata.phoneno,
        role: userdata.role,
        profile: userdata.profile,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
