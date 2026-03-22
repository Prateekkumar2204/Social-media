const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cpassword: { type: String, required: true },
    image: { type: String },
    
    // for phone, laptop etc
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
    
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingRequestSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
    isVerified: { type: Boolean, default: false },
    
    // Registration OTP
    otp: String,
    otpExpires: Date,

    // Login OTP
    loginOtp: String,
    loginOtpExpires: Date,
  },
  { timestamps: true }
);

// ✅ FIXED: Only hash password if it is actually NEW or CHANGED
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

 
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign(
      { _id: this._id },
      "IAMAWEBDEVELOPERANDIAMCOOLYOUKNOWSUBSCRIBEHELLOWORLDIAMHERE32CAHARACTERS",
      { expiresIn: "24h" }
    );
    
    // Add the new token to the array
    this.tokens = this.tokens.concat({ token: token });
    
    // Use clear OTP fields before saving to avoid any weirdness
    await this.save();
    return token;
  } catch (err) {
    console.log("Error generating token:", err);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;