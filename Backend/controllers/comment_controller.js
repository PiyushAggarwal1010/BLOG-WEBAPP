const commentModel = require("../models/comment_model");
const config = require('../config/config');

const AddComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        const comm = await commentModel.create({
            postId,
            userId,
            content,
        })
        const populatedComment = await comm.populate("userId", "username");

        return res.status(201).json({
            message: "Comment added successfully",
            comm:populatedComment
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await commentModel
            .find({ postId })
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { AddComment, getAllComments };