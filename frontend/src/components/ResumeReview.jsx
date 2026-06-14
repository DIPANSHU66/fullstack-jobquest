import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Award, FileText, Compass, AlertCircle, RefreshCw } from "lucide-react";

const ResumeReview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  // Route protection
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "student") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchReview = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/chatbot/resume-review`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not retrieve resume feedback. Complete your profile first.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "student") {
      fetchReview();
    }
  }, [user]);

  const hasResumeData = user?.profile?.skills?.length > 0 || user?.profile?.resume;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-1 bg-white/20 border border-white/10 rounded-full px-3 py-0.5 text-xs font-semibold">
              <Sparkles size={12} /> AI Auditor
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              AI Resume Review & Audit
            </h1>
            <p className="text-indigo-200 text-sm md:text-base max-w-xl">
              Scan your profile text, bio, and resume buffer to verify spelling, format alignment, and identify critical technology skills gaps.
            </p>
          </div>
        </div>

        {/* Profile Incompletion State */}
        {!hasResumeData && (
          <div className="bg-white border rounded-2xl p-10 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800">Add Profile Details</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Please enter some skills or upload a resume to allow our AI tool to check and grade your resume document.
            </p>
            <Button onClick={() => navigate("/profile")} className="bg-purple-600 hover:bg-purple-700 text-white">
              Update My Profile
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-semibold text-gray-800 mt-6 animate-pulse">Auditing Profile Quality...</h3>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center shadow-sm max-w-xl mx-auto mb-8">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Review Results */}
        {hasResumeData && report && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Ring Card */}
            <div className="md:col-span-1 bg-white border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-gray-800 text-md uppercase tracking-wider mb-6">
                Profile Score
              </h3>

              {/* Progress Circle SVG */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600 transition-all duration-1000 ease-out"
                    strokeWidth="3"
                    strokeDasharray={`${report.score}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900">{report.score}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Grade</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-6 italic">
                Updated in real-time matching bio density, profile skills list, and document metrics.
              </p>

              <Button
                onClick={fetchReview}
                variant="outline"
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl text-xs font-bold"
              >
                <RefreshCw size={12} /> Re-Scan Profile
              </Button>
            </div>

            {/* Recommendations & Strengths */}
            <div className="md:col-span-2 space-y-6">
              {/* Strengths Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-md uppercase tracking-wider flex items-center gap-2">
                  <Award className="text-emerald-500" size={20} /> Highlighted Strengths
                </h3>
                <ul className="space-y-2.5">
                  {report.strengths?.map((str, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-emerald-500 text-md font-extrabold mt-0.5">✓</span>
                      {str}
                    </li>
                  ))}
                  {report.strengths?.length === 0 && (
                    <p className="text-sm text-gray-400">Complete your profile to build your strengths list.</p>
                  )}
                </ul>
              </div>

              {/* Skills Gap Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-md uppercase tracking-wider flex items-center gap-2">
                  <FileText className="text-amber-500" size={20} /> Missing Industry Skills
                </h3>
                <p className="text-xs text-gray-500">
                  We scanned candidate properties against requirements of hot industry openings and identified these gaps:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {report.missingSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700"
                    >
                      + {skill}
                    </span>
                  ))}
                  {report.missingSkills?.length === 0 && (
                    <span className="text-sm text-gray-500">Congratulations! No skills gaps identified.</span>
                  )}
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-md uppercase tracking-wider flex items-center gap-2">
                  <Compass className="text-purple-600" size={20} /> Key Recommendations
                </h3>
                <ul className="space-y-3">
                  {report.recommendations?.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                  {report.recommendations?.length === 0 && (
                    <p className="text-sm text-gray-400">No suggestions needed. Your profile is looking complete!</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeReview;
