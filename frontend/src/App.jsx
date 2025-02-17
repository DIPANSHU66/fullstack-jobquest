import "./App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
const approuter = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
  {
    path: "/jobs",
    element: <Jobs></Jobs>,
  },
  {
    path: "/Browse",
    element: <Browse></Browse>,
  },
  {
    path: "/Profile",
    element: <Profile></Profile>,
  },

  {
    path: "/jobs/description/:id",
    element: <Jobdescription></Jobdescription>,
  },

  //admin ke  liye
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies></Companies>,
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate></CompanyCreate>,
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup></CompanySetup>,
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <Adminjobs></Adminjobs>,
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob></PostJob>,
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Apllicants></Apllicants>,
      </ProtectedRoute>
    ),
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={approuter}></RouterProvider>
    </>
  );
}

export default App;
