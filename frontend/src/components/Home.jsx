import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCoursel from "./CategoryCoursel";
import Latestjobs from "./Latestjobs";
import Footer from "./Footer";
import useGetAlljobs from "@/hooks/useGetAlljobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role == "recruiter") {
      navigate("/admin/companies");
    }
  }, []);

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
