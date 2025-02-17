import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AdminjobsTable from "./AdminjobsTable";
import useGetAllAdminjobs from "@/hooks/useGetAllAdminjobs";
import { useDispatch } from "react-redux";
import { setsearchjobbytext } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
const Adminjobs = () => {
  const navigate = useNavigate();
  useGetAllAdminjobs();
  const [input, setinput] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setsearchjobbytext(input));
  }, [input]);
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Input
            onChange={(e) => setinput(e.target.value)}
            className="w-full sm:w-auto"
            placeholder="Filter By Name"
          />
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="w-full sm:w-auto"
          >
            New Jobs
          </Button>
        </div>
        <AdminjobsTable></AdminjobsTable>
      </div>
    </div>
  );
};

export default Adminjobs;
