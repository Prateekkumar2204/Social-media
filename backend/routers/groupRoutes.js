const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const {
  createGroup,
  addMembers,
  removeMembers,
  sendGroupChat,
  getMembersToAdded,
  getMembersToAdded1,
  getMembersToRemoved,
  getGroupChat,
  getGroups
} = require("../controllers/groupController");

router.post("/creategroup", authenticate, createGroup);
router.post("/addmembers", authenticate, addMembers);
router.post("/removemembers", authenticate, removeMembers);
router.post("/sendgroupchat", authenticate, sendGroupChat);
router.post("/getMembersToAdded", authenticate, getMembersToAdded);
router.get("/getMembersToAdded1", authenticate, getMembersToAdded1);
router.post("/getMembersToRemoved", authenticate, getMembersToRemoved);
router.post("/getgroupchat", authenticate, getGroupChat);
router.get("/getgroups", authenticate, getGroups);

module.exports = router;