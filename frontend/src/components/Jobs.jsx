import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./shared/FilterCard";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import useGetAllAdminjobs from "@/hooks/useGetAllAdminjobs";
import { setserachedfilter } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useGetAllAdminjobs();

  const { alljobs, serachedfilter } = useSelector((store) => store.job);
  const [filterjobs, setfilterjobs] = useState(alljobs);
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredJobs = alljobs.filter((job) => {
      const matchesLocation = job?.location
        ?.toLowerCase()
        .includes(serachedfilter.toLowerCase());
      const matchesRole = job?.role
        ?.toLowerCase()
        .includes(serachedfilter.toLowerCase());
      const matchesJobType = job?.jobType
        ?.toLowerCase()
        .includes(serachedfilter.toLowerCase());
      const matchesTitle = job?.title
        ?.toLowerCase()
        .includes(serachedfilter.toLowerCase());

      return matchesLocation || matchesRole || matchesJobType || matchesTitle;
    });

    if (filteredJobs) {
      setfilterjobs(filteredJobs);
    } else {
      setfilterjobs(alljobs);
    }
  }, [alljobs, serachedfilter]);

  useEffect(() => {
    return () => {
      dispatch(setserachedfilter(""));
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

      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20% h-[88vh] overflow-y-auto scrollbar-hide">
            <FilterCard />
          </div>

          {alljobs.length <= 0 ? (
            <span>Job Not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5 scrollbar-hide">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filterjobs.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
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
