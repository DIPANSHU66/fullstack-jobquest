import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminjobsTable = () => {
  const { alladminjobs, searchjobbytext } = useSelector((store) => store.job);
  const [filterjobs, setfilterjobs] = useState(alladminjobs);
  const navigate = useNavigate();
  useEffect(() => {
    const filteredjob =
      alladminjobs?.length >= 0 &&
      alladminjobs.filter((job) => {
        if (!searchjobbytext) {
          return true;
        }
        return (
          job?.title?.toLowerCase().includes(searchjobbytext.toLowerCase()) ||
          job?.company?.name
            .toLowerCase()
            .includes(searchjobbytext.toLowerCase())
        );
      });
    setfilterjobs(filteredjob);
  }, [alladminjobs, searchjobbytext]);

  return (
    <Table>
      <TableCaption>A List Of Your Recent Posted Jobs</TableCaption>
      <TableHeader>
        <TableRow>
          <TableCell>Company Name</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Date</TableCell>
          <TableCell className="text-right">Action</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filterjobs?.length == 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              You haven't registered any job yet.
            </TableCell>
          </TableRow>
        ) : (
          filterjobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/companies/${job._id}`)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2 "
                    >
                      <Eye className="w-4"></Eye>
                      <span>Applicants</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AdminjobsTable;
