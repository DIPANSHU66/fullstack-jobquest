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
import { Badge } from "./ui/badge";
import clsx from "clsx";

const AppliedJobTable = () => {
  const jobs = [
    {
      date: "Jan 25, 2025",
      role: "Software Engineer",
      company: "Google",
      status: "Pending",
    },
    {
      date: "Jan 20, 2025",
      role: "Frontend Developer",
      company: "Amazon",
      status: "Accepted",
    },
    {
      date: "Jan 18, 2025",
      role: "Backend Developer",
      company: "Microsoft",
      status: "Rejected",
    },
  ];

  return (
    <div className=" w-full   overflow-x-auto ">
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
          {jobs.map((job, index) => (
            <TableRow
              key={index}
              className={clsx(
                "border-b hover:bg-gray-50",
                index % 2 && "bg-gray-50"
              )}
            >
              <TableCell className="px-4 py-2">{job.date}</TableCell>
              <TableCell className="px-4 py-2 font-medium">
                {job.role}
              </TableCell>
              <TableCell className="px-4 py-2">{job.company}</TableCell>
              <TableCell className="px-4 py-2">
                <Badge
                  className={clsx(
                    "px-3 py-1 text-sm rounded-md",
                    job.status === "Accepted" && "bg-green-200 text-green-700",
                    job.status === "Rejected" && "bg-red-200 text-red-700",
                    job.status === "Pending" && "bg-yellow-200 text-yellow-700"
                  )}
                >
                  {job.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
