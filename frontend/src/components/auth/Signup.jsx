import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/Constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setloading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
const Signup = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneno: "",
    password: "",
    role: "student",
    file: "",
  });
  const { loading } = useSelector((store) => store.auth);

  const disptach = useDispatch();

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneno", input.phoneno);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      disptach(setloading(true));

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      disptach(setloading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-full mx-5">
        <form
          onSubmit={submitHandler}
          className="w-full sm:w-11/12 md:w-1/2 border border-gray-300 rounded-md p-6 my-10"
        >
          <h1 className="font-bold text-2xl sm:text-3xl mb-5 text-center">
            Signup
          </h1>

          <div className="mb-4">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              type="text"
              placeholder="Dipanshu Bansal"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              type="email"
              placeholder="dipanshu@gmail.com"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="phoneno">Phone No</Label>
            <Input
              id="phoneno"
              name="phoneno"
              value={input.phoneno}
              onChange={changeEventHandler}
              type="text"
              placeholder="123456XX01"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              type="password"
              placeholder="Password...Here"
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-5">
            <RadioGroup className="flex items-center gap-4 w-full">
              <div className="flex items-center space-x-2">
                <input
                  id="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  type="radio"
                  name="role"
                  value="student"
                  className="cursor-pointer"
                />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  type="radio"
                  name="role"
                  value="recruiter"
                  className="cursor-pointer"
                />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-5">
              <Label htmlFor="profile">Profile</Label>
              <Input
                id="profile"
                onChange={changeFileHandler}
                accept="image/*"
                type="file"
                className="cursor-pointer sm:w-auto w-full"
              />
            </div>
          </div>

          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Signup
            </Button>
          )}

          <div className="flex gap-2 text-sm text-center">
            <span>Already have an account?</span>
            <Link to="/login" className="text-blue-600">
              📲Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
