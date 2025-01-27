import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex justify-between items-center px-4 mt-4 bg-gray-600 text-white py-4">
      <p className="text-sm">
        Job Portal @2025 Your Company. All rights reserved.
      </p>
      <div className="flex space-x-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-xl hover:text-blue-500" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-xl hover:text-blue-400" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="text-xl hover:text-blue-600" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
