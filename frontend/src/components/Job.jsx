import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = () => {
  const navigate = useNavigate();
  const jobid = "k";
  return (
    <div className="p-4 border rounded-lg shadow-md w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p className="text-sm text-gray-500"> 2 days ago</p>
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
          <h1 className="text-lg font-semibold">Company Name</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2 ">Title</h1>
        <p className="text-sm text-gray-600 ">
          Lorem ipsum description here ....
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <Badge
          variant="ghost"
          className="text-blue-600 font-semibold px-3 py-1"
        >
          Positions
        </Badge>
        <Badge variant="ghost" className="text-red-500 font-semibold px-3 py-1">
          Part Time
        </Badge>
        <Badge
          variant="ghost"
          className="text-purple-600 font-semibold px-3 py-1"
        >
          24 LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4 ">
        <Button
          onClick={() => navigate(`/jobs/description/${jobid}`)}
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
