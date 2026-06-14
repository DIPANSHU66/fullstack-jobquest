import { application } from "../Models/application.model.js";
import { Job } from "../Models/jobs.model.js";


// ============================
// Apply For Job
// ============================
export const applyJobs = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Prevent duplicate applications
    const alreadyApplied = await application.findOne({
      applicant: userId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create new application
    const newApplication = await application.create({
      applicant: userId,
      job: jobId,
      status: "pending",
    });

    // Push application into job using updateOne to bypass unrelated field validations
    await Job.updateOne(
      { _id: jobId },
      { $push: { applications: newApplication._id } }
    );

    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application: newApplication,
    });

  } catch (error) {
    console.error("Apply Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================
// Get Applied Jobs
// ============================
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await application
      .find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("Get Applied Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================
// Get Applicants For Admin
// ============================
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
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
    console.error("Get Applicants Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================
// Update Application Status
// ============================
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.applicationId;

    const allowedStatus = [
      "pending",
      "accepted",
      "rejected",
      "interview",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatus.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const foundApplication = await application.findById(applicationId);

    if (!foundApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    foundApplication.status = status.toLowerCase();

    await foundApplication.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: foundApplication,
    });

  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================
// Withdraw Application
// ============================
export const withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const userId = req.id;

    const foundApplication = await application.findById(applicationId);

    if (!foundApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Authorization check: ensure student owns this application
    if (foundApplication.applicant.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to withdraw this application",
      });
    }

    const jobId = foundApplication.job;

    // Remove application ID from Job's applications array
    await Job.updateOne(
      { _id: jobId },
      { $pull: { applications: applicationId } }
    );

    // Delete application from database
    await application.findByIdAndDelete(applicationId);

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });

  } catch (error) {
    console.error("Withdraw Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};