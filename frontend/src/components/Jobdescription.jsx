import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Jobdescription = () => {
  const isAplied = false;

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="flex flex-col sm:flex-row items-start justify-between flex-wrap gap-6 sm:gap-0">
        <div className="sm:w-3/5">
          <h1 className="font-bold text-2xl mb-3">Frontend Developer</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ghost" className="text-blue-600 font-semibold px-3 py-1">
              Positions
            </Badge>
            <Badge variant="ghost" className="text-red-500 font-semibold px-3 py-1">
              Part Time
            </Badge>
            <Badge variant="ghost" className="text-purple-600 font-semibold px-3 py-1">
              24 LPA
            </Badge>
          </div>
        </div>

        <div className="sm:w-2/5 flex-shrink-0">
          <Button
            className={`${
              isAplied
                ? "bg-gray-700 cursor-not-allowed text-gray-100"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
            } w-full sm:w-auto rounded-lg px-6 py-3 transition-all duration-300 transform active:scale-95`}
            disabled={isAplied}
          >
            {isAplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
        Job Description
      </h1>

      <div className="my-4">
        <h1 className="font-bold my-1">Role:<span className="pl-4 font-normal text-gray-800">Frontend Developer</span></h1>
        <h1 className="font-bold my-1">Location:<span className="pl-4 font-normal text-gray-800">Hyderabad</span></h1>
        <h1 className="font-bold my-1">Description:<span className="pl-4 font-normal text-gray-800">Lorem ipsum is the</span></h1>
        <h1 className="font-bold my-1">Experience:<span className="pl-4 font-normal text-gray-800">2 yrs</span></h1>
        <h1 className="font-bold my-1">Salary:<span className="pl-4 font-normal text-gray-800">12 LPA</span></h1>
        <h1 className="font-bold my-1">Total Applicants:<span className="pl-4 font-normal text-gray-800">4</span></h1>
        <h1 className="font-bold my-1">Posted Date:<span className="pl-4 font-normal text-gray-800">17-07-2024</span></h1>
      </div>
    </div>
  );
};

export default Jobdescription;
