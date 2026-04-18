import {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if (!name || !description) {
        throw new ApiError("Name and description are required", 400)
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    res.status(201).json(new ApiResponse(playlist, "Playlist created successfully", 201))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError("Invalid userId", 400)
    }

    const playlists = await Playlist.find({owner: userId}).populate("videos").sort({createdAt: -1})
    res.status(200).json(new ApiResponse(playlists, "User playlists fetched successfully", 200))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlistId", 400)
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")
    if (!playlist) {
        throw new ApiError("Playlist not found", 404)
    }

    res.status(200).json(new ApiResponse(playlist, "Playlist fetched successfully", 200))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlistId", 400)
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError("Invalid videoId", 400)
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError("Playlist not found", 404)
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized", 403)
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError("Video not found", 404)
    }
    if (playlist.videos.some((id) => id.toString() === videoId)) {
        return res.status(200).json(new ApiResponse(playlist, "Video already in playlist", 200))
    }

    playlist.videos.push(videoId)
    await playlist.save()

    res.status(200).json(new ApiResponse(playlist, "Video added to playlist successfully", 200))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlistId", 400)
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError("Invalid videoId", 400)
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError("Playlist not found", 404)
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized", 403)
    }
    if (!playlist.videos.some((id) => id.toString() === videoId)) {
        throw new ApiError("Video not found in playlist", 404)
    }

    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId)
    await playlist.save()

    res.status(200).json(new ApiResponse(playlist, "Video removed from playlist successfully", 200))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlistId", 400)
    }

    const playlist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    })
    if (!playlist) {
        throw new ApiError("Playlist not found or unauthorized", 404)
    }

    res.status(200).json(new ApiResponse(null, "Playlist deleted successfully", 200))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlistId", 400)
    }
    if (!name && !description) {
        throw new ApiError("Name or description is required to update", 400)
    }

    const updates = {}
    if (name) updates.name = name
    if (description) updates.description = description

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id },
        updates,
        { new: true, runValidators: true }
    )
    if (!playlist) {
        throw new ApiError("Playlist not found or unauthorized", 404)
    }

    res.status(200).json(new ApiResponse(playlist, "Playlist updated successfully", 200))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
