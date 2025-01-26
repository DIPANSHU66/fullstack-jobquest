import { Job } from "../Models/jobs.model.js";

export const postjob = async (req, res) => {
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
      companyid,
    } = req.body;

    const userid = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyid
    ) {
      return res.status(400).json({
        message: "something  is Missing",
        success: false,
      });
    }
    const newjob = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experiencelevel: experience,
      position,
      company: companyid,
      created_by: userid,
    });

    return res.status(201).json({
      message: "New  job Created Successfully",
      success: true,
      newjob,
    });
  } catch (e) {
    console.log(e);
  }
};



export const getalljobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs)
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

//students


export const getjobbyid = async (req, res) => {
  try {
    const jobid = req.params.id;
    const newjob =  await Job.findById(jobid);
    if (!newjob)
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });

    return res.status(200).json({
      newjob,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};





export const getadminjob = async (req, res) => {
  try {
    const adminid = req.id;
    const newjobs = await Job.find({ created_by: adminid });

    if (!newjobs)
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });

    return res.status(200).json({
      newjobs,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

