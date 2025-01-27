import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const filterdata = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"],
  },
  {
    filterType: "Industry",
    array: ["IT", "Finance", "Healthcare", "Education", "Manufacturing"],
  },
  {
    filterType: "Salary Range",
    array: ["<3 LPA", "3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"],
  },
  {
    filterType: "Job Type",
    array: ["Full-time", "Part-time", "Internship", "Contract"],
  },
];

const FilterCard = () => {
  return (
    <div className="max-w-xs sm:max-w-md md:max-w-lg mx-auto px-4 py-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Filter Jobs</h1>
      <hr className="mt-3 mb-4" />
      <RadioGroup>
        {filterdata.map((data, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-medium mb-2">{data.filterType}</h2>
            {data.array.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem
                  value={item}
                  className="h-4 w-4   border-2 border-gray-600"
                />
                <Label className="text-sm">{item}</Label>
              </div>
            ))}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
