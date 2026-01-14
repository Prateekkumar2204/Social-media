const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dqe6pgcry",
  api_key: 665816573893472,
  api_secret: "l7c34t2qzYXEoSXJ0LN3ugv1r5g",
});

const uploadOnCloudinary = async(localPath)=>{
    try {
        if(!localPath) return null;

        const resp = await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        })

        try {
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
            }
              
            console.log("File deleted from local server:");
        } catch (unlinkError) {
            console.error("Error deleting local file after successful upload:", unlinkError);
        }

        return resp;

    } catch (error) {
        console.error("upload error",error)
    }
}

module.exports = uploadOnCloudinary;
