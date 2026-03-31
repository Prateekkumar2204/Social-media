const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const { addComment, getCommentsByPost } = require("../controllers/commentController");


router.post("/addcommentv2", authenticate, addComment);
router.get("/getcomments/:postId", getCommentsByPost);

module.exports = router;