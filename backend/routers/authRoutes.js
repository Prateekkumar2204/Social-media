const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const {
  home,
  register,
  verifyOtp,
  login,
  verifyLoginOtp,
  checkAuth,
  logoutuser
} = require("../controllers/authController");

router.get("/", home);
router.post("/Register", register);
router.post("/verify-otp", verifyOtp);
router.post("/Login", login);
router.post("/logout",logoutuser);
router.post("/verify-login-otp", verifyLoginOtp);
router.get("/check", authenticate, checkAuth);

module.exports = router;