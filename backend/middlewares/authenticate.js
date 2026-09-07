const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
  const jwtToken = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

  if (!jwtToken) {
    return res.status(401).json({ msg: "Invalid auth" });
  }


  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const userData = await User.findById(isVerified._id);

    if (!userData) {
      return res.status(401).json({ msg: "Unauthorized access" });
    }

    req.user = userData;
    req.token = jwtToken;
    req.userID = userData._id;

    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    return res.status(401).json({ msg: "Unauthorized access" });
  }
};

module.exports = Authenticate;