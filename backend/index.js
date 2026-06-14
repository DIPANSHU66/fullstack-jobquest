import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectdb from "./utils/db.js";

import userroute from "./routes/user.route.js";
import companyroute from "./routes/company.route.js";
import jobroute from "./routes/jobs.route.js";
import applicantroute from "./routes/application.route.js";
import chatbotroute from "./routes/chatbot.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// CORS
const corsoptions = {
  origin: process.env.URL, // http://localhost:5173
  credentials: true,
};

app.use(cors(corsoptions));

// Routes
app.use("/api/v1/user", userroute);
app.use("/api/v1/company", companyroute);
app.use("/api/v1/jobs", jobroute);
app.use("/api/v1/application", applicantroute);
app.use("/api/v1/chatbot", chatbotroute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectdb();
  console.log(`Server Running at Port ${PORT}`);
});