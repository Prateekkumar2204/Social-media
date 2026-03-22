import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Scss/Home.scss';
import { useAuth } from '../store/auth';
import MainArea from "../Components/mainArea/mainArea.jsx"
import dummyData from "../data.js"

const HomePage = () => {
  const navigate = useNavigate();
  // Added isLoading from the context we updated earlier
  const { LogoutUser, user, isLoading } = useAuth();

  // 1. Handle the initial loading state
  if (isLoading) {
    return <div className="loading-screen">Loading MNNIT Chat...</div>;
  }

  // 2. Safely log user info. Using user?._id prevents the crash 
  // if the user is not logged in or data hasn't arrived.
  console.log("Current User ID:", user?._id);
  console.log("Dummy Data:", dummyData);

  const logout = () => {
    console.log("Logging out...");
    LogoutUser();
    navigate("/Login");
  };

  return (
    <div className="mainHome">
      {/* If you need to pass user data to MainArea, do it here */}
      <MainArea user={user} logout={logout} />
    </div>
  );
};

export default HomePage;