const Message = require("../model/message");

const sendMessage = async (req, res) => {
  try {
    const msg = new Message({
      message: req.body.content,
      fromUser: req.userID,
      toUser: req.body.ide
    });

    await msg.save();

    return res.status(200).json({ msg: "all ok" });
  } catch (err) {
    return res.status(400).json({ msg: "error occurred" });
  }
};

const getMessage = async (req, res) => {
  try {
    const fromUser = req.userID;
    const toUser = req.body.ide;

    const messages = await Message.find({
      $or: [
        { $and: [{ fromUser }, { toUser }] },
        { $and: [{ fromUser: toUser }, { toUser: fromUser }] }
      ]
    }).sort({ createdAt: 1 });

    const projectedMessage = messages.map((msg) => ({
      fromUser: msg.fromUser.equals(fromUser),
      message: msg.message
    }));

    return res.status(200).json({ msg: projectedMessage });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessage
};