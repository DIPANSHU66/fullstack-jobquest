import { setSinglecompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/Constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetCompanybyid = (companyid) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchsinglecompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyid}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSinglecompany(res.data.newcompany));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchsinglecompany();
  }, [companyid]);
};
export default useGetCompanybyid;
