const commentModel = require("../models/comment_model");
const postModel = require("../models/post_model");
const config = require('../config/config');

const AddComment = async (req, res,next) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        if (!content) {
            const error = new Error("Content is required");
            error.statusCode = 400;
            return next(error);
        }

        const post = await postModel.findById(postId);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            return next(error);
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

        const io = req.app.get('io');
        if (io) {
            io.to(postId).emit('receive_comment', populatedComment);
        }

        return res.status(201).json({
            message: "Comment added successfully",
            comm: populatedComment
        })

    } catch (error) {
        next(error);
    }
}

const getAllComments = async (req, res,next) => {
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
        next(error);
    }
}

const deleteComment = async (req, res,next) => {
    try {
        const commentId = req.params.id;
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            const error = new Error("Comment not found");
            error.statusCode = 404;
            return next(error);
        }
        const userId = req.user.id;

        if (req.user.role !== 'admin' && !comment.userId.equals(userId)) {
            const error = new Error("Unauthorized to delete this comment");
            error.statusCode = 403;
            return next(error);
        }

        const postId = comment.postId;

        await commentModel.findByIdAndDelete(commentId);

        await postModel.findByIdAndUpdate(postId, {
            $inc: { commentsCount: -1 }
        });

        const io = req.app.get('io');
        io.to(postId.toString()).emit('comment_deleted', commentId);

        return res.status(200).json({
            message: "Comment deleted successfully"
        })

    } catch (error) {
        next(error);
    }
}

module.exports = { AddComment, getAllComments, deleteComment };