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
    element: <Companies></Companies>,
  },
  {
    path: "admin/companies/create",
    element: <CompanyCreate></CompanyCreate>,
  },
  {
    path: "/admin/companies/:id",
    element: <CompanySetup></CompanySetup>,
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
