const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateOTP = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

const ALLOWED_DOMAIN = "@mnnit.ac.in";

const isCollegeEmail = (email) => {
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp.toString().trim()).digest("hex");
};

const home = (req, res) => {
  res.send("ok");
};

const register = async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
      return res.status(422).json({ error: "Please fill all fields" });
    }

    if (!isCollegeEmail(email)) {
      return res.status(403).json({ error: "Only MNNIT college email (@mnnit.ac.in) is allowed" });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "Password and confirm password do not match" });
    }

    const userExist = await User.findOne({ email });

    if (userExist && userExist.isVerified) {
      return res.status(422).json({ error: "Email already registered and verified. Please login." });
    }

    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);

    if (userExist && !userExist.isVerified) {
      userExist.otp = hashedOtp;
      userExist.otpExpires = Date.now() + 10 * 60 * 1000;
      await userExist.save();

      await sendEmail(email, "Verify your email", `Your OTP is ${otp}. It expires in 10 minutes.`);

      return res.status(200).json({ message: "OTP resent to your email" });
    }

    const user = new User({
      name,
      email,
      password,
      cpassword,
      otp: hashedOtp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await user.save();

    await sendEmail(email, "Verify your email", `Your OTP is ${otp}. It expires in 10 minutes.`);

    return res.status(201).json({ message: "Registration successful. OTP sent to your email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (user.otp !== hashOTP(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const otp = generateOTP();

    user.loginOtp = hashOTP(otp);
    user.loginOtpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Login Verification OTP", `Your login OTP is ${otp}. Valid for 5 minutes.`);

    return res.status(200).json({ message: "Login OTP sent", requireOtp: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.loginOtp) {
      return res.status(400).json({ error: "Invalid request or OTP not generated" });
    }

    if (user.loginOtpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP expired. Please login again." });
    }

    const hashedInput = crypto
      .createHash("sha256")
      .update(otp.toString().trim())
      .digest("hex");

    if (user.loginOtp !== hashedInput) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;

    await user.save();

    const token = await user.generateAuthToken();

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.error("Login Verify Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    return res.status(200).json({ msg: req.user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  home,
  register,
  verifyOtp,
  login,
  verifyLoginOtp,
  checkAuth
};