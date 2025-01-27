import "./App.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Jobdescription from "./components/Jobdescription";
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
    path: "/Logout",
    element: <Logout></Logout>,
  },
  {
    path: "/jobs/description/:id",
    element: <Jobdescription></Jobdescription>,
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
