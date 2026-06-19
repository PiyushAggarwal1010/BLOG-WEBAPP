const commentModel = require("../models/comment_model");
const postModel = require("../models/post_model");
const config = require('../config/config');

const AddComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comm = await commentModel.create({
            postId,
            userId,
            content,
        })
        const populatedComment = await comm.populate("userId", "username");

        await postModel.findByIdAndUpdate(postId, {
            $inc: { commentsCount: 1 }
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comm: populatedComment
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

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const userId = req.user.id;

        if (!comment.userId.equals(userId)) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" })
        }

        const postId = comment.postId;

        await commentModel.findByIdAndDelete(commentId);

        await postModel.findByIdAndUpdate(postId, {
            $inc: { commentsCount: -1 }
        });
        return res.status(200).json({
            message: "Comment deleted successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { AddComment, getAllComments, deleteComment };