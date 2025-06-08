const jwt=require("jsonwebtoken")
const User=require("../model/userSchema")
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// Use CORS middleware

const Authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
   
    if(!token){
      return res.status(401).json({msg:"Invalid auth"})
    }
    const jwtToken=token.replace("Bearer","").trim()
    try{
      const isVerified=jwt.verify(jwtToken,"IAMAWEBDEVELOPERANDIAMCOOLYOUKNOWSUBSCRIBEHELLOWORLDIAMHERE32CAHARACTERS")
      
      const userData=await User.findOne({_id:isVerified._id})
      console.log(userData)
      req.user=userData
      req.token=token
      req.userID=userData._id
      console.log(req.userID)
      next()
   } catch (err) {
      console.error('Authentication Error: here i am', err);
      res.status(201).send("Unauthorized access");
   }
};


module.exports=Authenticate