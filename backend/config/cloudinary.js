const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;

    const resp = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto"
    });

    try {
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    } catch (unlinkError) {
      console.error("Error deleting local file after successful upload:", unlinkError);
    }

    return resp;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    try {
      if (localPath && fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    } catch (unlinkError) {
      console.error("Error deleting local file after failed upload:", unlinkError);
    }

    return null;
  }
};

module.exports = uploadOnCloudinary;