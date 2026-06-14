import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!ai) {
  console.warn("WARNING: GEMINI_API_KEY is missing from environment. AI features will run in Fallback Mode.");
}

// Generate text embeddings using Gemini
export const getEmbedding = async (text) => {
  if (!ai || !text || !text.trim()) return [];
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text.trim(),
    });
    if (response?.embedding?.values) {
      return response.embedding.values;
    }
    return [];
  } catch (error) {
    console.error("Gemini Embedding Error (falling back to empty vector):", error.message || error);
    return [];
  }
};

// Parse uploaded PDF resume using Gemini 2.0 Flash multimodal capabilities
export const parseResume = async (pdfBuffer, originalName) => {
  const result = {
    fullname: "",
    email: "",
    phoneno: "",
    bio: "",
    skills: [],
    resumeText: "",
  };

  if (!pdfBuffer) return result;

  // Set default raw resume text
  result.resumeText = `Resume File: ${originalName}`;

  if (!ai) {
    console.warn("Gemini Client not initialized. Skipping automated resume parsing.");
    return result;
  }

  try {
    console.log("Analyzing resume PDF with Gemini...");
    const base64Data = pdfBuffer.toString("base64");
    
    const prompt = `
      You are an expert resume parsing assistant. Analyze this resume file.
      Extract the following fields and format them as a JSON object:
      {
        "fullname": "Full name of candidate",
        "email": "Email address",
        "phoneno": "Phone number as number or string",
        "bio": "A short, professional 1-2 sentence bio/summary of the candidate's background",
        "skills": ["Array", "of", "skills", "found"],
        "resumeText": "A clean, text-only extraction of the entire resume content"
      }
      Do not output any markdown code blocks (e.g. \`\`\`json), just return the raw JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
        prompt,
      ],
    });

    const text = response.text?.trim();
    if (text) {
      // Clean JSON formatting if markdown wraps it
      const cleanJson = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      return {
        fullname: parsed.fullname || "",
        email: parsed.email || "",
        phoneno: parsed.phoneno || "",
        bio: parsed.bio || "",
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        resumeText: parsed.resumeText || text,
      };
    }
  } catch (error) {
    console.error("Gemini Resume Parsing Error:", error.message || error);
  }

  return result;
};

// Calculate Cosine Similarity between two vectors
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Local Jaccard text similarity fallback
export const fallbackTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  const getWords = (str) => {
    return new Set(
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  };
  const words1 = getWords(text1);
  const words2 = getWords(text2);
  
  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Generate RAG Job Fit Analysis
export const getRAGAnalysis = async (candidateInfo, jobInfo) => {
  const defaultExplanation = `
### Programmatic Fit Analysis
- **Matched Skills**: ${candidateInfo.skills.filter(s => jobInfo.requirements.some(req => req.toLowerCase().includes(s.toLowerCase()))).join(", ") || "None identified"}
- **Required Experience**: Candidate bio/summary matched against job level of ${jobInfo.experienceLevel} years.
- **Recommendations**: Enhance skills in technologies specified in the job description to improve matching index.
  `.trim();

  if (!ai) return defaultExplanation;

  try {
    const prompt = `
      You are an AI recruiter. Review this candidate profile and job description:
      
      Candidate Skills: ${JSON.stringify(candidateInfo.skills)}
      Candidate Bio: ${candidateInfo.bio}
      Candidate Summary: ${candidateInfo.resumeText}
      
      Job Title: ${jobInfo.title}
      Job Description: ${jobInfo.description}
      Job Requirements: ${JSON.stringify(jobInfo.requirements)}
      
      Provide a brief, 3-4 sentence professional explanation of:
      1. Why this job matches or doesn't match their skills.
      2. Any key skills gap.
      3. A recommendation for preparation.
      Format in clean markdown without meta headings, just bullet points.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || defaultExplanation;
  } catch (error) {
    console.error("Gemini RAG Analysis Error:", error.message || error);
    return defaultExplanation;
  }
};
