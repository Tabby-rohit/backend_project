import{v2 as cloudinary}from"cloudinary";
import fs from"fs";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,   
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary=async(filePath)=>{
    try{
        if(!filePath)return null;
        const result=await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        });
        fs.unlinkSync(filePath);
        console.log("Upload to Cloudinary successful:",result.url);
        return result;
    }catch(error){
        fs.unlinkSync(filePath);//remove the locally stored file in case of error
        console.error("Error uploading to Cloudinary:",error);
        return null;
    }
};
export { uploadOnCloudinary };