import React, {
  useEffect,
} from "react";

import { useDispatch, useSelector }
from "react-redux";

import { useNavigate }
from "react-router-dom";

import { motion }
from "framer-motion";

import {
  SearchX,
  BriefcaseBusiness,
} from "lucide-react";


// =====================================
// Components
// =====================================
import Navbar from "./shared/Navbar";

import Job from "./Job";


// =====================================
// Hooks
// =====================================
import useGetAlljobs
from "@/hooks/useGetAlljobs";


// =====================================
// Redux
// =====================================
import {
  setsearchedQuery,
} from "@/redux/jobSlice";



const Browse = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector(
    (store) => store.auth
  );

  const { alljobs = [] } =
    useSelector((store) => store.job);


  // =====================================
  // Fetch Jobs
  // =====================================
  useGetAlljobs();


  // =====================================
  // Cleanup Search Query
  // =====================================
  useEffect(() => {

    return () => {

      dispatch(setsearchedQuery(""));
    };

  }, [dispatch]);


  // =====================================
  // Protect Route
  // =====================================
  useEffect(() => {

    if (!user) {

      navigate("/");
    }

  }, [user, navigate]);


  return (
    <div
      className="
        min-h-screen
        bg-gray-50
      "
    >

      {/* Navbar */}
      <Navbar />


      {/* Main Container */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
        "
      >

        {/* Header */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-8
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
              Search Results
            </h1>

            <p
              className="
                text-gray-500
                mt-1
              "
            >
              Found{" "}

              <span
                className="
                  font-semibold
                  text-[#6A38C2]
                "
              >
                {alljobs.length}
              </span>{" "}

              available jobs
            </p>

          </div>

        </div>


        {/* Empty State */}
        {
          alljobs.length === 0 ? (

            <div
              className="
                bg-white
                rounded-2xl
                border
                p-12
                text-center
                shadow-sm
              "
            >

              <SearchX
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
                Try searching with different
                keywords or filters.
              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
              "
            >

              {
                alljobs.map((job) => (

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

      </div>
    </div>
  );
};

export default Browse;