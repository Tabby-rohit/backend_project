import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    const totalVideos = await Video.countDocuments({ owner: channelId })

    const viewsResult = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])

    const totalViews = viewsResult[0]?.totalViews || 0
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })

    const channelVideoIds = await Video.find({ owner: channelId }).select("_id")
    const videoIds = channelVideoIds.map((video) => video._id)
    const totalLikes = videoIds.length > 0
        ? await Like.countDocuments({ video: { $in: videoIds } })
        : 0

    res.status(200).json(new ApiResponse({
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    }, "Channel stats fetched successfully", 200))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 })

    res.status(200).json(new ApiResponse(videos, "Channel videos fetched successfully", 200))
})

export {
    getChannelStats,
    getChannelVideos
}