import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";

const CompaniesTable = () => {
  const { allcompanies, searchcompanybytext } = useSelector(
    (store) => store.company
  );
  const [filtercompany, setfiltercompany] = useState(allcompanies);
  useEffect(() => {
    const filteredcompany =
      allcompanies?.length > 0 &&
      allcompanies.filter((company) => {
        if (!searchcompanybytext) {
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchcompanybytext.toLowerCase());
      });
    setfiltercompany(filteredcompany);
  }, [searchcompanybytext, allcompanies]);
  return (
    <Table>
      <TableCaption>A List Of Your Recent Registered Companies</TableCaption>
      <TableHeader>
        <TableRow>
          <TableCell>Logo</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell className="text-right">Action</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtercompany.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              You haven't registered any company yet.
            </TableCell>
          </TableRow>
        ) : (
          filtercompany?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={company.logo} />
                </Avatar>
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Edit2 className="w-4" />
                      <span>Edit</span>
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

export default CompaniesTable;
