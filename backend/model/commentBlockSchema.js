const mongoose = require("mongoose");

const commentBlockSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reason: {
      type: String,
      default: "toxic_comment"
    }
  },
  {
    timestamps: true
  }
);

commentBlockSchema.index({ postId: 1, userId: 1 }, { unique: true });

const CommentBlock = mongoose.model("CommentBlock", commentBlockSchema);

module.exports = CommentBlock;