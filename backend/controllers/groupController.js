const User = require("../model/userSchema");
const Group = require("../model/group");
const GroupChat = require("../model/groupchat");

const createGroup = async (req, res) => {
  try {
    const creator_id = req.userID;
    const name = req.body.name;
    const members = req.body.arr;

    const newGroup = new Group({ creator_id, name });
    await newGroup.save();

    await Group.findByIdAndUpdate(
      newGroup._id,
      { $push: { members: creator_id } },
      { new: true }
    );

    await Group.findByIdAndUpdate(
      newGroup._id,
      { $push: { members: { $each: members } } },
      { new: true }
    );

    return res.status(201).json({ message: "Group created successfully and admin added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const addMembers = async (req, res) => {
  try {
    const members = req.body.members;
    const group_id = req.body.groupId;

    await Group.findByIdAndUpdate(
      group_id,
      { $push: { members: { $each: members } } },
      { new: true }
    );

    return res.status(201).json({ message: "Members added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const removeMembers = async (req, res) => {
  try {
    const members = req.body.members;
    const group_id = req.body.groupId;

    await Group.findByIdAndUpdate(
      group_id,
      { $pull: { members: { $in: members } } },
      { new: true }
    );

    return res.status(200).json({ message: "Members removed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const sendGroupChat = async (req, res) => {
  try {
    const fromUser = req.userID;
    const message = req.body.message;
    const groupid = req.body.groupId;

    const currUser = await User.findById(fromUser);

    const newChatGroup = new GroupChat({
      fromUser,
      message,
      groupid,
      name: currUser.name
    });

    await newChatGroup.save();

    return res.status(200).json({ message: "Message added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getMembersToAdded = async (req, res) => {
  const id = req.userID;
  const groupId = req.body.groupId;

  try {
    const currUser = await User.findById(id);
    const currFriends = currUser.friends;

    const group = await Group.findById(groupId);
    const addedMembers = group.members;

    const allUsers = await User.find({
      _id: { $in: currFriends, $nin: addedMembers }
    });

    return res.status(200).json({ msg: allUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getMembersToAdded1 = async (req, res) => {
  const id = req.userID;

  try {
    const currUser = await User.findById(id);

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

    return res.status(200).json({ msg: allUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getMembersToRemoved = async (req, res) => {
  const id = req.userID;
  const groupid = req.body.groupId;

  try {
    const group = await Group.findById(groupid);
    const addedMembers = group.members;

    const allUsers = await User.find({
      _id: { $in: addedMembers, $nin: [id] }
    });

    return res.status(200).json({ msg: allUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getGroupChat = async (req, res) => {
  try {
    const fromUser = req.userID;
    const groupid = req.body.groupId;

    const messages = await GroupChat.find({
      groupid
    }).sort({ createdAt: 1 });

    const projectedMessage = messages.map((msg) => ({
      fromUser: msg.fromUser.equals(fromUser),
      message: msg.message,
      name: msg.name
    }));

    return res.status(200).json({ msg: projectedMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getGroups = async (req, res) => {
  try {
    const fromUser = req.userID;

    const projectedGroups = await Group.find({
      members: { $in: fromUser }
    });

    return res.status(200).json({ msg: projectedGroups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  createGroup,
  addMembers,
  removeMembers,
  sendGroupChat,
  getMembersToAdded,
  getMembersToAdded1,
  getMembersToRemoved,
  getGroupChat,
  getGroups
};