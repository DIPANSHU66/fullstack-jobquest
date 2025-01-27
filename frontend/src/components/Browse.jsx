import React from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";

const randomjobs = [1, 2, 3, 4, 5, 6];

const Browse = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <h1 className=" text-xl font-bold text-gray-700 mb-4">
          Search Results({randomjobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  mt-5">
          {randomjobs.map((data, index) => {
            return (
              <div key={index}>
                <Job />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
