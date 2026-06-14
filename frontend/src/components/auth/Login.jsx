import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../shared/Navbar";

import { Label } from "../ui/label";

import { Input } from "../ui/input";

import { RadioGroup } from "../ui/radio-group";

import { Button } from "../ui/button";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import { toast } from "sonner";

import {
  Loader2,
  LogIn,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setloading,
  setuser,
} from "@/redux/authSlice";




const Login = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, user } =
    useSelector((store) => store.auth);


  // =====================================
  // Form State
  // =====================================
  const [input, setInput] = useState({

    email: "",

    password: "",

    role: "student",
  });


  // =====================================
  // Handle Input Change
  // =====================================
  const handleChange = (e) => {

    setInput({

      ...input,

      [e.target.name]:
        e.target.value,
    });
  };


  // =====================================
  // Handle Login
  // =====================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      dispatch(setloading(true));

      const res = await axios.post(

        `${import.meta.env.VITE_API_URL}/user/login`,

        input,

        {
          headers: {
            "Content-Type":
              "application/json",
          },

          withCredentials: true,
        }
      );


      // =====================================
      // Success
      // =====================================
      if (res.data.success) {

        // Save User In Redux
        dispatch(
          setuser(res.data.user)
        );

        toast.success(
          res.data.message
        );


        // =================================
        // Redirect Based On Role
        // =================================
        if (
          res.data.user.role
          === "recruiter"
        ) {

          navigate(
            "/admin/companies"
          );

        } else {

          navigate("/");
        }
      }

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.message
        || "Login failed"
      );

    } finally {

      dispatch(setloading(false));
    }
  };


  // =====================================
  // Redirect If Already Logged In
  // =====================================
  useEffect(() => {

    if (user) {

      if (user.role === "recruiter") {

        navigate("/admin/companies");

      } else {

        navigate("/");
      }
    }

  }, [user, navigate]);


  return (
    <div
      className="
        min-h-screen
        bg-gray-50
      "
    >

      {/* Navbar */}
      <Navbar />


      {/* Login Container */}
      <div
        className="
          flex
          items-center
          justify-center
          px-4
          py-10
        "
      >

        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-2xl
            shadow-lg
            border
            p-8
          "
        >

          {/* Heading */}
          <div className="text-center mb-8">

            <div
              className="
                inline-flex
                items-center
                justify-center
                w-14
                h-14
                rounded-full
                bg-[#6A38C2]
                text-white
                mb-4
              "
            >
              <LogIn size={24} />
            </div>

            <h1
              className="
                text-3xl
                font-bold
                text-gray-900
              "
            >
              Welcome Back
            </h1>

            <p
              className="
                text-gray-500
                mt-2
              "
            >
              Login to continue your
              career journey.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={handleSubmit}

            className="
              space-y-5
            "
          >

            {/* Email */}
            <div>

              <Label>Email</Label>

              <Input

                name="email"

                value={input.email}

                onChange={handleChange}

                type="email"

                placeholder="dipanshu@gmail.com"

                className="mt-2"
              />

            </div>


            {/* Password */}
            <div>

              <Label>Password</Label>

              <Input

                name="password"

                value={input.password}

                onChange={handleChange}

                type="password"

                placeholder="Enter password"

                className="mt-2"
              />

            </div>


            {/* Role */}
            <div>

              <Label>
                Select Role
              </Label>

              <RadioGroup
                className="
                  flex
                  items-center
                  gap-6
                  mt-3
                "
              >

                {/* Student */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <input
                    id="student"

                    checked={
                      input.role === "student"
                    }

                    onChange={handleChange}

                    type="radio"

                    name="role"

                    value="student"

                    className="
                      cursor-pointer
                    "
                  />

                  <Label htmlFor="student">
                    Student
                  </Label>

                </div>


                {/* Recruiter */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <input
                    id="recruiter"

                    checked={
                      input.role === "recruiter"
                    }

                    onChange={handleChange}

                    type="radio"

                    name="role"

                    value="recruiter"

                    className="
                      cursor-pointer
                    "
                  />

                  <Label htmlFor="recruiter">
                    Recruiter
                  </Label>

                </div>

              </RadioGroup>

            </div>


            {/* Submit Button */}
            {
              loading ? (

                <Button
                  disabled

                  className="
                    w-full
                    bg-[#6A38C2]
                  "
                >

                  <Loader2
                    className="
                      mr-2
                      h-4
                      w-4
                      animate-spin
                    "
                  />

                  Please Wait

                </Button>

              ) : (

                <Button
                  type="submit"

                  className="
                    w-full
                    bg-[#6A38C2]
                    hover:bg-[#5b30a6]
                  "
                >
                  Login
                </Button>
              )
            }


            {/* Signup Link */}
            <div
              className="
                text-center
                text-sm
                text-gray-600
              "
            >

              Don’t have an account?{" "}

              <Link
                to="/signup"

                className="
                  text-[#6A38C2]
                  font-medium
                  hover:underline
                "
              >
                Signup
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;