import { setallappliedjobs } from "@/redux/jobSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAplliedjobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchaplliedJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/application`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          dispatch(setallappliedjobs(res?.data?.applications));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchaplliedJobs();
  }, []);
};

export default useGetAplliedjobs;
