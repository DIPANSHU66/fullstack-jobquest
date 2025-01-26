import mongoose from "mongoose";
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGOOSE CONNECTED SUCCESFULLY");
  } catch (e) {
    console.log(e);
  }
};

export  default connectdb;