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

import { useDispatch } from "react-redux";

import { motion } from "framer-motion";

import {
  Code2,
  Database,
  Brain,
  ShieldCheck,
  Smartphone,
  Cloud,
} from "lucide-react";

import { setsearchedQuery }
from "@/redux/jobSlice";



// =====================================
// Categories
// =====================================
const categories = [
  {
    title: "Frontend Developer",
    icon: <Code2 size={18} />,
  },

  {
    title: "Backend Developer",
    icon: <Database size={18} />,
  },

  {
    title: "Data Science",
    icon: <Brain size={18} />,
  },

  {
    title: "Graphic Designer",
    icon: <Code2 size={18} />,
  },

  {
    title: "Full Stack Developer",
    icon: <Database size={18} />,
  },

  {
    title: "DevOps Engineer",
    icon: <Cloud size={18} />,
  },

  {
    title: "Mobile App Developer",
    icon: <Smartphone size={18} />,
  },

  {
    title: "Machine Learning",
    icon: <Brain size={18} />,
  },

  {
    title: "Cybersecurity Analyst",
    icon: <ShieldCheck size={18} />,
  },

  {
    title: "AI Researcher",
    icon: <Brain size={18} />,
  },

  {
    title: "Embedded Systems",
    icon: <Code2 size={18} />,
  },
];



const CategoryCarousel = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // =====================================
  // Search Category
  // =====================================
  const searchjobHandler = (query) => {

    dispatch(setsearchedQuery(query));

    navigate("/browse");
  };


  return (
    <section
      className="
        py-16
        px-4
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
        "
      >

        {/* Header */}
        <div className="text-center mb-10">

          <h2
            className="
              text-3xl
              sm:text-4xl
              font-bold
              text-gray-900
            "
          >
            Explore Job Categories
          </h2>

          <p
            className="
              mt-3
              text-gray-500
              max-w-2xl
              mx-auto
            "
          >
            Discover opportunities across
            trending technologies and
            industries.
          </p>

        </div>


        {/* Carousel */}
        <Carousel
          className="
            w-full
            relative
          "
        >

          <CarouselContent>

            {
              categories.map((cat) => (

                <CarouselItem

                  key={cat.title}

                  className="
                    basis-1/2
                    md:basis-1/3
                    lg:basis-1/4
                  "
                >

                  <motion.div

                    whileHover={{
                      y: -5,
                    }}

                    transition={{
                      duration: 0.2,
                    }}
                  >

                    <Button

                      onClick={() =>
                        searchjobHandler(
                          cat.title
                        )
                      }

                      variant="outline"

                      className="
                        w-full
                        h-[100px]
                        rounded-2xl
                        border
                        bg-white
                        hover:bg-[#6A38C2]
                        hover:text-white
                        transition-all
                        duration-300
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        shadow-sm
                      "
                    >

                      {cat.icon}

                      <span
                        className="
                          text-sm
                          font-medium
                          text-center
                        "
                      >
                        {cat.title}
                      </span>

                    </Button>

                  </motion.div>

                </CarouselItem>
              ))
            }

          </CarouselContent>


          {/* Navigation */}
          <CarouselPrevious
            className="
              hidden
              md:flex
            "
          />

          <CarouselNext
            className="
              hidden
              md:flex
            "
          />

        </Carousel>

      </div>
    </section>
  );
};

export default CategoryCarousel;