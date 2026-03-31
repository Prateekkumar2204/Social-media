const User = require("../model/userSchema");

const cancelRequest = async (req, res) => {
  const id = req.userID;

  try {
    const friendUser = await User.findById(req.body.ide);

    await User.findByIdAndUpdate(id, {
      $pull: { pendingRequest: friendUser._id }
    });

    await User.findByIdAndUpdate(friendUser._id, {
      $pull: { pendingRequestSent: id }
    });

    return res.status(200).json({ message: "Done" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const sendRequest = async (req, res) => {
  const id = req.userID;

  try {
    const friendUser = await User.findById(req.body.ide);

    await User.findByIdAndUpdate(id, {
      $push: { pendingRequestSent: friendUser._id }
    });

    await User.findByIdAndUpdate(friendUser._id, {
      $push: { pendingRequest: id }
    });

    return res.status(200).json({ message: "Request Sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "User not found" });
  }
};

const acceptRequest = async (req, res) => {
  const id = req.userID;

  try {
    const friendUser = await User.findById(req.body.ide);

    await User.findByIdAndUpdate(id, {
      $push: { friends: friendUser._id },
      $pull: { pendingRequest: friendUser._id }
    });

    await User.findByIdAndUpdate(friendUser._id, {
      $push: { friends: id },
      $pull: { pendingRequestSent: id }
    });

    return res.status(200).json({ message: "Done" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const unfriend = async (req, res) => {
  const id = req.userID;

  try {
    const friendUser = await User.findById(req.body.ide);

    await User.findByIdAndUpdate(id, {
      $pull: { friends: friendUser._id }
    });

    await User.findByIdAndUpdate(friendUser._id, {
      $pull: { friends: id }
    });

    return res.status(200).json({ message: "Done" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getFriends = async (req, res) => {
  const id = req.userID;

  try {
    const currUser = await User.findById(id);

    const excludedIds = [
      ...currUser.pendingRequest,
      ...currUser.friends,
      ...currUser.pendingRequestSent,
      currUser._id
    ];

    const allUsers = await User.find({
      _id: { $nin: excludedIds }
    });

    return res.status(200).json({ msg: allUsers });
  } catch (err) {
    return res.status(400).json({ msg: "error" });
  }
};

const myFriends = async (req, res) => {
  try {
    const currUser = await User.findById(req.userID).populate("friends");
    return res.status(200).json({ msg: currUser.friends });
  } catch (error) {
    return res.status(400).json({ msg: "Error" });
  }
};

const myPendingRequest = async (req, res) => {
  try {
    const currUser = await User.findById(req.userID).populate("pendingRequest");
    return res.status(200).json({ msg: currUser.pendingRequest });
  } catch (error) {
    return res.status(400).json({ msg: "error occured" });
  }
};

module.exports = {
  cancelRequest,
  sendRequest,
  acceptRequest,
  unfriend,
  getFriends,
  myFriends,
  myPendingRequest
};