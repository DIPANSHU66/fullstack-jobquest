import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLYCATION_API_END_POINT } from "@/utils/Constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setallapplicants } from "@/redux/ApllicantSlice";
const Apllicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  useEffect(() => {
    const fetchallApllicants = async () => {
      try {
        const res = await axios.get(
          `${APPLYCATION_API_END_POINT}/${params.id}/applicants`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setallapplicants(res?.data?.checkjob));
          console.log(res.data.checkjob);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchallApllicants();
  }, []);
  return (
    <div>
      <Navbar></Navbar>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          Apllicants ({applicants?.applications?.length})
        </h1>
        <ApplicantsTable></ApplicantsTable>
      </div>
    </div>
  );
};

export default Apllicants;
