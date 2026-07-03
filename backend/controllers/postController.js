const User = require("../model/userSchema");
const Post = require("../model/postModel");
const cloudinary = require("cloudinary").v2;

// ❌ REMOVED: const uploadOnCloudinary = require("../config/cloudinary"); 
// We no longer need this because Multer handles the Cloudinary upload directly!

const uploadProfileImage = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Check if the file exists
    if (!req.file) {
      return res.status(400).json({ msg: "Image required" });
    }

    // 2. Grab the URL directly (It's already on Cloudinary!)
    const image = req.file.path;

    // 3. Update the database
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

    if (!req.file) {
      return res.status(400).json({ msg: "Image required" });
    }

    // req.file.path is the Cloudinary URL
    const image = req.file.path; 
    const title = req.body.title;
    
    const currUser = await User.findById(fromUser);
    if (!currUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const post = new Post({
      original: fromUser,
      image,
      title,
      originalName: currUser.name
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

    if (!req.file) {
      return res.status(400).json({ msg: "Image required" });
    }

    // req.file.path is the Cloudinary URL
    const image = req.file.path;

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
    // 1. Find the post first so we can get the image URL
    const post = await Post.findById(req.body.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // 2. Extract the public_id from the Cloudinary URL and delete it from Cloudinary
    if (post.image) {
      // Cloudinary URLs look like: .../upload/v1234567/my_app_images/filename.jpg
      // This regex extracts the 'my_app_images/filename' part
      const publicId = post.image.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Delete the post from MongoDB
    await Post.findByIdAndDelete(req.body.postId);
    
    return res.status(200).json({ msg: "Post and image deleted" });
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