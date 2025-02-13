import React from "react";
import { Badge } from "./ui/badge";

const LatestjobsCards = ({ job }) => {
  return (
    <div className="p-4 rounded-lg shadow-lg bg-white border border-gray-200 cursor-pointer w-full max-w-sm mx-auto">
      <div className="mb-2">
        <h1 className="text-lg font-medium">{job?.company?.name}</h1>
        <p className="text-gray-600 text-sm">India</p>
      </div>

      <div className="mb-3  ">
        <h1 className="text-base font-bold">{job?.title}</h1>
        <p className="text-gray-500 text-sm">{job?.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Badge
          variant="ghost"
          className="text-blue-600 font-semibold px-3 py-1"
        >
          {job?.position}
        </Badge>
        <Badge variant="ghost" className="text-red-500 font-semibold px-3 py-1">
          {job?.jobType}
        </Badge>
        <Badge
          variant="ghost"
          className="text-purple-600 font-semibold px-3 py-1"
        >
          {job?.salary}
        </Badge>
      </div>
    </div>
  );
};

export default LatestjobsCards;
