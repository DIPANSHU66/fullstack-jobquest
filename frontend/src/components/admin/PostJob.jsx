import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import axios from "axios";
import Job from "../Job";
import { Job_API_END_POINT } from "@/utils/Constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const PostJob = () => {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyid: "",
  });
  const { allcompanies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectcompanyhandler = (value) => {
    const selectedcompany = allcompanies?.find(
      (company) => company.name.toLowerCase() == value
    );
    console.log(selectedcompany);
    setInput({ ...input, companyid: selectedcompany?._id });
  };

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await axios.post(`${Job_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success(res?.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4 text-center">Post a Job</h2>
        <form onSubmit={submithandler}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="requirement">Requirements</Label>
              <Input
                placeholder="C, C++ ....."
                id="requirements"
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Input
                id="jobType"
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="w-full mt-1"
              />
            </div>
            {allcompanies?.length > 0 && (
              <div>
                <Label htmlFor="companydi">Company</Label>

                <Select onValueChange={selectcompanyhandler}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {allcompanies?.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company?.name?.toLowerCase()}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {allcompanies.length === 0 && (
            <p className="text-xl text-red-600 font-bold text-center my-3">
              *Please Register a Company First, Before Posting a Job
            </p>
          )}

          {allcompanies?.length > 0 &&
            (loading ? (
              <Button className="mt-4 w-full text-white py-2 rounded-lg hover:bg-blue-700">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="mt-4 w-full text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Post New Job
              </Button>
            ))}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
