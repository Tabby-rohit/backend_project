import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const userId = req.user._id;
    const like = await Like.findOne({video: videoId, likedBy: userId});
    
    if (like) {
        await Like.findByIdAndDelete(like._id);
        res.status(200).json(new ApiResponse(null, "Video unliked successfully", 200));
    } else {
        await Like.create({video: videoId, likedBy: userId});
        res.status(200).json(new ApiResponse(null, "Video liked successfully", 200));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const userId = req.user._id;
    const like = await Like.findOne({comment: commentId, likedBy: userId});
    
    if (like) {
        await Like.findByIdAndDelete(like._id);
        res.status(200).json(new ApiResponse(null, "Comment unliked successfully", 200));
    } else {
        await Like.create({comment: commentId, likedBy: userId});
        res.status(200).json(new ApiResponse(null, "Comment liked successfully", 200));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const userId = req.user._id;
    const like = await Like.findOne({tweet: tweetId, likedBy: userId});
    
    if (like) {
        await Like.findByIdAndDelete(like._id);
        res.status(200).json(new ApiResponse(null, "Tweet unliked successfully", 200));
    } else {
        await Like.create({tweet: tweetId, likedBy: userId});
        res.status(200).json(new ApiResponse(null, "Tweet liked successfully", 200));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const likedvideos = await Like.aggregate([
        {
            $match: { likedBy: new mongoose.Types.ObjectId(userId), video: { $exists: true } }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        {
            $unwind: "$videoData"
        },
        {
            $project: {
                _id: "$videoData._id",
                title: "$videoData.title",
                thumbnail: "$videoData.thumbnail",
                description: "$videoData.description"
            }
        }
    ]);
    res.status(200).json(new ApiResponse(likedvideos, "Liked videos fetched successfully", 200));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}