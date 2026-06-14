import React from "react";

import { Badge } from "./ui/badge";

import { useNavigate } from "react-router-dom";

import {
  MapPin,
  BriefcaseBusiness,
  IndianRupee,
  Building2,
} from "lucide-react";


const LatestJobsCards = ({ job }) => {
  const navigate = useNavigate();

  // Prevent rendering crash
  if (!job) return null;

  // Salary formatting
  const formattedSalary = job?.salary
    ? `${job.salary} LPA`
    : "Not Disclosed";

  // Description truncation
  const shortDescription =
    job?.description?.length > 90
      ? `${job.description.slice(0, 90)}...`
      : job?.description;

  return (
    <div
      onClick={() => navigate(`/jobs/description/${job._id}`)}
      className="
        group
        bg-white
        border
        border-gray-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
        w-full
      "
    >

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">

        <div
          className="
            h-12
            w-12
            rounded-full
            bg-gray-100
            flex
            items-center
            justify-center
          "
        >
          {
            job?.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Building2 className="text-gray-500" size={22} />
            )
          }
        </div>

        <div>
          <h1 className="font-semibold text-lg text-gray-800">
            {job?.company?.name || "Unknown Company"}
          </h1>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} />
            <span>{job?.location || "India"}</span>
          </div>
        </div>
      </div>


      {/* Job Info */}
      <div className="mb-4">

        <h2
          className="
            text-xl
            font-bold
            text-gray-900
            group-hover:text-indigo-600
            transition-colors
          "
        >
          {job?.title}
        </h2>

        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {shortDescription}
        </p>
      </div>


      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">

        <Badge
          variant="secondary"
          className="flex items-center gap-1"
        >
          <BriefcaseBusiness size={14} />
          {job?.position} Openings
        </Badge>

        <Badge
          variant="outline"
          className="text-red-500 border-red-200"
        >
          {job?.jobType}
        </Badge>

        <Badge
          variant="outline"
          className="text-green-600 border-green-200 flex items-center gap-1"
        >
          <IndianRupee size={14} />
          {formattedSalary}
        </Badge>

      </div>


      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">

        <span className="text-xs text-gray-400">
          Posted recently
        </span>

        <button
          className="
            text-sm
            font-medium
            text-indigo-600
            hover:underline
          "
        >
          View Details →
        </button>

      </div>
    </div>
  );
};

export default LatestJobsCards;