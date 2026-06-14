import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setallappliedjobs } from "@/redux/jobSlice";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";
import { BriefcaseBusiness, CalendarDays, Building2 } from "lucide-react";

const AppliedJobTable = () => {
  const dispatch = useDispatch();
  const { allappliedjobs = [] } = useSelector((store) => store.job);

  const withdrawHandler = async (applicationId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/application/withdraw/${applicationId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        toast.success(res.data.message);
        // Remove from local Redux state
        const updatedAppliedJobs = allappliedjobs.filter(
          (app) => app._id !== applicationId
        );
        dispatch(setallappliedjobs(updatedAppliedJobs));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to withdraw application");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge
            className="
              bg-yellow-100
              text-yellow-700
              hover:bg-yellow-100
              border
              border-yellow-200
            "
          >
            Pending
          </Badge>
        );

      case "accepted":
        return (
          <Badge
            className="
              bg-green-100
              text-green-700
              hover:bg-green-100
              border
              border-green-200
            "
          >
            Accepted
          </Badge>
        );

      case "rejected":
        return (
          <Badge
            className="
              bg-red-100
              text-red-700
              hover:bg-red-100
              border
              border-red-200
            "
          >
            Rejected
          </Badge>
        );

      default:
        return (
          <Badge
            className="
              bg-gray-100
              text-gray-700
              hover:bg-gray-100
              border
              border-gray-200
            "
          >
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",

      month: "short",

      year: "numeric",
    });
  };

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        shadow-sm
        overflow-hidden
      "
    >
      <Table>
        <TableCaption
          className="
            py-5
            text-lg
            font-semibold
            text-gray-700
          "
        >
          Your Applied Jobs
        </TableCaption>

        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                Applied Date
              </div>
            </TableHead>

            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={16} />
                Job Role
              </div>
            </TableHead>

            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                Company
              </div>
            </TableHead>

            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allappliedjobs.length > 0 ? (
            allappliedjobs.map((item) => (
              <TableRow
                key={item._id}
                className="
                    hover:bg-gray-50
                    transition-colors
                  "
              >
                <TableCell>{formatDate(item?.createdAt)}</TableCell>

                <TableCell
                  className="
                      font-medium
                      text-gray-800
                    "
                >
                  {item?.job?.title || "N/A"}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-full flex-shrink-0">
                      <AvatarImage
                        src={item?.job?.company?.logo || "https://th.bing.com/th/id/OIP.rWzUf3mZZVTBz-tQCbA_UwHaGW?w=218&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7"}
                        alt={`${item?.job?.company?.name || "Company"} logo`}
                        className="rounded-full object-cover"
                      />
                    </Avatar>
                    <span className="font-medium text-gray-800">
                      {item?.job?.company?.name || "N/A"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(item?.status)}</TableCell>
                <TableCell className="text-right">
                   <button
                     onClick={() => withdrawHandler(item._id)}
                     className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
                   >
                     Withdraw
                   </button>
                 </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="
                    text-center
                    py-14
                  "
              >
                <div
                  className="
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                >
                  <BriefcaseBusiness
                    size={55}
                    className="
                        text-gray-300
                        mb-4
                      "
                  />

                  <h2
                    className="
                        text-xl
                        font-semibold
                        text-gray-700
                      "
                  >
                    No Applications Yet
                  </h2>

                  <p
                    className="
                        text-gray-500
                        mt-2
                      "
                  >
                    Start applying to jobs to track your applications.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
