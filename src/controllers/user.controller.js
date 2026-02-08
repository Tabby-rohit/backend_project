import { request } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import { apierror } from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import{ uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
    // Logic to register a user
    //take data from user
    //validate data
    //check if user already exists
    //hash password
    //check for images
    //check for avatar
    //upload images to cloudinary,check that avatar is uploaded to cloudinary porperly
    //create user object-create entry in database
    //remove password and refresh token field from user object
    //check if user is created successfully, if not send error response
    //if user is created successfully, send success response with user data
    const { username, fullname, email, password } = req.body;
    console.log(req.body);
    console.log(req.file);
    // if(email===""||password===""||username===""||fullname===""){
    //     throw new apierror("All fields are required",400);
    // }
    // const existUser = User.findOne({ $or: [{ email }, { username }] })
    // if(existUser){
    //     // throw new apierror("User already exists",409);
    //}
    const avatarlocalpath = req.file?.avatar[0]?.path;
    if(!avatarlocalpath){
    throw new apierror("Avatar image is required",400);
    }
    const coverlocalpath = req.file?.coverImage[0]?.path;
    const Avatar = await uploadOnCloudinary(avatarlocalpath);
    const CoverImage = await uploadOnCloudinary(coverlocalpath);
    if(!Avatar){
        throw new apierror("Error uploading avatar image",400);
    }
    
    const user = await User.create({
        username:username.toLowerCase(),
        fullName:fullname,
        email,
        password,
        avtar:Avatar.url,
        coverImage:CoverImage?.url || ""})
createdUser=await User.findById(user._id).select("-password -refreshToken");
})
if(!createdUser){
    throw new apierror("Error creating user",500);
}
return res.status(201).json(new apiResponse("User registered successfully",createdUser,201));
export { registerUser }
