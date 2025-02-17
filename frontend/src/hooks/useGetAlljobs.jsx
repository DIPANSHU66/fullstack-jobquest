import { setAllJobs } from "@/redux/jobSlice";
import { Job_API_END_POINT } from "@/utils/Constant";
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
          `${Job_API_END_POINT}/get?keyword=${searchedQuery}`,
          {
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlljobs();
  }, []);
};

export default useGetAlljobs;
