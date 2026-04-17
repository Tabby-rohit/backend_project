import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const comments = await Comment.aggregate([
        {$match: {videoId: mongoose.Types.ObjectId(videoId)}},
        {$skip: (page - 1) * limit},
        {$limit: limit}
    ])

    res.status(200).json(new ApiResponse(true, "Comments fetched successfully", comments))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    const userId = req.user._id
    const comment = await Comment.create({
        content,
        videoId,
        userId
    })
    res.status(201).json(new ApiResponse(true, "Comment added successfully", comment))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    const userId = req.user._id
    const comment = await Comment.findByIdAndUpdate(commentId, {content}, {new: true})
    res.status(200).json(new ApiResponse(true, "Comment updated successfully", comment))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const userId = req.user._id
    await Comment.findByIdAndDelete(commentId)
    res.status(200).json(new ApiResponse(true, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
