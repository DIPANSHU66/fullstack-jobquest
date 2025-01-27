import React from "react";
import LatestjobsCards from "./LatestjobsCards";
const randomjobs = [1, 1, 1, 1, 1, 1, 1];
const Latestjobs = () => {
  return (
    <div className="max-w-full sm:max-w-6xl mx-4 sm:mx-20 my-10 ">
      <h1 className="text-4xl font-bold ">
        <span className="text-[#6A38C2]">Latest &Top</span>Job Openings
      </h1>
      <div className="grid  grid-cols-1 sm:grid-cols-3 gap-4 my-5 ">
        {randomjobs.slice(0, 6).map((item, card) => (
          <LatestjobsCards></LatestjobsCards>
        ))}
      </div>
    </div>
  );
};

export default Latestjobs;
