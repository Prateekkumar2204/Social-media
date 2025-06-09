const mongoose = require("mongoose");
const User = require("./userSchema");

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, 
  }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
