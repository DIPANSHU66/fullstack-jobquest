import { setallcompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/Constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchallcompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
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
