import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    const videos = await Video.aggregatePaginate(
        [
            {
                $match: {
                    isPublished: true,
                    title: { $regex: query || "", $options: "i" },
                },
            },
            {
                $project: {
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    owner: 1,
                    createdAt: 1,
                },
            },
        ],
        { page, limit, sort: { [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1 } }
    );

    res.status(200).json(new ApiResponse(videos, "Videos retrieved successfully", 200));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        throw new ApiError("Title and description are required", 400);
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const videoFiles = req.files?.videoFile;
    const thumbnailFiles = req.files?.thumbnail;

    if (!videoFiles?.length) {
        throw new ApiError("Video file is required", 400);
    }
    if (!thumbnailFiles?.length) {
        throw new ApiError("Thumbnail file is required", 400);
    }

    const videolocalpath = videoFiles[0].path;
    const thumbnailLocalPath = thumbnailFiles[0].path;

    const videoUpload = await uploadOnCloudinary(videolocalpath, 'video');
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, 'image');

    if (!videoUpload?.url) {
        throw new ApiError("Error uploading video file", 500);
    }
    if (!thumbnailUpload?.url) {
        throw new ApiError("Error uploading thumbnail image", 500);
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration: videoUpload.duration || 0,
        owner: userId,
        isPublished: true,
    });

    res.status(201).json(new ApiResponse(video, "Video published successfully", 201));
});



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId).populate({
        path: 'owner',
        select: 'username email _id'
    })
    if (!video) {
        throw new ApiError("Video not found", 404)
    }
    res.status(200).json(new ApiResponse(video, "Video fetched successfully",200))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path
    if(thumbnailLocalPath) {
        const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)
       const video = await Video.findByIdAndUpdate(videoId, { thumbnail: thumbnailFile.url }, { new: true })
        if(!video) {
            throw new ApiError("Video not found", 404)
        }
    }
    if(title || description) {
        const video = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true })
        if (!video) {
            throw new ApiError("Video not found", 404)
        }
    }

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError("Video not found", 404)
    }
    res.status(200).json(new ApiResponse(null, "Video deleted successfully", 200))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError("Video not found", 404)
    }
    video.isPublished = !video.isPublished
    await video.save()
    res.status(200).json(new ApiResponse(video, "Publish status toggled successfully", 200))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
