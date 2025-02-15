import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/Constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSinglecompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [companyname, setcompanyname] = useState();
  const registernewcompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        {
          companyname,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        console.log(res.data);
        toast.success(res?.data?.message);
        const companyid = res?.data?.newcompany?._id;
        dispatch(setSinglecompany(res.data?.newcompany));
        Navigate(`/admin/companies/${companyid}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="text-center sm:text-left mb-6">
          <h1 className="text-3xl font-semibold">Your Company Name</h1>
          <p className="text-gray-500">
            What would you like to name your company? You can change it later.
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="company-name" className="block text-sm font-medium">
            Company Name
          </Label>
          <Input
            onChange={(e) => setcompanyname(e.target.value)}
            value={companyname}
            id="company-name"
            type="text"
            name="companyname"
            className="mt-1 w-full sm:w-3/4 lg:w-1/2"
            placeholder="e.g., JobPortal, Microsoft"
          />
        </div>

        <div className="flex justify-center sm:justify-start gap-4 mt-8">
          <Button
            onClick={() => Navigate("/admin/companies")}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={registernewcompany} className="w-full sm:w-auto">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
