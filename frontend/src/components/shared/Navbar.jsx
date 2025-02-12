import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/Constant";
import { setuser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profilephoto = user?.profile?.profilephoto??  "https://github.com/shadcn.png";
  console.log(profilephoto);
  const logouthandler = async () => {
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data?.Success) {
        console.log(res.data);
        dispatch(setuser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between mx-5 sm:mx-auto max-w-6xl h-16">
        <div className="flex justify-between w-full sm:w-auto">
          <h1 className="text-2xl font-bold">
            Job <span className="text-[#f83002]">Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-5 sm:gap-12 w-full sm:w-auto justify-between">
          <ul className="flex font-medium items-center gap-5">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/Browse">Browse</Link>
            </li>
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6a3fb4] hover:bg-[#5d03f7] w-full sm:w-auto">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={profilephoto} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-full sm:w-80">
                <div className="flex gap-4 space-y-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={profilephoto} />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Patel Marnstack</h4>
                    <p className="text-sm text-muted-foreground">
                      lorem ipsum{" "}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col my-2 gap-3 text-gray-600">
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2 />
                    <Link to="/Profile">
                      <Button variant="link">View Profile</Button>
                    </Link>
                  </div>
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />

                    <Button onClick={logouthandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
