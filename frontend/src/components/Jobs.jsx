import React from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./shared/FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";

const Jobs = () => {
  const { alljobs } = useSelector((store) => store.job);
  return (
    <div>
      <Navbar></Navbar>

      <div className="max-w-7xl mx-auto mt-5 ">
        <div className="flex gap-5">
          <div className="w-20%   h-[88vh] overflow-y-auto scrollbar-hide ">
            <FilterCard></FilterCard>
          </div>

          {alljobs.length <= 0 ? (
            <span>Job Not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5  scrollbar-hide ">
              <div className="grid  grid-cols-1 sm:grid-cols-3 gap-4 ">
                {alljobs.map((job, index) => (
                  <div key={index}>
                    <Job  job={job}></Job>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
