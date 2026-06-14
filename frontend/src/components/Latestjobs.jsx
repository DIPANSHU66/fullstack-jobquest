import React from "react";

import { useSelector } from "react-redux";

import { motion } from "framer-motion";

import LatestJobsCards from "./LatestjobsCards";

import { BriefcaseBusiness } from "lucide-react";


const LatestJobs = () => {
  const { alljobs = [] } = useSelector(
    (store) => store.job
  );

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-14
      "
    >

      {/* Heading */}
      <div className="text-center mb-10">

        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-indigo-100
            text-indigo-700
            text-sm
            font-medium
            mb-4
          "
        >
          <BriefcaseBusiness size={18} />
          Latest Opportunities
        </div>

        <h1
          className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            font-extrabold
            tracking-tight
            text-gray-900
          "
        >
          Latest & Top{" "}

          <span className="text-[#6A38C2]">
            Job Openings
          </span>
        </h1>

        <p
          className="
            mt-4
            text-gray-600
            max-w-2xl
            mx-auto
            text-sm
            sm:text-base
          "
        >
          Discover premium opportunities from
          top companies and startups hiring now.
        </p>
      </div>


      {/* Empty State */}
      {
        alljobs.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
              text-center
            "
          >

            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="No Jobs"
              className="w-28 h-28 opacity-80"
            />

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              No Jobs Available
            </h2>

            <p className="text-gray-500 mt-2">
              Please check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            {
              alljobs
                ?.slice(0, 6)
                .map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    <LatestJobsCards job={job} />
                  </motion.div>
                ))
            }

          </div>
        )
      }

    </section>
  );
};

export default LatestJobs;