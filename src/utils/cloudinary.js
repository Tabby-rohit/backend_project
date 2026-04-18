
import{v2 as cloudinary}from"cloudinary";
import fs from"fs";
import path from"path";
import streamifier from"streamifier";
console.log("Cloudinary Config:",process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET,process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,   
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
export { uploadOnCloudinary };