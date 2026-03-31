const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const {
  cancelRequest,
  sendRequest,
  acceptRequest,
  unfriend,
  getFriends,
  myFriends,
  myPendingRequest
} = require("../controllers/friendController");

router.post("/cancelRequest", authenticate, cancelRequest);
router.post("/sendRequest", authenticate, sendRequest);
router.post("/acceptRequest", authenticate, acceptRequest);
router.post("/unfriend", authenticate, unfriend);
router.get("/getfriends", authenticate, getFriends);
router.get("/myfriends", authenticate, myFriends);
router.get("/mypendingrequest", authenticate, myPendingRequest);

module.exports = router;