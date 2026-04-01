const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const {
  sendMessage,
  getMessage
} = require("../controllers/chatController");

router.post("/sendmessage", authenticate, sendMessage);
router.post("/getmessage", authenticate, getMessage);

module.exports = router;