const express = require("express");
const router = express.Router();
const multer = require("multer");

const authenticate = require("../middlewares/authenticate");
const {
  uploadProfileImage,
  sendPost,
  updatePost,
  getPost,
  addLike,
  deletePost
} = require("../controllers/postController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload-image/:id", upload.single("image"), uploadProfileImage);
router.post("/sendpost", authenticate, upload.single("image"), sendPost);
router.put("/updatepost", authenticate, upload.single("image"), updatePost);
router.post("/getpost", authenticate, getPost);
router.post("/addlike", authenticate, addLike);
router.delete("/deletepost", authenticate, deletePost);

module.exports = router;