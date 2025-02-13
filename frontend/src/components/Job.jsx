import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysagofunction = (mongodbtime) => {
    const createdAt = new Date(mongodbtime);
    const currentTime = new Date();
    const timedifference = currentTime - createdAt;

    return Math.floor(timedifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p className="text-sm text-gray-500">
          {daysagofunction(job?.createdAt) == 0
            ? "Today"
            : ` ${daysagofunction(job?.createdAt)} }  days ago`}
        </p>
        <Button size="icon" variant="outline" className="rounded-full">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 my-4">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src="https://th.bing.com/th/id/OIP.rWzUf3mZZVTBz-tQCbA_UwHaGW?w=218&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7"
            alt="Company Logo"
          />
        </Avatar>
        <div className="flex flex-col text-left">
          <h1 className="text-lg font-semibold">{job?.company?.name}</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2 ">{job?.title}</h1>
        <p className="text-sm text-gray-600 ">{job?.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <Badge variant="ghost" className="text-blue-600 font-bold px-3 py-1">
          {job?.position}
        </Badge>
        <Badge variant="ghost" className="text-red-600 font-bold px-3 py-1">
          {job?.jobType}
        </Badge>
        <Badge variant="ghost" className="text-purple-600 font-bold px-3 py-1">
          {job?.salary} LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4 ">
        <Button
          onClick={() => navigate(`/jobs/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        <Button className="bg-[#7209b7]">Save For Latest</Button>
      </div>
    </div>
  );
};

export default Job;
