import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./utils/db.js";
import userroute from "./routes/user.route.js";
import companyroute from "./routes/company.route.js";
import jobroute from "./routes/jobs.route.js";
import applicantroute from "./routes/application.route.js";
const app = express();

dotenv.config({});
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsoptions = {
  origin: "http://localhost:5173",
  Credentials: true,
};
app.use(cors(corsoptions));

const PORT = process.env.PORT || 3000;
app.use("/api/v1/user", userroute);
app.use("/api/v1/company", companyroute);
app.use("/api/v1/jobs", jobroute);
app.use("/api/v1/application", applicantroute);
app.listen(PORT, () => {
  connectdb();
  console.log(`Server Running at  port    ${PORT}`);
});
