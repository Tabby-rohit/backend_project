import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    const subscriberId = req.user._id;
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError("Invalid channelId", 400);
    }
    if (channelId === subscriberId.toString()) {
        throw new ApiError("You cannot subscribe to yourself", 400);
    }
    
    const subscription = await Subscription.findOne({
        channel: new mongoose.Types.ObjectId(channelId),
        subscriber: subscriberId
    });
    
    if (subscription) {
        await Subscription.findByIdAndDelete(subscription._id);
        res.status(200).json(new ApiResponse(null, "Unsubscribed successfully", 200));
    } else {
        await Subscription.create({
            channel: new mongoose.Types.ObjectId(channelId),
            subscriber: subscriberId
        });
        res.status(200).json(new ApiResponse(null, "Subscribed successfully", 200));
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError("Invalid channelId", 400)
    }
    const subscribers = await Subscription.aggregate([
        {$match:{channel: new mongoose.Types.ObjectId(channelId)}},
        {
            $lookup:{
                from: "users",
                localField: "subscriber",
                foreignField: "_id", 
                as: "subscriberData"
            }
        },
        {$unwind:"$subscriberData"},
        {
            $project:{
                _id: 0,
                subscriber: "$subscriberData"
            }
        }
    ])
    res.status(200).json(new ApiResponse(subscribers, "Subscribers fetched successfully", 200))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError("Invalid subscriberId", 400)
    }
    const subscribedChannels = await Subscription.aggregate([
        { $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) } },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelData"
            }
        },
        { $unwind: "$channelData" },
        {
            $project: {
                _id: 0,
                channel: "$channelData"
            }
        }
    ])
    res.status(200).json(new ApiResponse(subscribedChannels, "Subscribed channels fetched successfully", 200))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}