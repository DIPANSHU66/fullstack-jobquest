import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setsearchcompanybytext } from "@/redux/companySlice";
const Companies = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const [input, setinput] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setsearchcompanybytext(input));
  }, [input]);
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Input
            className="w-full sm:w-auto"
            placeholder="Filter By Name"
            onChange={(e) => setinput(e.target.value)}
          />
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="w-full sm:w-auto"
          >
            New Company
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
