import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "./shared/Navbar";
import FilterCard from "./shared/FilterCard";
import Job from "./Job";

import { useDispatch, useSelector } from "react-redux";

import useGetAlljobs from "@/hooks/useGetAlljobs";

import { setserachedfilter } from "@/redux/jobSlice";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import {
  Search,
  BriefcaseBusiness,
} from "lucide-react";


const Jobs = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector(
    (store) => store.auth
  );

  const {
    alljobs = [],
    serachedfilter,
  } = useSelector(
    (store) => store.job
  );

  const [searchTerm, setSearchTerm] =
    useState(serachedfilter || "");

  // Fetch jobs
  useGetAlljobs();


  // ===============================
  // Auth Protection
  // ===============================
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);


  // ===============================
  // Cleanup Search Filter
  // ===============================
  useEffect(() => {
    return () => {
      dispatch(setserachedfilter(""));
    };
  }, [dispatch]);


  // ===============================
  // Debounced Redux Search
  // ===============================
  useEffect(() => {

    const timer = setTimeout(() => {
      dispatch(setserachedfilter(searchTerm));
    }, 400);

    return () => clearTimeout(timer);

  }, [searchTerm, dispatch]);


  // ===============================
  // Optimized Filtering
  // ===============================
  const filteredJobs = useMemo(() => {

    if (!serachedfilter) return alljobs;

    return alljobs.filter((job) => {

      const search =
        serachedfilter.toLowerCase();

      return (
        job?.location
          ?.toLowerCase()
          .includes(search) ||

        job?.title
          ?.toLowerCase()
          .includes(search) ||

        job?.jobType
          ?.toLowerCase()
          .includes(search) ||

        job?.description
          ?.toLowerCase()
          .includes(search) ||

        job?.company?.name
          ?.toLowerCase()
          .includes(search)
      );
    });

  }, [alljobs, serachedfilter]);


  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
        "
      >

        {/* Header */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-6
          "
        >

          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-gray-900
              "
            >
              Find Your Dream Job
            </h1>

            <p className="text-gray-500 mt-1">
              Explore top opportunities
              from startups and companies.
            </p>
          </div>


          {/* Search Bar */}
          <div
            className="
              relative
              w-full
              md:w-[350px]
            "
          >

            <Search
              className="
                absolute
                left-3
                top-3
                text-gray-400
              "
              size={18}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }

              placeholder="Search jobs..."

              className="
                w-full
                pl-10
                pr-4
                py-3
                rounded-xl
                border
                border-gray-200
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                bg-white
              "
            />
          </div>
        </div>


        {/* Main Layout */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-4
            gap-6
          "
        >

          {/* Sidebar */}
          <aside
            className="
              lg:col-span-1
              h-fit
              sticky
              top-20
            "
          >
            <FilterCard />
          </aside>


          {/* Jobs Section */}
          <main className="lg:col-span-3">

            {/* Results Count */}
            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >

              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                {filteredJobs.length} Jobs Found
              </h2>

            </div>


            {/* Empty State */}
            {
              filteredJobs.length === 0 ? (

                <div
                  className="
                    bg-white
                    rounded-2xl
                    p-10
                    text-center
                    border
                  "
                >

                  <BriefcaseBusiness
                    size={60}
                    className="
                      mx-auto
                      text-gray-300
                    "
                  />

                  <h2
                    className="
                      mt-5
                      text-2xl
                      font-bold
                      text-gray-800
                    "
                  >
                    No Jobs Found
                  </h2>

                  <p
                    className="
                      text-gray-500
                      mt-2
                    "
                  >
                    Try changing your filters
                    or search keywords.
                  </p>

                </div>

              ) : (

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-5
                  "
                >

                  {
                    filteredJobs.map((job) => (

                      <motion.div
                        key={job._id}

                        initial={{
                          opacity: 0,
                          y: 20,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        transition={{
                          duration: 0.3,
                        }}
                      >

                        <Job job={job} />

                      </motion.div>
                    ))
                  }

                </div>
              )
            }

          </main>

        </div>

      </div>
    </div>
  );
};

export default Jobs;