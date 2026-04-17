import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user._id
    const like = await Like.findOne({videoId, userId})
    if (like) {
        await Like.findByIdAndDelete(like._id)
        res.status(200).json(new ApiResponse(true, "Video unliked successfully"))
    } else {
        await Like.create({videoId, userId})
        res.status(200).json(new ApiResponse(true, "Video liked successfully"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id
    const like = await Like.findOne({commentId, userId})
    if (like) {
        await Like.findByIdAndDelete(like._id)
        res.status(200).json(new ApiResponse(true, "Comment unliked successfully"))
    } else {
        await Like.create({commentId, userId})
        res.status(200).json(new ApiResponse(true, "Comment liked successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id
    const like = await Like.findOne({tweetId, userId})  
    if (like) {
        await Like.findByIdAndDelete(like._id)
        res.status(200).json(new ApiResponse(true, "Tweet unliked successfully"))
    } else {
        await Like.create({tweetId, userId})
        res.status(200).json(new ApiResponse(true, "Tweet liked successfully"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const likedvideos= await Like.aggregate([{
        $match : {userId: mongoose.Types.ObjectId(userId)}
     },
     {
        $lookup:{
            from: "videos",
            localField: "videoId",
            foreignField: "_id",
            as: "video"
         }
     },
     {
        $unwind: "$video"
     },
     {
        $project: {
            _id: 0,
            videoId: "$video._id",
            title: "$video.title",
        }
     }

    ])
    res.status(200).json(new ApiResponse(likedvideos, "Liked videos fetched successfully",200 ))
})


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}