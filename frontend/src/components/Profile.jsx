import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfile from "./UpdateProfile";
import { useSelector } from "react-redux";
import useGetAplliedjobs from "@/hooks/useGetAplliedjobs";

const Profile = () => {
  useGetAplliedjobs();

  const [open, setopen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isresume = Boolean(user?.profile?.resume);

  const resumeUrl = user?.profile?.resume;
  const imageUrl = resumeUrl ? resumeUrl.replace(".pdf", ".jpg") : "#";

  return (
    <div className="overflow-x-auto scrollbar-hide ">
      <Navbar />
      <div
        className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-6 shadow-lg
     "
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-gray-300 rounded-full">
            <AvatarImage
              src="https://th.bing.com/th/id/OIP.rWzUf3mZZVTBz-tQCbA_UwHaGW?w=218&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7"
              alt="User profile image"
              className="rounded-full"
            />
          </Avatar>

          <div className="text-center md:text-left flex-1">
            <h1 className="font-medium text-xl md:text-2xl">
              {user?.fullname || "User Name"}
            </h1>
            <p className="text-sm text-gray-500">
              {user?.profile?.bio != "undefined" ? user?.profile?.bio : ""}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Button
              onClick={() => setopen(true)}
              variant="outline"
              className="flex items-center text-sm gap-2 px-4 py-2"
            >
              <Pen className="h-5 w-5" />
              Edit
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 my-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-5 w-5" />
            <span className="text-sm">{user?.email || " "}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Contact className="h-5 w-5" />
            <span className="text-sm">{user?.phoneno || " "}</span>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="font-semibold text-lg mb-2">Skills</h1>
          <div className=" sm:w-[100vh]  grid grid-cols-2 sm:grid-cols-3 gap-3">
            {user?.profile?.skills?.length ? (
              user?.profile?.skills?.map((skill, index) => (
                <Badge key={index} className="px-3 py-1 text-sm text-center">
                  {skill != "undefined" ? skill : "No Skills Yet"}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">No skills listed</span>
            )}
          </div>
        </div>
        <div className="  grid w-full max-w-sm items-center gap-1.5 mt-4  ">
          <Label className="text-md font-bold">Resume</Label>
          {isresume ? (
            <a className="text-blue-500" target="blank" href={imageUrl || "#"}>
              📂 {user?.profile?.resumeorignalname}
            </a>
          ) : (
            <span>Not Found</span>
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl  ">
        <h1 className="font-bold">Applied Jobs</h1>

        <AppliedJobTable></AppliedJobTable>
      </div>
      <UpdateProfile open={open} setopen={setopen} />
    </div>
  );
};

export default Profile;
