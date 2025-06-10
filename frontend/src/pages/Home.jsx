import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Scss/Home.scss';
import { useAuth } from '../store/auth';
import MainArea from "../Components/mainArea/mainArea.jsx"
import dummyData from "../data.js"

const HomePage = () => {
  const navigate = useNavigate();
  const { LogoutUser, user } = useAuth()
  console.log(user._id)

  console.log(dummyData)

  const logout = () => {
    console.log("hello world")
    LogoutUser()

    navigate("/Login")
  }

  return (

    <div className="mainHome">
      <MainArea />
    </div>
  )
};

export default HomePage;
