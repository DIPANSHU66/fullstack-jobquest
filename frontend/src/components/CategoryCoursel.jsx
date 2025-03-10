import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { setsearchedQuery } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Cloud Architect",
  "Machine Learning ",
  "UI/UX Designer",
  "Cybersecurity Analyst",
  "Software Engineer",
  "Database Administrator",
  "QA Engineer",
  "Game Developer",
  "AI Researcher",
  "Blockchain Developer",
  "Embedded Systems ",
  "Product Manager",
  "Systems Analyst",
];

const CategoryCoursel = () => {
  const naviagte = useNavigate();
  const dispatch = useDispatch();
  const searchjobHandler = (query) => {
    naviagte("/browse");
    dispatch(setsearchedQuery(query));
  };
  return (
    <div>
      <Carousel className="w-full max-w-xl mx-auto my-20">
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="w-full sm:basis-1/2 md:basis-1/3"
            >
              <Button
                onClick={() => searchjobHandler(cat)}
                variant="outline"
                className="rounded-full w-full p-4 text-center"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:block" />
        <CarouselNext className="hidden sm:block" />
      </Carousel>
    </div>
  );
};

export default CategoryCoursel;
