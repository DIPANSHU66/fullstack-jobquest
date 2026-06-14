import React, { useState } from "react";

import { Search, Sparkles } from "lucide-react";

import { Button } from "./ui/button";

import { useDispatch } from "react-redux";

import { setsearchedQuery } from "@/redux/jobSlice";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";



const HeroSection = () => {

  const [query, setQuery] =
    useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();


  // =====================================
  // Search Handler
  // =====================================
  const searchjobHandler = () => {

    dispatch(setsearchedQuery(query));

    navigate("/browse");
  };


  return (
    <section
      className="
        relative
        overflow-hidden
        py-20
        px-4
        sm:px-6
        lg:px-8
      "
    >

      {/* Background Blur */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[500px]
          bg-purple-200
          opacity-20
          blur-3xl
          rounded-full
          -z-10
        "
      />


      <div
        className="
          max-w-5xl
          mx-auto
          text-center
        "
      >

        {/* Badge */}
        <motion.div

          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="
            inline-flex
            items-center
            gap-2
            px-5
            py-2
            rounded-full
            bg-purple-100
            text-[#6A38C2]
            font-medium
            text-sm
            mb-6
          "
        >

          <Sparkles size={16} />

          AI-Powered Job Portal

        </motion.div>


        {/* Heading */}
        <motion.h1

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.6,
          }}

          className="
            text-4xl
            sm:text-5xl
            lg:text-6xl
            font-extrabold
            tracking-tight
            leading-tight
            text-gray-900
          "
        >

          Search, Apply & <br />

          Get Your{" "}

          <span className="text-[#6A38C2]">
            Dream Jobs
          </span>

        </motion.h1>


        {/* Subtitle */}
        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.2,
            duration: 0.5,
          }}

          className="
            mt-6
            text-gray-600
            max-w-2xl
            mx-auto
            text-base
            sm:text-lg
            leading-relaxed
          "
        >

          Discover AI-powered job
          recommendations, resume
          analysis, interview preparation,
          and premium opportunities from
          top companies and startups.

        </motion.p>


        {/* Search Bar */}
        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.3,
            duration: 0.5,
          }}

          className="
            mt-10
            flex
            flex-col
            sm:flex-row
            items-center
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-xl
            overflow-hidden
            max-w-3xl
            mx-auto
          "
        >

          {/* Input */}
          <div
            className="
              flex
              items-center
              flex-1
              w-full
              px-4
            "
          >

            <Search
              className="text-gray-400"
              size={20}
            />

            <input

              type="text"

              value={query}

              onChange={(e) =>
                setQuery(e.target.value)
              }

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchjobHandler();
                }
              }}

              placeholder="Search jobs, skills, companies..."

              className="
                w-full
                px-4
                py-4
                outline-none
                text-gray-700
                text-sm
                sm:text-base
              "
            />

          </div>


          {/* Button */}
          <Button

            onClick={searchjobHandler}

            className="
              w-full
              sm:w-auto
              rounded-none
              sm:rounded-l-none
              sm:rounded-r-2xl
              bg-[#6A38C2]
              hover:bg-[#5b30a6]
              px-8
              py-6
              text-white
              text-sm
              font-medium
            "
          >
            Search Jobs
          </Button>

        </motion.div>


        {/* Stats */}
        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.5,
          }}

          className="
            mt-12
            grid
            grid-cols-2
            sm:grid-cols-4
            gap-6
            text-center
          "
        >

          <div>
            <h2 className="text-2xl font-bold text-[#6A38C2]">
              10K+
            </h2>

            <p className="text-gray-500 text-sm">
              Active Jobs
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#6A38C2]">
              5K+
            </h2>

            <p className="text-gray-500 text-sm">
              Companies
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#6A38C2]">
              AI
            </h2>

            <p className="text-gray-500 text-sm">
              Resume Assistant
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#6A38C2]">
              24/7
            </h2>

            <p className="text-gray-500 text-sm">
              Career Support
            </p>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;