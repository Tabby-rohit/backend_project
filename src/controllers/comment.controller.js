import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const comments = await Comment.aggregate([
        {$match: {video: new mongoose.Types.ObjectId(videoId)}},
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerData"
            }
        },
        {$unwind: "$ownerData"},
        {
            $project: {
                _id: 1,
                content: 1,
                video: 1,
                owner: "$ownerData",
                createdAt: 1
            }
        },
        {$skip: (page - 1) * limit},
        {$limit: limit}
    ])

    res.status(200).json(new ApiResponse(comments, "Comments fetched successfully", 200))
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    const userId = req.user._id
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })
    res.status(201).json(new ApiResponse(comment, "Comment added successfully", 201))
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    const comment = await Comment.findByIdAndUpdate(commentId, {content}, {new: true})
    if (!comment) {
        throw new ApiError("Comment not found", 404)
    }
    res.status(200).json(new ApiResponse(comment, "Comment updated successfully", 200))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if (!comment) {
        throw new ApiError("Comment not found", 404)
    }
    res.status(200).json(new ApiResponse(null, "Comment deleted successfully", 200))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
