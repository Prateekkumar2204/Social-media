import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../Components/protectedRoute.jsx"; // Adjust path as needed

// Page Imports
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";
import Friends from "../pages/Friends";
import Contactus from "../pages/Contactus";
import Chat from "../pages/Chat";
import Group from "../pages/Group";
import VideoCall from "../pages/VideoCall";
import VerifyOtp from "../pages/VerifyOtp";
import VerifyLoginOtp from "../pages/VerifyLoginOtp";

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/verify-login-otp",
    element: <VerifyLoginOtp />,
  },
  {
    path: "/contactus",
    element: <Contactus />,
  },

  // --- PRIVATE (PROTECTED) ROUTES ---
  // {
  //   element: <ProtectedRoute />, // All children below are now protected
  //   children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/group",
        element: <Group />,
      },
      {
        path: "/videocall",
        element: <VideoCall />,
      },
  //   ],
  // },
]);