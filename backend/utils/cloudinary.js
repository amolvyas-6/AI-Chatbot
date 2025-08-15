import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
  try {
    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(filePath); // Delete file after upload
    return result;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(filePath); // Delete file if upload failed
    throw new Error("Error uploading image");
  }
};

export { uploadImage };
