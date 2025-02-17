import React from "react";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "./ui/table";
import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";

const AppliedJobTable = () => {
  const { allappliedjobs } = useSelector((store) => store.job);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-300 text-white py-1  px-2 text-sm  ">
            {" "}
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-500 text-white  py-1  px-2 text-sm">
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-400 text-white  py-1  px-2 text-sm">
            {" "}
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white py-1  px-2 text-sm">
            ⏳ Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-[500px] border border-gray-200 shadow-md rounded-lg">
        <TableCaption className="text-lg font-semibold text-gray-700">
          A List of Your Applied Jobs
        </TableCaption>

        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left px-4 py-2">Date</TableHead>
            <TableHead className="text-left px-4 py-2">Job Role</TableHead>
            <TableHead className="text-left px-4 py-2">Company</TableHead>
            <TableHead className="text-left px-4 py-2">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allappliedjobs?.length > 0 ? (
            allappliedjobs.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                <TableCell>{item?.job?.title || "N/A"}</TableCell>
                <TableCell>{item?.job?.company?.name || "N/A"}</TableCell>
                <TableCell>{getStatusBadge(item?.status)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center py-4 text-gray-500">
                ❌ You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
