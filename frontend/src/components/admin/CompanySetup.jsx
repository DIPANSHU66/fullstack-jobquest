import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/Constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CompanySetup = () => {
  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setloading] = useState(false);
  const params = useParams();

  const Naviagte = useNavigate("");
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput((prev) => ({ ...prev, file }));
  };
  const submithandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setloading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res?.data?.message);
        Naviagte("/admin/companies");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
      file: singleCompany?.file || null,
    });
  }, [singleCompany]);
  return (
    <div className="min-h-screen   ">
      <Navbar />

      <div className="max-w-lg mx-auto my-8 bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 sm:gap-5 p-4 sm:p-6">
          <Button
            onClick={() => Naviagte("/admin/companies")}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 font-semibold hover:bg-gray-100 px-3 py-2 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="font-bold text-lg sm:text-xl">Company Setup</h1>
        </div>

        <form onSubmit={submithandler} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-gray-700">Company Name</Label>
              <Input
                onChange={changeHandler}
                value={input.name}
                type="text"
                name="name"
                placeholder="Enter Company Name"
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
            <div>
              <Label className="text-gray-700">Description</Label>
              <Input
                onChange={changeHandler}
                value={input.description}
                type="text"
                name="description"
                placeholder="Enter Description"
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-gray-700">Website</Label>
              <Input
                onChange={changeHandler}
                value={input.website}
                type="text"
                name="website"
                placeholder="Enter Website "
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-gray-700">Location</Label>
              <Input
                onChange={changeHandler}
                value={input.location}
                type="text"
                name="location"
                placeholder="Enter Location"
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-gray-700">Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
          </div>

          {loading ? (
            <Button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition text-lg">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition text-lg"
            >
              Save & Continue
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};
export default CompanySetup;
