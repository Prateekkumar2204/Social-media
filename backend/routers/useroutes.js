const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/userSchema.js");
const Group = require("../model/group.js");
const GroupChat = require("../model/groupchat.js");
const Message = require("../model/message.js");
const Post = require("../model/postModel.js");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const authenticate = require("../middlewares/authenticate.js");
const generateOTP = require("../utils/otp");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// --- FIX: Centralized Hashing Helper ---
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp.toString().trim()).digest("hex");
};

router.get("/", (req, res) => {
  res.send("ok");
});

const ALLOWED_DOMAIN = "@mnnit.ac.in";
function isCollegeEmail(email) {
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
}

// 🟢 REGISTER ROUTE (FIXED)
router.post("/Register", async (req, res) => {
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
      name, email, password, cpassword,
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
});

// 🟢 VERIFY OTP (FIXED)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "User already verified" });

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
});

// 🟢 LOGIN ROUTE (FIXED)
router.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ error: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

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
});

// 🟢 VERIFY LOGIN OTP (FIXED)
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Check if both fields exist
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.loginOtp) {
      return res.status(400).json({ error: "Invalid request or OTP not generated" });
    }

    // 2. EXPIRE CHECK: Do this BEFORE hashing to save resources
    if (user.loginOtpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP expired. Please login again." });
    }

    // 3. THE FIX: Ensure otp is a string and trimmed before hashing
    const hashedInput = crypto
      .createHash("sha256")
      .update(otp.toString().trim()) 
      .digest("hex");

    // 4. Compare
    if (user.loginOtp !== hashedInput) {
      // DEBUG LOG (Check your terminal to see if they match)
      console.log("Input OTP:", otp);
      console.log("Generated Hash:", hashedInput);
      console.log("Stored DB Hash:", user.loginOtp);
      
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 5. SUCCESS: Clear the OTP fields
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
});

                                       
router.get("/check", authenticate, (req, res) => {
  try { res.status(200).json({ msg: req.user }); } 
  catch (err) { console.log(err); }
});

router.post("/cancelRequest", authenticate, async (req, res) => {
  const id = req.userID;
  try {
    const friendUser = await User.findOne({ _id: req.body.ide });
    await User.findByIdAndUpdate(id, { $pull: { pendingRequest: friendUser._id } });
    await User.findByIdAndUpdate(friendUser._id, { $pull: { pendingRequestSent: id } });
    res.status(200).json({ message: "Done" });
  } catch (err) { console.log(err); }
});

router.post("/sendRequest", authenticate, async (req, res) => {
  const id = req.userID;
  try {
    const friendUser = await User.findOne({ _id: req.body.ide });
    await User.findByIdAndUpdate(id, { $push: { pendingRequestSent: friendUser._id } });
    await User.findByIdAndUpdate(friendUser._id, { $push: { pendingRequest: id } });
    res.status(200).json({ message: "Request Sent" });
  } catch (err) { console.log("User not found"); }
});

router.post("/acceptRequest", authenticate, async (req, res) => {
  const id = req.userID;
  try {
    const friendUser = await User.findOne({ _id: req.body.ide });
    await User.findByIdAndUpdate(id, { $push: { friends: friendUser._id }, $pull: { pendingRequest: friendUser._id } });
    await User.findByIdAndUpdate(friendUser._id, { $push: { friends: id }, $pull: { pendingRequestSent: id } });
    res.status(200).json({ message: "Done" });
  } catch (err) { console.log(err); }
});

router.post("/unfriend", authenticate, async (req, res) => {
  const id = req.userID;
  try {
    const friendUser = await User.findOne({ _id: req.body.ide });
    await User.findByIdAndUpdate(id, { $pull: { friends: friendUser._id } });
    await User.findByIdAndUpdate(friendUser._id, { $pull: { friends: id } });
    res.status(200).json({ message: "Done" });
  } catch (err) { console.log(err); }
});

router.get("/getfriends", authenticate, async (req, res) => {
  const id = req.userID;
  try {
    const currUser = await User.findOne({ _id: id });
    const allUsers = await User.find({
      _id: { $nin: [currUser.pendingRequest, currUser.friends, currUser.pendingRequestSent, id] },
    });
    res.status(200).json({ msg: allUsers });
  } catch (err) { res.status(400).json({ msg: "error" }); }
});

router.get("/myfriends", authenticate, async (req, res) => {
  try {
    const currUser = await User.findOne({ _id: req.userID }).populate("friends");
    res.status(200).json({ msg: currUser.friends });
  } catch (error) { res.status(400).json({ msg: "Error" }); }
});

router.get("/mypendingrequest", authenticate, async (req, res) => {
  try {
    const currUser = await User.findOne({ _id: req.userID }).populate("pendingRequest");
    res.status(200).json({ msg: currUser.pendingRequest });
  } catch (error) { res.status(400).json({ msg: "error occured" }); }
});

router.post("/sendmessage", authenticate, async (req, res) => {
  try {
    const msg = new Message({ message: req.body.content, fromUser: req.userID, toUser: req.body.ide });
    await msg.save();
    res.status(200).json({ msg: "all ok" });
  } catch (err) { res.status(400).json({ msg: "error occurred" }); }
});

router.post("/getmessage", authenticate, async (req, res) => {
  try {
    const fromUser = req.userID;
    const toUser = req.body.ide;
    const messages = await Message.find({
      $or: [{ $and: [{ fromUser }, { toUser }] }, { $and: [{ fromUser: toUser }, { toUser: fromUser }] }],
    }).sort({ createdAt: 1 });
    const projectedMessage = messages.map(msg => ({ fromUser: msg.fromUser.equals(fromUser), message: msg.message }));
    res.status(200).json({ msg: projectedMessage });
  } catch (error) { res.status(500).json({ msg: "Internal Server Error" }); }
});

router.post("/getpost", authenticate, async (req, res) => {
  try {
    const fromUser = req.userID;
    const projectedPost = await Post.find({}).sort({ createdAt: -1 });
    const likedUsers = projectedPost.map(post => ({
      isLiked: post.likes && post.likes.includes(fromUser.toString()),
      post,
      fromSelf: post.original.equals(fromUser),
    }));
    res.status(200).json({ msg: likedUsers });
  } catch (err) { res.status(500).json({ msg: "Internal Server Error" }); }
});

router.post("/addlike", authenticate, async (req, res) => {
  try {
    const fromUser = req.userID;
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    const isLiked = post.likes.includes(fromUser);
    const update = isLiked ? { $pull: { likes: fromUser } } : { $push: { likes: fromUser } };
    const updatedPost = await Post.findByIdAndUpdate(req.body.postId, update, { new: true });
    res.status(200).json({ msg: isLiked ? "Like removed" : "Like added", updatedPost });
  } catch (err) { res.status(500).json({ msg: "Internal Server Error" }); }
});

router.delete("/deletepost", authenticate, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.body.postId);
    res.status(200).json({ msg: "post deleted" });
  } catch (err) { console.log(err); }
});

router.post("/addcomment", authenticate, async (req, res) => {
  try {
    const currUser = await User.findOne({ _id: req.userID });
    const updatedPost = await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: { user: currUser.name, content: req.body.content } },
    }, { new: true });
    res.status(200).json({ msg: "Comment added", updatedPost });
  } catch (err) { res.status(500).json({ msg: "Internal Server Error" }); }
});

router.post('/creategroup', authenticate, async (req, res) => {
   try {
      const creator_id = req.userID;
      const  name= req.body.name;
      const members = req.body.arr;
      const newGroup=new Group({creator_id,name})
      await newGroup.save()
      const updateGroup1 = await Group.findByIdAndUpdate(
         newGroup._id,
         { $push: { members:creator_id} },
         { new: true } 
      )
      const updateGroup = await Group.findByIdAndUpdate(
         newGroup._id,
         { $push: { members: { $each: members } } },
         { new: true }
      );
      res.status(201).json({message:"Group created successfully and admin added"})
   } catch (err) {
      console.log(`${err}`);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.post('/addmembers', authenticate, async (req, res) => {
   try {
      const creator_id = req.userID;
      const members = req.body.members;
      const group_id = req.body.groupId;

      const updateGroup = await Group.findByIdAndUpdate(
         group_id,
         { $push: { members: { $each: members } } },
         { new: true }
      );

      res.status(201).json({ message: "Members added successfully" });
   } catch (err) {
      console.log(`${err}`);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.post('/removemembers', authenticate, async (req, res) => {
   try {
      const creator_id = req.userID;
      const members = req.body.members;
      const group_id = req.body.groupId;

      const updateGroup = await Group.findByIdAndUpdate(
         group_id,
         { $pull: { members: { $in: members } } },
         { new: true }
      );

      res.status(200).json({ message: "Members removed successfully" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});


router.post('/sendgroupchat', authenticate, async (req, res) => {
   try {
      const fromUser = req.userID;
      const message = req.body.message;
      const groupid = req.body.groupId;
      const currUser=await User.findById({
         _id:fromUser
      })
      const name=currUser.name
      const newChatGroup=new GroupChat({fromUser,message,groupid,name})
      await newChatGroup.save()
   
      res.status(200).json({ message: "Message added successfully" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.post('/getMembersToAdded', authenticate, async (req, res) => {
   const id = req.userID;
   const  groupId  = req.body.groupId; 

   try {
      const currUser = await User.findOne({ _id: id });
      const currFriends = currUser.friends;
      const group = await Group.findOne({ _id: groupId });
      const addedMembers = group.members;
      const allUsers = await User.find({ _id: { $in: currFriends, $nin: addedMembers } });
      res.status(200).json({ msg: allUsers });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.get('/getMembersToAdded1', authenticate, async (req, res) => {
   const id = req.userID;

   try {
      const currUser = await User.findOne({ _id: id });
      if (!currUser) {
         return res.status(404).json({ msg: "User not found" });
      }

      const currFriends = currUser.friends;
      if (!currFriends || currFriends.length === 0) {
         return res.status(404).json({ msg: "No friends found for the current user" });
      }

      const allUsers = await User.find({ _id: { $in: currFriends } });
      if (!allUsers || allUsers.length === 0) {
         return res.status(404).json({ msg: "No friends found" });
      }

      res.status(200).json({ msg: allUsers });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.post('/getMembersToRemoved', authenticate, async (req, res) => {
   const id = req.userID;
   const groupid = req.body.groupId;

   try {
      const group = await Group.findOne({ _id: groupid });
      const addedMembers = group.members;
      const allUsers = await User.find({ _id: {  $in: addedMembers ,$nin: id} });

      res.status(200).json({ msg: allUsers });
   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
   }
});

router.post('/getgroupchat', authenticate, async (req, res) => {
   try {
       const fromUser = req.userID;
       const groupid = req.body.groupId; // Using query instead of body for groupId
       const messages = await GroupChat.find({
         groupid: groupid
       }).sort({ createdAt: 1 }); 
       
       const projectedMessage = messages.map(msg => {
         return {
            fromUser: msg.fromUser.equals(fromUser),
            message: msg.message,
            name: msg.name
         };
       });
       res.status(200).json({ msg: projectedMessage });
   } catch (error) {
       console.error(error);
       res.status(500).json({ msg: 'Internal Server Error' });
   }
});

router.get('/getgroups', authenticate, async (req, res) => {
   try {
       const fromUser = req.userID;
       const projectedGroups = await Group.find({ members: { $in: fromUser } });
       res.status(200).json({ msg: projectedGroups });
   } catch (error) {
       console.error(error);
       res.status(500).json({ msg: 'Internal Server Error' });
   }
});
const messagefromUser = {};

router.post('/setdisappearing', authenticate, async (req, res) => {
   try {
       const fromUser = req.userID;
       const friendId = req.body.ide;
       const message = req.body.message;
       if (!messagefromUser[friendId]) {
         messagefromUser[friendId] = [];
       }
       messagefromUser[friendId].push({ from: fromUser, message: message });
      setTimeout(() => {
           if (messageStorage[friendId]) {
               messageStorage[friendId] = messageStorage[friendId].filter(msgObj => msgObj.message !== message);
           }
       }, 5000);

       res.status(200).json({ msg: 'Message set to disappear after 5 seconds' });
   } catch (error) {
       console.error(error);
       res.status(500).json({ msg: 'Internal Server Error' });
   }
});



module.exports=router