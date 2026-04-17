
import{v2 as cloudinary}from"cloudinary";
import fs from"fs";
import path from"path";
console.log("Cloudinary Config:",process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET,process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,   
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary=async(LfilePath, resourceType = 'image')=>{
    const stats = fs.statSync(LfilePath);
    console.log("File size:", stats.size);
    const filePath = path.resolve(LfilePath).replace(/\\/g, "/");
    console.log(cloudinary.config());
    try{
        if(!filePath) return null;
        console.log("Uploading to Cloudinary:",filePath, "type:", resourceType);
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            use_filename: true,
            unique_filename: false,
        });
        console.log("Upload to Cloudinary successful:", result.url);
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};
export { uploadOnCloudinary };