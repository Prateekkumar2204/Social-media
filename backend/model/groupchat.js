const mongoose = require("mongoose");
const User = require("./userSchema");
const Group = require("./group");

const GroupChatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    groupid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Group',
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name:{
        type:String,
        required:true,
    },
  },
  {
    timestamps: true, 
  }
);

const GroupChat = mongoose.model('GroupChat', GroupChatSchema);
module.exports = GroupChat;

