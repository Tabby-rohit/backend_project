import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
      const subscriberId = req.user._id
      if (!isValidObjectId(channelId)) {
          throw new ApiError("Invalid channelId", 400)
      }
        if (channelId === subscriberId.toString()) {
            throw new ApiError("You cannot subscribe to yourself", 400)
        }
      const subscription = await Subscription.findOne({channelId, subscriberId})
      if (!subscription) {
            throw new ApiError("Channel not found", 404)}
      if (subscription) {
          await Subscription.findByIdAndDelete(subscription._id)
          res.status(200).json(new ApiResponse(true, "Unsubscribed successfully"))
      } else {
          await Subscription.create({channelId, subscriberId})
          res.status(200).json(new ApiResponse(true, "Subscribed successfully"))
      }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!channelId) {
        throw new ApiError("Invalid channelId", 400)
    }
    const subscribers=Subscription.aggregate([
        {$match:{channelId}},
        {
            $lookup:{
            from:User,
            localField:"subscriberId",
            foreignField:"_id", 
            as:"subscriber"
        },
        },{$unwind:"$subscriber"},{
            $project:{
                _id:0,
                subscriber:1
            }
        }
    ])
    res.status(200).json(new ApiResponse(subscribers, "Subscribers fetched successfully", 200))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const subscribedChannels = await Subscription.aggregate([
        { $match: { subscriberId: new mongoose.Types.ObjectId(subscriberId) } },
        {
            $lookup: {
                from: User.collection.name,
                localField: "channelId",
                foreignField: "_id",
                as: "channel"
            }
        },
        { $unwind: "$channel" },
        {
            $project: {
                _id: 0,
                channel: 1
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