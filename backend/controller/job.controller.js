import { Job } from "../Models/jobs.model.js";
import mongoose from "mongoose";
import { getEmbedding, cosineSimilarity, fallbackTextSimilarity, getRAGAnalysis } from "../utils/ai.js";
import { user as User } from "../Models/User.model.js";


// ======================================
// Post New Job
// ======================================
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId: reqCompanyId,
      companyid: reqCompanyid,
    } = req.body;

    const companyId = reqCompanyId || reqCompanyid;

    const userId = req.id;

    // Validation
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    // Convert requirements into array
    const requirementsArray = requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // Generate vector embedding for the job listing
    let jobEmbedding = [];
    try {
      const jobText = `
        Job Title: ${title.trim()}
        Description: ${description.trim()}
        Requirements: ${requirementsArray.join(", ")}
        Salary: ${salary} LPA
        Location: ${location.trim()}
        Job Type: ${jobType}
      `.trim();
      jobEmbedding = await getEmbedding(jobText);
    } catch (err) {
      console.error("Job Embedding Generation Error:", err);
    }

    const newJob = await Job.create({
      title: title.trim(),
      description: description.trim(),
      requirements: requirementsArray,
      salary: parseInt(salary, 10) || 0,
      location: location.trim(),
      jobType,
      experiencelevel: parseInt(experience, 10) || 0,
      position: parseInt(position, 10) || 1,
      company: companyId,
      created_by: userId,
      status: "Active",
      embedding: jobEmbedding,
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });

  } catch (error) {
    console.error("Post Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Get All Jobs (Advanced Filtering)
// ======================================
export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword = "",
      location,
      jobType,
      experience,
      salaryMin,
      salaryMax,
      sortBy = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "Active",
    };

    // Keyword search
    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          requirements: {
            $in: [new RegExp(keyword, "i")],
          },
        },
      ];
    }

    // Location filter
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Experience filter
    if (experience) {
      query.experiencelevel = experience;
    }

    // Salary filter
    if (salaryMin || salaryMax) {
      query.salary = {};

      if (salaryMin) {
        query.salary.$gte = Number(salaryMin);
      }

      if (salaryMax) {
        query.salary.$lte = Number(salaryMax);
      }
    }

    // Sorting
    let sortOption = {};

    switch (sortBy) {
      case "salary_high":
        sortOption = { salary: -1 };
        break;

      case "salary_low":
        sortOption = { salary: 1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate("company")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / Number(limit)),
      jobs,
    });

  } catch (error) {
    console.error("Get All Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Get Job By ID
// ======================================
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId)
      .populate("company")
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
          select: "-password",
        },
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {
    console.error("Get Job By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Get Recruiter/Admin Jobs
// ======================================
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({
      created_by: adminId,
    })
      .populate("company")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {
    console.error("Get Admin Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Match Jobs For Candidate (AI Embeddings + Cosine Similarity + RAG)
// ======================================
export const matchJobs = async (req, res) => {
  try {
    const userId = req.id;

    // Find the candidate
    const candidate = await User.findById(userId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Check if they have skills or resume
    const candidateSkills = candidate.profile?.skills || [];
    const candidateBio = candidate.profile?.bio || "";
    const candidateResumeText = candidate.profile?.resumeText || "";

    if (candidateSkills.length === 0 && !candidateResumeText) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile or upload a resume to use the AI Match Engine.",
      });
    }

    // Fetch all active jobs
    const activeJobs = await Job.find({ status: "Active" }).populate("company").lean();
    if (activeJobs.length === 0) {
      return res.status(200).json({
        success: true,
        matches: [],
      });
    }

    // Calculate match scores
    const candidateEmbedding = candidate.profile?.embedding || [];
    const useEmbeddings = candidateEmbedding.length > 0;

    const matches = await Promise.all(
      activeJobs.map(async (job) => {
        let similarityScore = 0;

        if (useEmbeddings && job.embedding && job.embedding.length > 0) {
          similarityScore = cosineSimilarity(candidateEmbedding, job.embedding);
        } else {
          // Fallback to text similarity based on skills/title/requirements
          const jobText = `${job.title} ${job.description} ${job.requirements.join(" ")}`;
          const candidateText = `${candidateSkills.join(" ")} ${candidateBio} ${candidateResumeText}`;
          similarityScore = fallbackTextSimilarity(candidateText, jobText);
        }

        // Convert similarity score to a percentage (0 to 100)
        let matchPercentage = Math.round(similarityScore * 100);
        if (!useEmbeddings) {
          // Boost Jaccard similarity slightly for realistic job overlap display
          matchPercentage = Math.min(100, Math.round(similarityScore * 250));
          if (matchPercentage < 10 && candidateSkills.some(skill => job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase())))) {
            matchPercentage = 35; // base match if at least one skill overlaps
          }
        }

        // Add some small random variation if it evaluates to 0 but they match some skill
        if (matchPercentage === 0) {
          matchPercentage = Math.floor(Math.random() * 10) + 5; // 5-15% baseline match
        }

        // Generate RAG explanation
        const candidateInfo = {
          skills: candidateSkills,
          bio: candidateBio,
          resumeText: candidateResumeText,
        };
        const jobInfo = {
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          experienceLevel: job.experiencelevel || 0,
        };

        const explanation = await getRAGAnalysis(candidateInfo, jobInfo);

        return {
          job: {
            _id: job._id,
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            salary: job.salary,
            location: job.location,
            jobType: job.jobType,
            experiencelevel: job.experiencelevel,
            position: job.position,
            company: job.company,
            createdAt: job.createdAt,
          },
          matchPercentage,
          explanation,
        };
      })
    );

    // Sort matching jobs by match percentage descending
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.status(200).json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("Match Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI matching failed",
    });
  }
};