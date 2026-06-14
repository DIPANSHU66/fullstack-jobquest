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
  UserPlus,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setloading,
} from "@/redux/authSlice";





const Signup = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, user } =
    useSelector((store) => store.auth);


  // =====================================
  // Form State
  // =====================================
  const [input, setInput] = useState({

    fullname: "",

    email: "",

    phoneno: "",

    password: "",

    role: "student",

    file: null,
  });


  // =====================================
  // Handle Input Change
  // =====================================
  const changeEventHandler = (e) => {

    setInput({

      ...input,

      [e.target.name]:
        e.target.value,
    });
  };


  // =====================================
  // Handle File Change
  // =====================================
  const changeFileHandler = (e) => {

    setInput({

      ...input,

      file:
        e.target.files?.[0],
    });
  };


  // =====================================
  // Submit Handler
  // =====================================
  const submitHandler = async (e) => {

    e.preventDefault();


    // Basic Validation
    if (
      !input.fullname ||
      !input.email ||
      !input.phoneno ||
      !input.password
    ) {

      toast.error(
        "Please fill all fields"
      );

      return;
    }


    const formData = new FormData();

    formData.append(
      "fullname",
      input.fullname
    );

    formData.append(
      "email",
      input.email
    );

    formData.append(
      "phoneno",
      input.phoneno
    );

    formData.append(
      "password",
      input.password
    );

    formData.append(
      "role",
      input.role
    );

    if (input.file) {

      formData.append(
        "file",
        input.file
      );
    }


    try {

      dispatch(setloading(true));

      const res = await axios.post(

        `${import.meta.env.VITE_API_URL}/user/register`,

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          withCredentials: true,
        }
      );


      if (res.data.success) {

        toast.success(
          res.data.message
        );

        navigate("/login");
      }

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.message
      );

    } finally {

      dispatch(setloading(false));
    }
  };


  // =====================================
  // Redirect If Logged In
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


      {/* Signup Container */}
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
            max-w-lg
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
              <UserPlus size={24} />
            </div>

            <h1
              className="
                text-3xl
                font-bold
                text-gray-900
              "
            >
              Create Account
            </h1>

            <p
              className="
                text-gray-500
                mt-2
              "
            >
              Start your career journey
              with AI-powered hiring.
            </p>

          </div>


          {/* Form */}
          <form
            onSubmit={submitHandler}

            className="
              space-y-5
            "
          >

            {/* Full Name */}
            <div>

              <Label>
                Full Name
              </Label>

              <Input

                name="fullname"

                value={input.fullname}

                onChange={
                  changeEventHandler
                }

                type="text"

                placeholder="Dipanshu Bansal"

                className="mt-2"
              />

            </div>


            {/* Email */}
            <div>

              <Label>
                Email
              </Label>

              <Input

                name="email"

                value={input.email}

                onChange={
                  changeEventHandler
                }

                type="email"

                placeholder="dipanshu@gmail.com"

                className="mt-2"
              />

            </div>


            {/* Phone */}
            <div>

              <Label>
                Phone Number
              </Label>

              <Input

                name="phoneno"

                value={input.phoneno}

                onChange={
                  changeEventHandler
                }

                type="text"

                placeholder="+91 9876543210"

                className="mt-2"
              />

            </div>


            {/* Password */}
            <div>

              <Label>
                Password
              </Label>

              <Input

                name="password"

                value={input.password}

                onChange={
                  changeEventHandler
                }

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
                  gap-6
                  mt-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <input
                    type="radio"

                    name="role"

                    value="student"

                    checked={
                      input.role === "student"
                    }

                    onChange={
                      changeEventHandler
                    }

                    className="
                      cursor-pointer
                    "
                  />

                  <Label>
                    Student
                  </Label>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <input
                    type="radio"

                    name="role"

                    value="recruiter"

                    checked={
                      input.role === "recruiter"
                    }

                    onChange={
                      changeEventHandler
                    }

                    className="
                      cursor-pointer
                    "
                  />

                  <Label>
                    Recruiter
                  </Label>

                </div>

              </RadioGroup>

            </div>


            {/* Profile Image */}
            <div>

              <Label>
                Profile Image
              </Label>

              <Input

                type="file"

                accept="image/*"

                onChange={
                  changeFileHandler
                }

                className="
                  mt-2
                  cursor-pointer
                "
              />

            </div>


            {/* Button */}
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
                  Signup
                </Button>
              )
            }


            {/* Login Link */}
            <div
              className="
                text-center
                text-sm
                text-gray-600
              "
            >

              Already have an account?{" "}

              <Link
                to="/login"

                className="
                  text-[#6A38C2]
                  font-medium
                  hover:underline
                "
              >
                Login
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Signup;