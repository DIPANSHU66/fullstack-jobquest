import { setallcompanies } from "@/redux/companySlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchallcompany = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/company`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          dispatch(setallcompanies(res?.data?.companies));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchallcompany();
  }, []);
};
export default useGetAllCompanies;
