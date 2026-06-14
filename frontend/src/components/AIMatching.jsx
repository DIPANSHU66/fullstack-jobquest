import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Sparkles, AlertTriangle, Briefcase, MapPin, DollarSign, Calendar, ChevronDown, ChevronUp, BrainCircuit, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const AIMatching = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [expandedJob, setExpandedJob] = useState(null);

  // Auth protection
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "student") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/match`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setMatches(res.data.matches);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Could not analyze matches. Make sure your profile has skills or a resume uploaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "student") {
      // Fetch matches automatically on mount if skills exist
      const hasSkills = user.profile?.skills?.length > 0;
      const hasResume = Boolean(user.profile?.resume);
      if (hasSkills || hasResume) {
        fetchMatches();
      }
    }
  }, [user]);

  const toggleExpand = (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-indigo-600 bg-indigo-50 border-indigo-200";
  };

  const hasProfileData = user?.profile?.skills?.length > 0 || user?.profile?.resume;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 opacity-20 blur-3xl rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500 opacity-15 blur-3xl rounded-full -ml-20 -mb-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} className="animate-pulse" /> AI recommendation
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                AI Resume-Job Matcher
              </h1>
              <p className="text-purple-200 text-sm md:text-base max-w-xl">
                We generate vector embeddings of your resume and profile description, search active job vectors, and use RAG to determine your perfect fit.
              </p>
            </div>

            {hasProfileData && (
              <Button
                onClick={fetchMatches}
                disabled={loading}
                className="bg-white hover:bg-purple-100 text-indigo-950 font-bold px-6 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {loading ? "Re-Analyzing..." : "Analyze & Match Now ✨"}
              </Button>
            )}
          </div>
        </div>

        {/* Profile Incompletion State */}
        {!hasProfileData && (
          <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-md">
            <AlertTriangle className="mx-auto text-amber-500 mb-4" size={50} />
            <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
            <p className="text-gray-600 mt-2 mb-6">
              To use the AI Match Engine, you need to list your skills or upload a resume. Our AI uses this data to map vector similarities with active jobs.
            </p>
            <Link to="/profile">
              <Button className="bg-purple-600 hover:bg-purple-700 px-6 rounded-xl text-white font-medium">
                Update Profile & Resume
              </Button>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-6">Running Match Algorithms...</h3>
            <p className="text-gray-500 mt-2 text-sm">Generating vector embeddings and running similarity analysis.</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center shadow-sm max-w-2xl mx-auto mb-8">
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-red-500 mt-1">Please try completing/re-saving your profile info, then try again.</p>
          </div>
        )}

        {/* Matches Results List */}
        {hasProfileData && !loading && !error && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BrainCircuit className="text-purple-600" size={22} />
              Your Top AI Job Recommendations ({matches.length})
            </h2>

            {matches.length === 0 ? (
              <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
                <Briefcase size={50} className="mx-auto text-gray-300" />
                <h3 className="text-xl font-bold text-gray-800 mt-4">No Matches Available</h3>
                <p className="text-gray-500 mt-2">There are no active jobs available in the portal to match against.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map(({ job, matchPercentage, explanation }) => {
                  const isExpanded = expandedJob === job._id;
                  const scoreColor = getScoreColor(matchPercentage);

                  return (
                    <div
                      key={job._id}
                      className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      {/* Job Header Info */}
                      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors">
                              <Link to={`/jobs/description/${job._id}`}>{job.title}</Link>
                            </h3>
                            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium px-2 py-0.5 border border-indigo-150">
                              {job.jobType}
                            </Badge>
                          </div>
                          <p className="text-purple-900 font-semibold text-sm">
                            {job.company?.name || "Independent Company"}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign size={14} /> {job.salary} LPA
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} /> Posted {job.createdAt?.split("T")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Match Score circular representation */}
                        <div className="flex items-center gap-4">
                          <div className={`px-4 py-2 border rounded-xl flex flex-col items-center justify-center ${scoreColor}`}>
                            <span className="text-2xl font-black">{matchPercentage}%</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider">AI Match</span>
                          </div>

                          <Button
                            onClick={() => toggleExpand(job._id)}
                            variant="ghost"
                            className="p-2 h-10 w-10 rounded-full hover:bg-gray-100 text-gray-500"
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </Button>
                        </div>
                      </div>

                      {/* Expandable RAG analysis */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50/70 p-6 space-y-4">
                          <div className="flex items-start gap-2.5">
                            <BrainCircuit className="text-purple-600 mt-1 flex-shrink-0" size={18} />
                            <div className="space-y-1 flex-1">
                              <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider">
                                AI Fit Analysis (RAG Engine)
                              </h4>
                              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-sm">
                                <ReactMarkdown>{explanation}</ReactMarkdown>
                              </div>
                            </div>
                          </div>

                          {/* Quick Requirements list */}
                          <div className="pt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                              Job Requirements
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {job.requirements?.map((req, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="bg-white border-gray-200 text-gray-700 px-2 py-0.5 text-[11px] font-medium"
                                >
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Action footer */}
                          <div className="pt-3 border-t flex justify-end gap-2">
                            <Link to={`/jobs/description/${job._id}`}>
                              <Button variant="outline" className="rounded-xl border-gray-200 text-sm">
                                View Full Job Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatching;
