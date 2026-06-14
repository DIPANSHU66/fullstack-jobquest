import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Terminal, Award, MessageSquareCode, CheckCircle2, PlayCircle, Loader2 } from "lucide-react";
import { setuser } from "@/redux/authSlice";

const InterviewPrep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  // States
  const [step, setStep] = useState("select"); // select, interview, finished
  const [role, setRole] = useState("frontend");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]); // Array of { question, answer, score, feedback, modelAnswer }
  const [lastGrading, setLastGrading] = useState(null); // { score, feedback, modelAnswer }

  // Route protection
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "student") {
      navigate("/");
    }
  }, [user, navigate]);

  const startInterview = async () => {
    setLoading(true);
    setResults([]);
    setLastGrading(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot/interview/start`,
        { role },
        { withCredentials: true }
      );
      if (res.data.success) {
        setSessionId(res.data.sessionId);
        setCurrentQuestion(res.data.question);
        setQuestionIndex(res.data.questionIndex);
        setTotalQuestions(res.data.totalQuestions);
        setStep("interview");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot/interview/answer`,
        {
          sessionId,
          role,
          questionIndex,
          answer: answer.trim()
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const grading = {
          question: currentQuestion,
          answer: answer.trim(),
          score: res.data.score,
          feedback: res.data.feedback,
          modelAnswer: res.data.modelAnswer
        };

        setResults((prev) => [...prev, grading]);
        setLastGrading(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = async () => {
    if (lastGrading?.isFinished) {
      const finalScore = getFinalScore();
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/chatbot/interview/save-score`,
          { role, score: finalScore },
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setuser(res.data.user));
        }
      } catch (err) {
        console.error("Save interview score error:", err);
      }
      setStep("finished");
    } else {
      setCurrentQuestion(lastGrading.nextQuestion);
      setQuestionIndex(lastGrading.questionIndex);
      setAnswer("");
      setLastGrading(null);
    }
  };

  const getFinalScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, item) => sum + item.score, 0);
    return Math.round((total / (results.length * 10)) * 100);
  };

  const getHiringVerdict = (score) => {
    if (score >= 85) return { text: "Highly Recommended (Hire)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 65) return { text: "Recommended (Good Fit)", color: "text-purple-700 bg-purple-50 border-purple-200" };
    return { text: "Needs Improvement", color: "text-amber-700 bg-amber-50 border-amber-200" };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/10 rounded-full px-3 py-0.5 text-xs font-semibold">
              <Sparkles size={12} /> Interactive Simulator
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              AI Mock Interview Prep
            </h1>
            <p className="text-slate-200 text-sm md:text-base max-w-xl">
              Simulate full-length technical interview rounds, type your solutions, and receive instant marks, recommendations, and sample responses.
            </p>
          </div>
        </div>

        {/* STEP 1: Select Track */}
        {step === "select" && (
          <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <PlayCircle className="text-purple-600" size={24} /> Select Your Interview Track
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "frontend", title: "Frontend Engineer", desc: "React.js, Javascript, DOM, Styling" },
                { id: "backend", title: "Backend Engineer", desc: "Node.js, Express, DB scaling, APIs" },
                { id: "fullstack", title: "Fullstack Developer", desc: "Security, databases, WebSocket, deploys" },
                { id: "ai", title: "AI & RAG Engineer", desc: "Embeddings, vector indexing, models" }
              ].map((track) => (
                <div
                  key={track.id}
                  onClick={() => setRole(track.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    role === track.id
                      ? "border-purple-600 bg-purple-50/50 shadow-sm"
                      : "border-gray-200 hover:border-purple-300 bg-white"
                  }`}
                >
                  <h4 className="font-bold text-gray-900">{track.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{track.desc}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Starting Session...
                </>
              ) : (
                "Initiate Technical Interview 🚀"
              )}
            </Button>
          </div>
        )}

        {/* STEP 2: Active Interview */}
        {step === "interview" && (
          <div className="space-y-6">
            {/* Terminal Panel */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-slate-100 border border-slate-800">
              {/* Terminal Title Bar */}
              <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="text-purple-400" size={18} />
                  <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">
                    INTERVIEW_TERMINAL // QUESTION {questionIndex + 1} OF {totalQuestions}
                  </span>
                </div>
                <Badge className="bg-purple-600/30 text-purple-300 border border-purple-500/20 capitalize font-medium rounded-md">
                  {role} Track
                </Badge>
              </div>

              {/* Terminal Body */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Question Prompt:</p>
                  <p className="text-lg font-bold font-mono tracking-tight text-white leading-relaxed">
                    {currentQuestion}
                  </p>
                </div>

                {!lastGrading ? (
                  <div className="space-y-3 pt-2">
                    <label className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block">Your Solution:</label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full h-44 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-slate-200 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                    />
                    <div className="flex justify-end pt-1">
                      <Button
                        onClick={submitAnswer}
                        disabled={submitting || !answer.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-5 rounded-xl text-xs font-bold shadow-md"
                      >
                        {submitting ? "Analyzing Response..." : "Submit Answer ⏎"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Answer Evaluation Block */
                  <div className="border-t border-slate-800 pt-6 mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Left score circle */}
                      <div className="md:col-span-1 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">Evaluation</span>
                        <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex items-center justify-center bg-slate-950">
                          <span className="text-2xl font-black font-mono text-white">{lastGrading.score}<span className="text-xs text-slate-500">/10</span></span>
                        </div>
                      </div>

                      {/* Right Feedback details */}
                      <div className="md:col-span-3 space-y-4">
                        <div className="space-y-1">
                          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider block">AI Interviewer Feedback:</span>
                          <p className="text-sm font-mono text-slate-300 leading-relaxed">
                            {lastGrading.feedback}
                          </p>
                        </div>

                        <div className="space-y-1 bg-slate-950/30 border border-slate-800/50 p-4 rounded-xl">
                          <span className="text-purple-400 font-mono text-[10px] uppercase tracking-wider block font-bold">Ideal Model Answer Summary:</span>
                          <p className="text-xs font-mono text-slate-400 leading-relaxed mt-1">
                            {lastGrading.modelAnswer}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={nextQuestion}
                        className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        {lastGrading.isFinished ? "View Performance Summary" : "Next Question ➔"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Final Score Page */}
        {step === "finished" && (
          <div className="bg-white border rounded-3xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <CheckCircle2 className="mx-auto text-emerald-500" size={54} />
            
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-gray-800">Interview Completed!</h2>
              <p className="text-gray-500 text-sm">Congratulations on finishing your mock round.</p>
            </div>

            {/* Score box */}
            <div className="bg-slate-50 border rounded-2xl p-6 max-w-sm mx-auto flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Final Performance index</span>
              <span className="text-5xl font-black text-indigo-950">{getFinalScore()}%</span>
              
              <div className={`mt-4 px-4 py-1.5 border rounded-full text-xs font-bold ${getHiringVerdict(getFinalScore()).color}`}>
                {getHiringVerdict(getFinalScore()).text}
              </div>
            </div>

            {/* Breakdowns list */}
            <div className="text-left space-y-4 pt-4 border-t">
              <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Question Performance Breakdown:</h3>
              <div className="space-y-3">
                {results.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 border rounded-xl flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-700">Q{idx + 1}: {item.question}</p>
                      <p className="text-[11px] text-gray-500 italic">Feedback: {item.feedback}</p>
                    </div>
                    <Badge className="bg-slate-200 text-slate-800 font-bold flex-shrink-0">
                      {item.score}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                onClick={() => setStep("select")}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl"
              >
                Start New Session
              </Button>
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl"
              >
                Return To Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
