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
import { setloading, setuser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setloading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
    
        dispatch(setuser(res.data.userdata));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-full mx-5">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-11/12 md:w-1/2 border border-gray-300 rounded-md p-4 my-10"
        >
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={input.email}
              onChange={handleChange}
              type="email"
              placeholder="dipanshu@gmail.com"
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              name="password"
              value={input.password}
              onChange={handleChange}
              type="password"
              placeholder="Password...Here"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <input
                  id="student"
                  checked={input.role === "student"}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  type="radio"
                  name="role"
                  value="recruiter"
                  className="cursor-pointer"
                />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Login
            </Button>
          )}

          <div className="flex gap-2">
            <span className="text-sm">Doesn't have an account?</span>
            <div>
              <Link to="/signup" className="text-blue-600">
                🔓➡️ Signup
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
