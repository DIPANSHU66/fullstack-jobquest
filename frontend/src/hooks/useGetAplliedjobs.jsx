import { setallappliedjobs } from "@/redux/jobSlice";
import { APPLYCATION_API_END_POINT } from "@/utils/Constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAplliedjobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchaplliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLYCATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setallappliedjobs(res?.data?.application));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchaplliedJobs();
  }, []);
};

export default useGetAplliedjobs;
