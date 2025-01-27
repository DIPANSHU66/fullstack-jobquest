import { Search } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
const HeroSection = () => {
  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10 px-4">
        <span className="mx-auto px-6 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm sm:text-base">
          No.1 JOB Hunting Website
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold">
          Search, Apply & <br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>
        <p className="text-sm sm:text-base max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit dolor
          asperiores animi optio ullam, sint aliquid sequi doloribus incidunt
          minima autem culpa beatae aut aliquam deserunt unde vel necessitatibus
          voluptates.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row w-full sm:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
        <input
          className="outline-none border-none w-full py-2 px-3 rounded-full text-sm sm:text-base"
          type="text"
          placeholder="Find Your Dream Job"
        />
        <Button className="rounded-r-full bg-[#6A38C2] w-full sm:w-auto py-2">
          <Search />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
