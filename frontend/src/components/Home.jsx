import React, {
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";


// =====================================
// Components
// =====================================
import Navbar from "./shared/Navbar";

import HeroSection from "./HeroSection";

import CategoryCoursel from "./CategoryCoursel";

import Latestjobs from "./Latestjobs";

import Footer from "./Footer";

import AIChatbot from "./AIChatbot";


// =====================================
// Hooks
// =====================================
import useGetAlljobs from "@/hooks/useGetAlljobs";



const Home = () => {

  const navigate = useNavigate();

  const { user } = useSelector(
    (store) => store.auth
  );


  // =====================================
  // Fetch Jobs
  // =====================================
  useGetAlljobs();


  // =====================================
  // Recruiter Redirect
  // =====================================
  useEffect(() => {

    if (user?.role === "recruiter") {

      navigate("/admin/companies");
    }

  }, [user, navigate]);


  return (
    <div
      className="
        min-h-screen
        bg-white
        overflow-x-hidden
      "
    >

      {/* Navbar */}
      <Navbar />


      {/* Hero Section */}
      <HeroSection />


      {/* Category Carousel */}
      <section className="mt-10">
        <CategoryCoursel />
      </section>


      {/* Latest Jobs */}
      <section className="mt-16">
        <Latestjobs />
      </section>





      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;