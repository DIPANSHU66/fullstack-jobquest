import React from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setsearchedQuery } from "@/redux/jobSlice";
import { useEffect } from "react";
import useGetAlljobs from "@/hooks/useGetAlljobs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Browse = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useGetAlljobs();
  const { alljobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setsearchedQuery(""));
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

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
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Job job={job} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
