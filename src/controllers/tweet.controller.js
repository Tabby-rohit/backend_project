import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const userId = req.user._id
    if(!userId) {
        throw new ApiError("User not authenticated", 401)
    }

    if (!content) {
        throw new ApiError("Content is required", 400)
    }

    const tweet = await Tweet.create({
        content,
        owner: userId
    })

    res.status(201).json(new ApiResponse(tweet, "Tweet created successfully", 201))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId
    if (!isValidObjectId(userId)) {
        throw new ApiError("Invalid userId", 400)
    }
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 })
    res.status(200).json(new ApiResponse(tweets, "Tweets fetched successfully", 200))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError("Invalid tweetId", 400)
    }

    if (!content) {
        throw new ApiError("Content is required", 400)
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError("Tweet not found", 404)
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError("Unauthorized", 403)
    }

    tweet.content = content
    await tweet.save()

    res.status(200).json(new ApiResponse(tweet, "Tweet updated successfully", 200))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError("Invalid tweetId", 400)
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError("Tweet not found", 404)
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError("Unauthorized", 403)
    }

    await Tweet.findByIdAndDelete(tweetId)

    res.status(200).json(new ApiResponse(true, "Tweet deleted successfully", 200))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
