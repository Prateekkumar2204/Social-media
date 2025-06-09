const mongoose = require("mongoose");
const User = require("./userSchema");

const GroupSchema = new mongoose.Schema(
  {
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    name:{
        type: String,
        required:true,
    },
  },
  {
    timestamps: true, 
  }
);

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
