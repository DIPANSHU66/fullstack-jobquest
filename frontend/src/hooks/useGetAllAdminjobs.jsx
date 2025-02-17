import { setalladminjobs } from "@/redux/jobSlice";
import { Job_API_END_POINT } from "@/utils/Constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminjobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAlljobs = async () => {
      try {
        const res = await axios.get(`${Job_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        if (res?.data?.success) {
          dispatch(setalladminjobs(res.data.newjobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlljobs();
  }, []);
};

export default useGetAllAdminjobs;
