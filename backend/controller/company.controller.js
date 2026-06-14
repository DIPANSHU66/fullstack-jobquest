import { company as Company } from "../Models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


// ======================================
// Register Company
// ======================================
export const registerCompany = async (req, res) => {
  try {
    const { companyName: nameCamel, companyname: nameLower } = req.body;
    const companyName = nameCamel || nameLower;

    if (!companyName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // Case-insensitive duplicate check
    const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const existingCompany = await Company.findOne({
      name: { $regex: `^${escapeRegex(companyName.trim())}$`, $options: "i" },
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists",
      });
    }

    const newCompany = await Company.create({
      name: companyName.trim(),
      userId: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company: newCompany,
      newcompany: newCompany,
    });

  } catch (error) {
    console.error("Register Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Get All Companies Of Recruiter
// ======================================
export const getCompanies = async (req, res) => {
  try {
    const userId = req.id;

    const companies = await Company.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {
    console.error("Get Companies Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Get Company By ID
// ======================================
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const foundCompany = await Company.findById(companyId);

    if (!foundCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company: foundCompany,
    });

  } catch (error) {
    console.error("Get Company By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ======================================
// Update Company Information
// ======================================
export const updateCompanyInformation = async (req, res) => {
  try {
    const companyId = req.params.id;

    const {
      name,
      description,
      website,
      location,
    } = req.body;

    // Find company
    const foundCompany = await Company.findById(companyId);

    if (!foundCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Authorization check
    if (foundCompany.userId.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Duplicate company name check (only if the name has actually changed)
    if (name && name.trim().toLowerCase() !== foundCompany.name.toLowerCase()) {
      const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const existingCompany = await Company.findOne({
        name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" },
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: "Company with this name already exists",
        });
      }
    }

    // Website validation
    if (website && website.trim()) {
      const websiteRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

      if (!websiteRegex.test(website.trim())) {
        return res.status(400).json({
          success: false,
          message: "Invalid website URL",
        });
      }
    }

    // Update fields
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Company name cannot be empty",
        });
      }
      foundCompany.name = name.trim();
    }
    if (description !== undefined) foundCompany.description = description.trim();
    if (website !== undefined) foundCompany.website = website.trim();
    if (location !== undefined) foundCompany.location = location.trim();

    // Optional logo upload
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "job-portal/companies",
        }
      );

      foundCompany.logo = cloudResponse.secure_url;
    }

    await foundCompany.save();

    return res.status(200).json({
      success: true,
      message: "Company information updated successfully",
      company: foundCompany,
    });

  } catch (error) {
    console.error("Update Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};