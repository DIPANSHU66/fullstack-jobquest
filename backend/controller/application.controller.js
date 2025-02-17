import { application } from "../Models/application.model.js";
import { Job } from "../Models/jobs.model.js";

export const applyjobs = async (req, res) => {
  try {
    const userid = req.id;

    const jobid = req.params.id;

    if (!jobid)
      return res.status(400).json({
        message: "job   id is required",
        success: false,
      });
    //  check   if  the user    has already applied the job
    const existingapplication = await application.findOne({
      job: jobid,
      applicant: userid,
    });

    if (existingapplication) {
      return res.status(400).json({
        message: "you   are Already applied for job",
        success: false,
      });
    }
    //  check   if job  exists
    const newjob = await Job.findById(jobid);
    if (!newjob)
      return res.status(400).json({
        message: "Job not   found",
        success: false,
      });

    // create a   new appplication

    const newapplication = await application.create({
      job: jobid,
      applicant: userid,
    });
    newjob.applications.push(newapplication._id);

    await newjob.save();
    return res.status(200).json({
      message: "Job applied Successfully",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getappliedjobs = async (req, res) => {
  try {
    const userid = req.id;
    const newapplication = await application
      .find({ applicant: userid })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!newapplication)
      return res.status(404).json({
        message: "No Apllications Found",
        success: false,
      });

    return res.status(200).json({
      application: newapplication,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

//admin dekhaga kitne   user    ne  apply   kiya    hai
export const getapplicants = async (req, res) => {
  const jobid = req.params.id;

  const checkjob = await Job.findById(jobid).populate({
    path: "applications",
    populate: {
      path: "applicant",
    },
    options: { sort: { createdAt: -1 } },
  });

  if (!checkjob)
    return res.status(404).json({
      message: "Job not    found",
      success: false,
    });
  return res.status(200).json({
    checkjob,
    success: true,
  });
};

export const updatestatus = async (req, res) => {
  try {
    const status = req.body.status;
    const applicationid = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is Required",
        success: false,
      });
    }
    //  find the    application by  applicant   id

    const newappliaction = await application.findById(applicationid);
    if (!newappliaction)
      return res.status(400).json({
        message: "Appliaction   not found",
        success: false,
      });

    //update the status

    newappliaction.status = status.toLowerCase();
    newappliaction.save();
    return res.status(200).json({
      message: "Status updated SuccessFully",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};
