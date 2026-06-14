import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import { chat, resumeReview, startInterview, answerInterview, saveInterviewScore } from "../controller/chatbot.controller.js";

const router = express.Router();

router.post(
  "/chat",
  isAuthenticated,
  chat
);

router.get(
  "/resume-review",
  isAuthenticated,
  resumeReview
);

router.post(
  "/interview/start",
  isAuthenticated,
  startInterview
);

router.post(
  "/interview/answer",
  isAuthenticated,
  answerInterview
);

router.post(
  "/interview/save-score",
  isAuthenticated,
  saveInterviewScore
);

export default router;