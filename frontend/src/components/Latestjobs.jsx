import React from "react";
import LatestjobsCards from "./LatestjobsCards";
import { useSelector } from "react-redux";

const Latestjobs = () => {
  const { alljobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-full sm:max-w-6xl mx-4 sm:mx-20 my-10 ">
      <h1 className="text-4xl font-bold ">
        <span className="text-[#6A38C2]">Latest &Top</span>Job Openings
      </h1>
      <div className="grid  grid-cols-1 sm:grid-cols-3 gap-4 my-5 ">
        {alljobs?.slice(0, 6).map((item, index) => (
          <LatestjobsCards key={index}job={item}  ></LatestjobsCards>
        ))}
      </div>
    </div>
  );
};

export default Latestjobs;
