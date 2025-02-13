import React, { useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSinglejob } from "@/redux/jobSlice";
import { APPLYCATION_API_END_POINT, Job_API_END_POINT } from "@/utils/Constant";
import { toast } from "sonner";

const Jobdescription = () => {
  const params = useParams();

  const jobid = params.id;

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);

  const { singlejob } = useSelector((store) => store.job);
  const isAplied =
    singlejob?.applications?.some(
      (application) => application.applicant == user?._id
    ) || false;

  const applyjobhandler = async () => {
    try {
      const res = await axios.get(
        `${APPLYCATION_API_END_POINT}/apply/${jobid}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchsinglejob = async () => {
      try {
        const res = await axios.get(`${Job_API_END_POINT}/get/${jobid}`, {
          withCredentials: true,
        });
        if (res?.data?.success) {
          dispatch(setSinglejob(res.data.newjob));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchsinglejob();
  }, [jobid, dispatch, user]);

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="flex flex-col sm:flex-row items-start justify-between flex-wrap gap-6 sm:gap-0">
        <div className="sm:w-3/5">
          <h1 className="font-bold text-2xl mb-3">{singlejob?.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="ghost"
              className="text-blue-600 font-semibold px-3 py-1"
            >
              {singlejob?.position}
            </Badge>
            <Badge
              variant="ghost"
              className="text-red-500 font-semibold px-3 py-1"
            >
              {singlejob?.jobType}
            </Badge>
            <Badge
              variant="ghost"
              className="text-purple-600 font-semibold px-3 py-1"
            >
              {singlejob?.salary} LPA
            </Badge>
          </div>
        </div>

        <div className="sm:w-2/5 flex-shrink-0">
          <Button
            onClick={isAplied ? null : applyjobhandler}
            className={`${
              isAplied
                ? "bg-gray-700 cursor-not-allowed text-gray-100"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
            } w-full sm:w-auto rounded-lg px-6 py-3 transition-all duration-300 transform active:scale-95`}
            disabled={isAplied}
          >
            {isAplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
        {singlejob?.title}
      </h1>

      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.jobType}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.experiencelevel} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.salary}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Jobdescription;
