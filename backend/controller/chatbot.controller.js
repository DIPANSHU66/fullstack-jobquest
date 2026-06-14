import { GoogleGenAI } from "@google/genai";
import { user as User } from "../Models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// =====================================
// Local Keyword-based Chatbot Engine
// =====================================
const getFallbackChatbotReply = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello! 👋 I'm your AI Career Assistant. How can I help you today? You can ask me about resume reviews, mock interviews, or career advice.";
  }
  if (msg.includes("resume") || msg.includes("cv")) {
    return "For a stand-out resume:\n1. Keep it to 1 page if you have less than 5 years of experience.\n2. Focus on metrics (e.g., 'Improved loading speeds by 30%').\n3. Match keywords from the job description.\n\nYou can also click the new **Resume Review** link in the navbar to get a detailed layout scan of your profile!";
  }
  if (msg.includes("interview")) {
    return "Preparing for interviews? Make sure to:\n1. Review core DS/Algo concepts and system designs.\n2. Use the STAR method (Situation, Task, Action, Result) for behavioral questions.\n3. Try our interactive **Mock Interview** tool in the navbar to practice coding questions with real-time feedback!";
  }
  if (msg.includes("job") || msg.includes("career")) {
    return "To land your dream job, apply to roles listed under the 'Jobs' tab. Check the 'AI Match' page to see how well your skills align with requirements using vector similarity search.";
  }
  if (msg.includes("who are you") || msg.includes("help") || msg.includes("chatbot")) {
    return "I am the Job Quest AI Career Assistant! I help candidates optimize their resumes, simulate technical mock interviews, and find matching job recommendations.";
  }

  return "I understand! That's a great career question. I'm currently running in Fallback Mode due to API limits, but you can try using our dedicated Mock Interview Simulator or Resume Review dashboards in the navigation bar for structured career preparation!";
};

// =====================================
// Chat Endpoint
// =====================================
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!ai) {
      // Direct local fallback if key is missing
      return res.status(200).json({
        success: true,
        reply: getFallbackChatbotReply(message),
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
          You are an AI Career Assistant for a job portal. Provide concise, helpful career or technical advice.
          User message: "${message}"
        `,
      });

      return res.status(200).json({
        success: true,
        reply: response.text,
      });
    } catch (geminiError) {
      console.log("Gemini Chat API Error, calling fallback:", geminiError.message || geminiError);
      return res.status(200).json({
        success: true,
        reply: getFallbackChatbotReply(message),
      });
    }
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI response failed",
    });
  }
};

// =====================================
// Resume Review Endpoint
// =====================================
export const resumeReview = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const skills = user.profile?.skills || [];
    const bio = user.profile?.bio || "";
    const resumeText = user.profile?.resumeText || "";

    // Calculate score locally (0 - 100)
    let score = 30; // base score
    if (bio && bio !== "undefined") score += 15;
    if (skills.length > 0) score += Math.min(25, skills.length * 5);
    if (user.profile?.resume) score += 20;
    if (resumeText.length > 100) score += 10;

    const strengths = [];
    const missingSkills = [];
    const recommendations = [];

    // Local procedural parsing to generate feedback
    if (skills.length > 0) {
      strengths.push(`Strong technology foundation with expertise in: ${skills.slice(0, 4).join(", ")}.`);
    } else {
      recommendations.push("List your technical skills on your profile to help recruiters search for your profile.");
    }

    if (user.profile?.resume) {
      strengths.push("Professional resume document uploaded and hosted successfully.");
    } else {
      recommendations.push("Upload a PDF copy of your resume to enable full-text indexing and match vector scoring.");
    }

    if (bio && bio !== "undefined" && bio.length > 15) {
      strengths.push("Profile bio is concise and professionally formulated.");
    } else {
      recommendations.push("Add a 1-2 sentence professional summary detailing your core focus and years of experience.");
    }

    // Identify skills gaps against standard modern tech stack
    const industrySkills = ["Git", "Docker", "AWS", "TypeScript", "TailwindCSS", "Jest", "GraphQL", "CI/CD", "Next.js", "Redux"];
    industrySkills.forEach(skill => {
      const hasSkill = skills.some(s => s.toLowerCase() === skill.toLowerCase() || resumeText.toLowerCase().includes(skill.toLowerCase()));
      if (!hasSkill) {
        missingSkills.push(skill);
      }
    });

    recommendations.push("Incorporate metrics in project descriptions (e.g. 'boosted query efficiency by 20%').");
    recommendations.push("Highlight leadership roles, open source contributions, or hackathons to stand out.");

    const defaultReport = {
      success: true,
      score,
      strengths,
      missingSkills: missingSkills.slice(0, 5),
      recommendations: recommendations.slice(0, 4),
    };

    if (!ai) {
      return res.status(200).json(defaultReport);
    }

    try {
      // RAG feedback from Gemini
      const prompt = `
        You are a resume auditor. Review the candidate details:
        Skills: ${JSON.stringify(skills)}
        Bio: ${bio}
        Resume Text Summary: ${resumeText}

        Create a resume review JSON report with:
        {
          "score": 0 to 100 numeric score,
          "strengths": ["Strengths 1", "Strengths 2"],
          "missingSkills": ["Suggested skills to add"],
          "recommendations": ["Actionable improvement recommendations"]
        }
        Respond ONLY with the raw JSON object, no markdown wrappers.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const cleanJson = response.text?.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanJson);

      return res.status(200).json({
        success: true,
        score: parsed.score || score,
        strengths: parsed.strengths || strengths,
        missingSkills: parsed.missingSkills || missingSkills.slice(0, 5),
        recommendations: parsed.recommendations || recommendations.slice(0, 4),
      });
    } catch (geminiErr) {
      console.log("Gemini Review Error, using fallback report:", geminiErr.message || geminiErr);
      return res.status(200).json(defaultReport);
    }
  } catch (error) {
    console.error("Resume Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Resume review analysis failed",
    });
  }
};

// =====================================
// Mock Interview Simulator Endpoints
// =====================================

// Questions database for simulator
const INTERVIEW_QUESTIONS = {
  frontend: [
    "What is the Virtual DOM in React, and how does it optimize rendering performance?",
    "Explain the differences between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG).",
    "How does hoisting work in JavaScript? Explain temporal dead zone.",
    "Describe React state management options. When would you prefer Redux Toolkit over Context API?",
    "What is CSS specificity, and how does TailwindCSS handle utility classes in build outputs?"
  ],
  backend: [
    "What is middleware in Express.js? Explain how routing chains work.",
    "Compare SQL database scaling options (e.g. PostgreSQL replication) with NoSQL options (MongoDB sharding).",
    "How do you secure a REST API? Describe JWT verification, CORS policy, and rate limiting.",
    "What is the difference between processes and threads in Node.js, and how does the event loop execute asynchronous code?",
    "How does connection pooling work in database clients, and why is it important?"
  ],
  fullstack: [
    "Explain standard security concerns when building fullstack JavaScript apps (CSRF, XSS, SQL injection).",
    "Describe the complete request-response flow from typing a URL in the browser to retrieving data from a database.",
    "How do you implement real-time communications in a MERN stack app? (WebSocket vs Server-Sent Events)",
    "What is database indexing? Explain the costs and benefits of adding indexes to MongoDB collections.",
    "Describe a solid CI/CD deployment pipeline for deploying a frontend React SPA and Node.js backend."
  ],
  ai: [
    "What is Retrieval-Augmented Generation (RAG), and how does it prevent LLM hallucination?",
    "Explain what vector embeddings represent and how similarity indexes (like cosine similarity) map text contexts.",
    "What is the difference between fine-tuning a model and utilizing few-shot prompting?",
    "Explain temperature parameter in generative AI text models. What values would you set for a factual Q&A bot vs creative writer?",
    "How do vector database indexes (like HNSW or Flat indexes) optimize embedding searches?"
  ]
};

export const startInterview = async (req, res) => {
  try {
    const { role } = req.body;
    const targetRole = role ? role.toLowerCase() : "fullstack";

    const questions = INTERVIEW_QUESTIONS[targetRole] || INTERVIEW_QUESTIONS.fullstack;

    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return res.status(200).json({
      success: true,
      sessionId,
      role: targetRole,
      question: questions[0],
      totalQuestions: questions.length,
      questionIndex: 0
    });
  } catch (error) {
    console.error("Start Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize interview session",
    });
  }
};

export const answerInterview = async (req, res) => {
  try {
    const { sessionId, role, questionIndex, answer } = req.body;
    const targetRole = role ? role.toLowerCase() : "fullstack";
    const index = parseInt(questionIndex) || 0;

    const questions = INTERVIEW_QUESTIONS[targetRole] || INTERVIEW_QUESTIONS.fullstack;

    if (!answer || answer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid answer to proceed.",
      });
    }

    const currentQuestion = questions[index];
    let score = 5; // default baseline
    let feedback = "";
    let modelAnswer = "";

    // Fallback grading logic
    const answerLower = answer.toLowerCase();
    
    if (targetRole === "frontend" && index === 0) {
      modelAnswer = "React uses a Virtual DOM as an in-memory representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one (diffing), and updates only the changed nodes in the real DOM (reconciliation).";
      if (answerLower.includes("in-memory") || answerLower.includes("diffing") || answerLower.includes("reconciliation") || answerLower.includes("real dom")) {
        score = 9;
        feedback = "Excellent explanation! You touched upon core concepts like Virtual DOM tree comparison, state reconciliation, and minimal real-DOM mutations.";
      } else {
        score = 6;
        feedback = "Good effort, but you should mention the diffing process and reconciliation, explaining how React only updates the changed nodes.";
      }
    } else if (targetRole === "backend" && index === 2) {
      modelAnswer = "API security is achieved by verifying JWTs in request headers, setting restrictive CORS origins, sanitizing inputs to prevent injections, implementing rate limits (e.g., rate-limiter-flexible), and using HTTPS to encrypt payloads.";
      if (answerLower.includes("jwt") || answerLower.includes("cors") || answerLower.includes("rate limit") || answerLower.includes("https")) {
        score = 9;
        feedback = "Spot on! Using JWT tokens, CORS policy controls, rate limiting, and secure HTTPS are key components to protect APIs.";
      } else {
        score = 6;
        feedback = "You should explicitly list methods like JWT verification middleware, token encryption, request throttling, and CORS origin settings.";
      }
    } else {
      // General grading based on answer length and structure
      if (answer.split(" ").length > 30) {
        score = 8;
        feedback = "Detailed response. You explained key technical points and provided a structured reasoning.";
      } else {
        score = 6;
        feedback = "Brief response. Try explaining the mechanism in detail, naming specific modules or architectural methods.";
      }
      modelAnswer = "A complete technical answer would detail the architectural patterns, explain data safety, and mention testing libraries or configurations.";
    }

    if (ai) {
      try {
        // AI Grading using Gemini
        const prompt = `
          You are an interviewer. Grade the candidate's response:
          Question: "${currentQuestion}"
          Candidate Answer: "${answer}"

          Respond ONLY with a JSON object:
          {
            "score": numeric score between 1 and 10,
            "feedback": "Short constructive feedback",
            "modelAnswer": "An ideal response summarizing key terms"
          }
          Do not include markdown blocks.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });

        const cleanJson = response.text?.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(cleanJson);
        score = parsed.score || score;
        feedback = parsed.feedback || feedback;
        modelAnswer = parsed.modelAnswer || modelAnswer;
      } catch (err) {
        console.log("Gemini Grading Error, using fallback:", err.message || err);
      }
    }

    const nextIndex = index + 1;
    const isFinished = nextIndex >= questions.length;
    const nextQuestion = isFinished ? null : questions[nextIndex];

    return res.status(200).json({
      success: true,
      score,
      feedback,
      modelAnswer,
      nextQuestion,
      questionIndex: nextIndex,
      isFinished
    });
  } catch (error) {
    console.error("Answer Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during answer grading",
    });
  }
};

export const saveInterviewScore = async (req, res) => {
  try {
    const userId = req.id;
    const { role, score } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.profile.interviewHistory) {
      user.profile.interviewHistory = [];
    }

    user.profile.interviewHistory.push({
      role: role || "Fullstack",
      score: Number(score) || 0,
      date: new Date()
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Interview score saved successfully",
      interviewHistory: user.profile.interviewHistory,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneno: user.phoneno,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error("Save Interview Score Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};