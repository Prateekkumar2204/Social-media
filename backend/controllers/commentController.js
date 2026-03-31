const User = require("../model/userSchema");
const Post = require("../model/postModel");
const Comment = require("../model/commentSchema");
const CommentBlock = require("../model/commentBlockSchema");
const { analyzeComment } = require("../utils/commentModeration");
const { moderateWithGemini } = require("../utils/llmModeration");
const addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content || !content.trim()) {
      return res.status(400).json({ msg: "Comment content is required" });
    }

    const currUser = await User.findById(req.userID);
    if (!currUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const existingBlock = await CommentBlock.findOne({
      postId,
      userId: req.userID
    });

    if (existingBlock) {
      return res.status(403).json({
        msg: "You are blocked from commenting on this post",
        blocked: true
      });
    }

    const moderationDecision = analyzeComment(content);

    if (moderationDecision.action === "block_immediately") {
      await CommentBlock.findOneAndUpdate(
        { postId, userId: req.userID },
        {
          postId,
          userId: req.userID,
          reason: moderationDecision.reason
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      return res.status(403).json({
        msg: "Toxic comment detected. You can no longer comment on this post",
        blocked: true,
        rejected: true
      });
    }

    if (moderationDecision.action === "needs_llm") {
      const llmResult = await moderateWithGemini(content);

      if (llmResult.isToxic && llmResult.confidence >= 0.7) {
        await CommentBlock.findOneAndUpdate(
          { postId, userId: req.userID },
          {
            postId,
            userId: req.userID,
            reason: llmResult.reason || "llm_toxicity_detected"
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );

        return res.status(403).json({
          msg: "Comment rejected by AI moderation. You can no longer comment on this post",
          blocked: true,
          rejected: true,
          moderation: {
            action: "blocked_by_llm",
            reason: llmResult.reason,
            confidence: llmResult.confidence
          }
        });
      }
    }

    const newComment = await Comment.create({
      postId,
      userId: currUser._id,
      userName: currUser.name,
      content: content.trim()
    });

    return res.status(200).json({
      msg: "Comment added",
      blocked: false,
      comment: newComment,
      moderation: {
        action: moderationDecision.action,
        reason: moderationDecision.reason,
        suspicionScore: moderationDecision.suspicionScore || 0
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1
    });

    return res.status(200).json({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { addComment, getCommentsByPost };