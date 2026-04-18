import { request } from "express";
import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import { apierror } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import{ uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
// import { channel, subscribe } from "diagnostics_channel";
// import { pipeline } from "stream";

const accandreftokengenerator = async (userid) => {
    try {
        const user = await User.findById(userid);
        const accesstoken = await user.generateAccessToken();
        const refreshtoken = await user.generateRefreshToken();
        // save refresh token on the retrieved user document
        user.refreshToken = refreshtoken;
        await user.save({ validateBeforeSave: false });
        return { accesstoken, refreshtoken };
    } catch (error) {
        throw new apierror("Error generating access and refresh token", 500);
    }
}
console.log("user controller loaded");
const registerUser = asyncHandler(async (req, res) => {
    console.log("registerUser function called");
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
    console.log("step-2")
    if(email==="" ||password===""||username===""||fullname===""){
        throw new apierror("All fields are required",400);
    }
    const existUser = await User.findOne({ $or: [{ email }, { username }] })
    if(existUser){
        throw new apierror("User already exists",409);
    }
    const avatarfile = req.files?.avatar[0];
    console.log(avatarfile)
    console.log("step-1")
    if(!avatarfile){
    throw new apierror("Avatar image is required",400);
    }
    console.log("step0")
    const coverfile = req.files?.coverImage[0];
    console.log("step1")
    const Avatar = await uploadOnCloudinary(avatarfile.buffer);
    console.log("step2")
    const CoverImage = await uploadOnCloudinary(coverfile.buffer);
    console.log("step3")

    if(!Avatar){
        throw new apierror("Error uploading avatar image",400);
    }
    console.log("step4")
    const user = await User.create({
        username: username.toLowerCase(),
        fullname,                  // match schema field name
        email,
        password,
        avtar: Avatar.url,
        coverImage: CoverImage?.url || "",
    });
    console.log("step 5");
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
console.log("step 6")
console.log(createdUser);
if(!createdUser){
    throw new apierror("Error creating user",500);
}console.log("step 7")
return res.status(201).json(new ApiResponse(createdUser, "User registered successfully", 201));
})
//logic to login user
//todos:
//get username and password from request body
//validate data 
//give error if data is not valid
//give access tokens
//give refresh tokens
//send in form of cookie
//send response to client
const loginUser=asyncHandler(async (req, res) => {
    const {email, username, password } = req.body;
    if(username==="" && email===""){
        throw new apierror("email or password is required",400);

    }
    if(password===""){
        throw new apierror("password is required",400);
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        throw new apierror("user not found",404);
    }
    

    const PasswordValid=user.isPasswordValid(password);
    if(!PasswordValid){
        throw new apierror("invalid password",404);
    }



const { accesstoken, refreshtoken } = await accandreftokengenerator(user._id);

const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
const option={
    httpOnly:true,
    secure: true
}

return res.status(200).cookie("accessToken", accesstoken, option).cookie("refreshToken", refreshtoken, option)
.json(new ApiResponse({ user: loggedInUser, accesstoken, refreshtoken }, "User logged in successfully", 200));

})

const logoutUser=asyncHandler(async(req,res)=>{
   //now we area going to create a middle ware 
   //from the middle ware we will dirsctly get user bcs we varified user and have  set req.user=user in middle ware
   await User.findByIdAndUpdate(
    req.user._id,
    {$set:
    {
        refreshToken:undefined

    }},
    {
        new:true
    }

   )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse({}, "User logged out successfully", 200));

})
const refreshaccessToken=asyncHandler(async(req,res)=>{
    const IncommingRefreshToken=req.cookies?.refreshToken||req.header("Authorization")?.replace("Bearer ","")
    if(!IncommingRefreshToken){
        throw new apierror("unauthorized request",401);
    }
    try {
        const decodedToken=await jwt.verify(IncommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
            user=await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new apierror("user not found",401);
        }
        if(user.refreshToken!==IncommingRefreshToken){
            throw new apierror("refresh token is expired is expired or used",401);
    
        }
        const { accesstoken, refreshtoken } = await accandreftokengenerator(user._id);   
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200).cookie("accessToken", accesstoken, options).cookie("refreshToken", refreshtoken, options)
    .json(new ApiResponse({ user, accesstoken, refreshtoken }, "Access token refreshed successfully", 200));
    } catch (error) {
        throw new apierror("invalid refresh token",401);
    }
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
   const {currentPassword,newPassword}=req.body;
  const user=await User.findById(req.user._id);
  isPasswordValid=user.isPasswordValid(currentPassword);
  if(!isPasswordValid){
    throw new apierror("current password is incorrect",400);
  }
  user.password=newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse({}, "Password changed successfully", 200)); 
})   

const getcurrentUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id);
    if(!user){
    throw new apierror("user not found",404);
    }
    return res.status(200).json(new ApiResponse(user, "User retrieved successfully", 200));
    })

const updatecurrentUser=asyncHandler(async(req,res)=>{
    const {username,fullname}=req.body;
    if(username==="" || fullname===""){
        throw new apierror("username and fullname are required",400);
    }
    const updatedUser=await User.findByIdAndUpdate(req.user._id,
        {
            $set:{ username,fullname}
        },
        {
            new:true

        }).select("-password -refreshToken");
        if(!updatedUser){
            throw new apierror("user not found",404);
        }
        return res.status(200).json(new ApiResponse(updatedUser, "User updated successfully", 200));
    })    

const updatecurrentUserAvatar=asyncHandler(async(req,res)=>{
    const avatarfile = req.file?.path;
    if(!avatarfile){
        throw new apierror("Avatar image is required",400);
    }
    const Avatar = await uploadOnCloudinary(avatarfile.buffer);
    if(!Avatar.url){
        throw new apierror("Error uploading avatar image",400);
    }
    const updatedUser=await User.findByIdAndUpdate(req.user._id,
        {
            $set:{ avtar:Avatar.url}
        },
        {
            new:true}).select("-password -refreshToken");
        if(!updatedUser){
            throw new apierror("user not found",404);
        }
        return res.status(200).json(new ApiResponse(updatedUser, "User avatar updated successfully", 200));
}) 

const updatecurrentUserCoverImage=asyncHandler(async(req,res)=>{
    const coverimglocalpath = req.file?.path;
    if(!coverimglocalpath){
        throw new apierror("Cover image is required",400);
    }
    const newCoverImage = await uploadOnCloudinary(coverimglocalpath);
    if(!newCoverImage.url){
        throw new apierror("Error uploading cover image",400);
    }
    const updatedUser=await User.findByIdAndUpdate(req.user._id,
        {
        $set:{ coverImage:newCoverImage.url}
    },{new:true}).select("-password -refreshToken");
    if(!updatedUser){
        throw new apierror("user not found",404);
    }
    return res.status(200).json(new ApiResponse(updatedUser, "User cover image updated successfully", 200));
})
const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username} = req.params
    if(!username?.trim()){
        throw new apierror("username is required",400);
    }
    const channel=await User.aggregate([
    {$match:{username:username.toLowerCase()}
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }

    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },
    {
        $addFields:{
            subscribersCount:{$size:"$subscribers"},
            subscribedToCount:{$size:"$subscribedTo"},
            isSubscribed:
            {$cond:{
                if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                then:true,
                else:false
            }}
        }
    },
    {$project:{
        subscribersCount:1,
        subscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        username:1,
        fullname:1,

    }
    }
    ])
    if(!channel?.length){
    throw new apierror("channel not found",404);
}
console.log(channel)
return res.status(200).json(new ApiResponse(channel[0], "Channel profile retrieved successfully", 200));
})
const getUserWatchHistory = asyncHandler(async (req, res) => {
    const historyData = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchedHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerData"
                        }
                    },
                    { $unwind: { path: "$ownerData", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            thumbnail: 1,
                            description: 1,
                            videoFile: 1,
                            owner: {
                                _id: "$ownerData._id",
                                username: "$ownerData.username",
                                fullname: "$ownerData.fullname",
                                avtar: "$ownerData.avtar"
                            },
                            createdAt: 1
                        }
                    }
                ]
            }
        }
    ]);

    const watchedHistory = historyData?.[0]?.watchedHistory || [];
    return res.status(200).json(new ApiResponse(watchedHistory, "User watch history retrieved successfully", 200));
})

const addUserWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    if (!videoId) {
        throw new apierror("videoId is required", 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apierror("User not found", 404);
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const alreadyInHistory = user.watchhistory.some((id) => id.equals(videoObjectId));
    if (!alreadyInHistory) {
        user.watchhistory.push(videoObjectId);
        await user.save();
    }

    return res.status(200).json(new ApiResponse(user.watchhistory, "Watch history updated successfully", 200));
})

export {registerUser, loginUser,logoutUser,refreshaccessToken,changeCurrentPassword,getcurrentUser,updatecurrentUser,updatecurrentUserAvatar,updatecurrentUserCoverImage,getUserChannelProfile,getUserWatchHistory, addUserWatchHistory} 




