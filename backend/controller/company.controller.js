


import { company } from "../Models/company.model.js";


export const registercompany = async (req, res) => {
  try {
    const { companyname } = req.body;
    if (!companyname)
      return res.status(400).json({
        message: "Company name is Required",
        success: true,
      });
    let mycompany = await company.findOne({ name: companyname });
    if (mycompany)
      return res.status(400).json({
        message: "You can't Registered same Company",
      });

    let newcompany = await company.create({
      name: companyname,
      userid: req.id,
    });
    return res.status(201).json({
      message: "Company registered SuccessFully",
      newcompany,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};




export const getcompany = async (req, res) => {
  try {
    const userid = req.id;
    const companies = await company.find({ userid });
    if (!companies)
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};




export const getcompanybyid = async (req, res) => {
  try {
    const companyname = req.params.id;
    const newcompany = await company.findById(companyname);
    if (!newcompany)
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    return res.status(200).json({
      newcompany,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};




export const updatecompanyinfomation = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    //  Cloudinary

    const updatedata = { name, description, website, location };
    const newcompany = await company.findByIdAndUpdate(
      req.params.id,
      updatedata,
      {
        new: true,
      }
    );

    if (!newcompany)
      return res.status(400).json({
        message: "company not  found",
        success: true,
      });

    return res.status(200).json({
      message: "Company information updated",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};


