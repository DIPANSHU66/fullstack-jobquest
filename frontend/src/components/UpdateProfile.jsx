import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/Constant";
import { setuser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfile = ({ open, setopen }) => {
  const dispatch = useDispatch();

  const [loading, setloading] = useState(false);

  const { user } = useSelector((store) => store.auth);

  const [input, setinput] = useState({
    fullname: user?.fullname,
    email: user?.email,
    phoneno: user?.phoneno,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.map((skill) => skill),
    file: user?.profile?.resume,
  });

  const changeEventHandler = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const filechangehandler = (e) => {
    const file = e.target.files?.[0];
    setinput({ ...input, file });
  };

  const submithandler = async (e) => {
    e.preventDefault();

    setloading(true);
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneno", input.phoneno);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        console.log(res.data.user);
        dispatch(setuser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || "something went wrong");
    } finally {
      setloading(false);
      setopen(false);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={() => setopen(false)}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={submithandler} className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <input
                onChange={changeEventHandler}
                value={input.fullname}
                className="col-span-3 input"
                type="text"
                id="name"
                name="fullname"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <input
                onChange={changeEventHandler}
                value={input.email}
                className="col-span-3 input"
                type="email"
                id="email"
                name="email"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <input
                onChange={changeEventHandler}
                value={input.phoneno}
                className="col-span-3 input"
                type="text"
                id="number"
                name="phoneno"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <input
                onChange={changeEventHandler}
                value={input.bio}
                className="col-span-3 input"
                type="text"
                id="bio"
                name="bio"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <input
                onChange={changeEventHandler}
                value={input.skills}
                className="col-span-3 input"
                type="text"
                id="skills"
                name="skills"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="resume" className="text-right">
                Resume
              </Label>
              <input
                onChange={filechangehandler}
                className="col-span-3 input"
                type="file"
                id="resume"
                name="file"
              />
            </div>

            <DialogFooter>
              {loading ? (
                <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                  Please Wait
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Update
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfile;
