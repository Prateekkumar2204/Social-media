const express = require("express");
const router = express.Router();
const { getAgoraToken } = require("../controllers/agoraController");

router.get("/api/getAgoraToken", getAgoraToken);

module.exports = router;