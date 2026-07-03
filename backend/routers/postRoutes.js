const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const authenticate = require("../middlewares/authenticate");
const {
  uploadProfileImage,
  sendPost,
  updatePost,
  getPost,
  addLike,
  deletePost
} = require("../controllers/postController");

// 1. Configure Cloudinary using your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Tell Multer to send files straight to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_app_images", // This will create a folder in your Cloudinary dashboard
    allowed_formats: ["jpg", "jpeg", "png", "webp"] 
  },
});

const upload = multer({ storage });

// 3. Your routes stay exactly the same!
router.post("/upload-image/:id", upload.single("image"), uploadProfileImage);
router.post("/sendpost", authenticate, upload.single("image"), sendPost);
router.put("/updatepost", authenticate, upload.single("image"), updatePost);
router.post("/getpost", authenticate, getPost);
router.post("/addlike", authenticate, addLike);
router.delete("/deletepost", authenticate, deletePost);

module.exports = router;