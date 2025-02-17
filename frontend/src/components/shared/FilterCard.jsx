import React, { useState } from "react";

import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setserachedfilter } from "@/redux/jobSlice";

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
    array: [
      "Frontend",
      "Backend",
      "Fullstack",
      "Hardware",
      "Software",
      "SDE", // Software Development Engineer
      "Software Development",
      "Data Analyst",
      "Business Analyst",
      "Product Manager",
      "DevOps",
      "UI/UX Designer",
      "Machine Learning Engineer",
      "Data Scientist",
      "Quality Assurance",
      "Cybersecurity Analyst",
      "Cloud Engineer",
      "Systems Engineer",
      "Database Administrator",
      "Network Engineer",
      "Technical Writer",
      "Project Manager",
      "Sales Engineer",
      "Marketing Specialist",
    ],
  },
  {
    filterType: "Job Type",
    array: ["Full-time", "Part-time", "Internship", "Contract"],
  },
];

const FilterCard = () => {
  const [selectedvalue, setselectedvalue] = useState("");
  const dispatch = useDispatch();
  const changehandler = (value) => {
    setselectedvalue(value);
    dispatch(setserachedfilter(value));
  };
  return (
    <div className="max-w-xs sm:max-w-md md:max-w-lg mx-auto px-4 py-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Filter Jobs</h1>
      <hr className="mt-3 mb-4" />
      <RadioGroup value={selectedvalue} onValueChange={changehandler}>
        {filterdata.map((data, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-medium mb-2">{data.filterType}</h2>
            {data.array.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem
                  id={index}
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
