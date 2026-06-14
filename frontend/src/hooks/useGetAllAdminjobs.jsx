import { setalladminjobs } from "@/redux/jobSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminjobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAlljobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs/admin`,
          {
            withCredentials: true,
          },
        );
        if (res?.data?.success) {
          dispatch(setalladminjobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlljobs();
  }, []);
};

export default useGetAllAdminjobs;
