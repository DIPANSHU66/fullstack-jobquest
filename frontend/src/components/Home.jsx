import React from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCoursel from "./CategoryCoursel";
import Latestjobs from "./Latestjobs";
import Footer from "./Footer";
import useGetAlljobs from "@/hooks/useGetAlljobs";
const Home = () => {
  useGetAlljobs();
  return (
    <div>
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <CategoryCoursel></CategoryCoursel>
      <Latestjobs></Latestjobs>
      <Footer></Footer>
    </div>
  );
};

export default Home;
