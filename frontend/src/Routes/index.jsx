import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register"; 
import Home from "../pages/Home";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";
import Friends from "../pages/Friends";
import Contactus from "../pages/Contactus";
import Chat from "../pages/Chat"
import Group from "../pages/Group"
import VideoCall from "../pages/VideoCall"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/",
    element: <Home />,
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
    path: "/contactus",
    element: <Contactus />,
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/group",
    element: <Group />
  },
  {
    path: "/videocall",
    element: <VideoCall />
  }
]);
