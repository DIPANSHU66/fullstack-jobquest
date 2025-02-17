import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLYCATION_API_END_POINT } from "@/utils/Constant";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statushandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLYCATION_API_END_POINT}/status/${id}/update`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const shortlistingstatus = ["accepted", "rejected","pending"];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[600px] md:w-full border rounded-lg">
        <TableCaption className="text-center text-gray-600">
          A List Of Your Recently Applied Applicants
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-3">Full Name</TableHead>
            <TableHead className="p-3">Email</TableHead>
            <TableHead className="p-3">Contact</TableHead>
            <TableHead className="p-3">Resume</TableHead>
            <TableHead className="p-3">Date</TableHead>
            <TableHead className="p-3 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="p-3">{item?.applicant?.fullname}</TableCell>
              <TableCell className="p-3 truncate max-w-[150px]">
                {item?.applicant?.email}
              </TableCell>
              <TableCell className="p-3">{item?.applicant?.phoneno}</TableCell>
              <TableCell className="p-3 text-blue-600 font-semibold cursor-pointer">
                {item?.applicant?.profile?.resume ? (
                  <a
                    href={item?.applicant?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.applicant?.profile?.resumeorignalname}
                  </a>
                ) : (
                  <span>NA</span>
                )}
              </TableCell>
              <TableCell className="p-3">
                {item?.applicant?.createdAt?.split("T")[0]}
              </TableCell>
              <TableCell className="p-3 text-right">
                <Popover>
                  <PopoverTrigger className="cursor-pointer">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2 shadow-lg bg-white border rounded-lg">
                    {shortlistingstatus.map((status, i) => (
                      <div
                        key={i}
                        className="     px-3 py-1 hover:bg-gray-200 rounded cursor-pointer"
                        onClick={() => statushandler(status, item?._id)}
                      >
                        {status}
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
