import { setAllJobs } from "@/redux/jobSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAlljobs = () => {
  const { searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAlljobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs?keyword=${searchedQuery}`,
          {
            withCredentials: true,
          },
        );
        if (res?.data?.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlljobs();
  }, [searchedQuery, dispatch]);
};

export default useGetAlljobs;
