import React from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useSelector } from "react-redux";

const Browse = () => {
  const { alljobs } = useSelector((store) => store.job);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <h1 className=" text-xl font-bold text-gray-700 mb-4">
          Search Results({alljobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  mt-5">
          {alljobs.map((job, index) => {
            return (
              <div key={index}>
                <Job job={job} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
