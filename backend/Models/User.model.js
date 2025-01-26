import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneno: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, //URL TO RESUME file
      resumeorignalname: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilephoto: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const user = mongoose.model("user", userSchema);
