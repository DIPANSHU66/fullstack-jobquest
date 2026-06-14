import { setSinglecompany } from "@/redux/companySlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetCompanybyid = (companyid) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchsinglecompany = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/company/${companyid}`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          dispatch(setSinglecompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchsinglecompany();
  }, [companyid]);
};
export default useGetCompanybyid;
