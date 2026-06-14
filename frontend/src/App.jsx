import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import Jobdescription from "./components/Jobdescription";

import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import Adminjobs from "./components/admin/Adminjobs";
import PostJob from "./components/admin/PostJob";
import Apllicants from "./components/admin/Apllicants";

import ProtectedRoute from "./components/admin/ProtectedRoute";

import AIChatbot from "./components/AIChatbot";
import AIMatching from "./components/AIMatching";
import ResumeReview from "./components/ResumeReview";
import InterviewPrep from "./components/InterviewPrep";

const approuter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/jobs",
    element: <Jobs />,
  },

  {
    path: "/browse",
    element: <Browse />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },

  {
    path: "/ai-matching",
    element: <AIMatching />,
  },

  {
    path: "/resume-review",
    element: <ResumeReview />,
  },

  {
    path: "/interview-prep",
    element: <InterviewPrep />,
  },

  {
    path: "/jobs/description/:id",
    element: <Jobdescription />,
  },

  {
    path: "/admin/companies",

    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/companies/create",

    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/companies/:id",

    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/jobs",

    element: (
      <ProtectedRoute>
        <Adminjobs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/jobs/create",

    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/jobs/:id/applicants",

    element: (
      <ProtectedRoute>
        <Apllicants />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={approuter} />

      <AIChatbot />
    </>
  );
}

export default App;
