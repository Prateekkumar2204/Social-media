const User = require("../model/userSchema");
const Post = require("../model/postModel");
const uploadOnCloudinary = require("../config/cloudinary");

const uploadProfileImage = async (req, res) => {
  try {
    const id = req.params.id;
    const imgs = req.file;

    if (!imgs) {
      return res.status(400).json({ msg: "Image required" });
    }

    const imagePath = req.file.path;
    const imgRes = await uploadOnCloudinary(imagePath);

    if (!imgRes) {
      return res.status(500).json({ msg: "Image upload failed" });
    }

    const image = imgRes.url;

    await User.findByIdAndUpdate(
      id,
      { $set: { image } },
      { new: true }
    );

    return res.status(200).json({ msg: "Profile image updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const sendPost = async (req, res) => {
  try {
    const fromUser = req.userID;
    const imgs = req.file;

    if (!imgs) {
      return res.status(400).json({ msg: "Image required" });
    }

    const imagePath = req.file.path;
    const imgRes = await uploadOnCloudinary(imagePath);

    if (!imgRes) {
      return res.status(500).json({ msg: "Image upload failed" });
    }

    const image = imgRes.url;

    const title = req.body.title;
    const currUser = await User.findById(fromUser);

    if (!currUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const name = currUser.name;

    const post = new Post({
      original: fromUser,
      image,
      title,
      originalName: name
    });

    await post.save();

    return res.status(200).json({ msg: "Post created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const title = req.body.title;
    const imgs = req.file;

    if (!imgs) {
      return res.status(400).json({ msg: "Image required" });
    }

    const imagePath = req.file.path;
    const imgRes = await uploadOnCloudinary(imagePath);

    if (!imgRes) {
      return res.status(500).json({ msg: "Image upload failed" });
    }

    const image = imgRes.url;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, image },
      { new: true }
    );

    return res.status(200).json({ msg: updatedPost });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const fromUser = req.userID;

    const projectedPost = await Post.find({}).sort({ createdAt: -1 });

    const likedUsers = projectedPost.map((post) => ({
      isLiked: post.likes && post.likes.includes(fromUser.toString()),
      post,
      fromSelf: post.original.equals(fromUser),
    }));

    return res.status(200).json({ msg: likedUsers });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const addLike = async (req, res) => {
  try {
    const fromUser = req.userID;
    const post = await Post.findById(req.body.postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const isLiked = post.likes.includes(fromUser);

    const update = isLiked
      ? { $pull: { likes: fromUser } }
      : { $push: { likes: fromUser } };

    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      update,
      { new: true }
    );

    return res.status(200).json({
      msg: isLiked ? "Like removed" : "Like added",
      updatedPost
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.body.postId);
    return res.status(200).json({ msg: "post deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  uploadProfileImage,
  sendPost,
  updatePost,
  getPost,
  addLike,
  deletePost
};