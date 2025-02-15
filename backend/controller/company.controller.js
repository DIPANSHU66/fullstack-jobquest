import { company } from "../Models/company.model.js";
import getdataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const registercompany = async (req, res) => {
  try {
    const { companyname } = req.body;
    if (!companyname)
      return res.status(400).json({
        message: "Company name is Required",
        success: false,
      });
    let mycompany = await company.findOne({ name: companyname });
    if (mycompany)
      return res.status(400).json({
        message: "You can't Registered same Company",
        success: false,
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

    if (!file)
      return res.status(400).json({
        message: "logo  is  required",
        success: false,
      });
      
    const existingCompany = await company.findOne({ name });
    if (existingCompany && existingCompany._id.toString() !== req.params.id) {
      return res.status(400).json({
        message: "Company with this name already exists",
        success: false,
      });
    }
    const fileUri = getdataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updatedata = { name, description, website, location, logo };
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
        success: false,
      });

    return res.status(200).json({
      message: "Company information updated",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};
