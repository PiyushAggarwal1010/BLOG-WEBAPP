const postModel = require("../models/post_model");
const commentModel = require("../models/comment_model");
const config = require('../config/config')
const cloudinary = require("../config/cloudinary");
const mongoose = require('mongoose');

const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            const error = new Error("Title and Content are required");
            error.statusCode = 400;
            return next(error);
        }
        const imageUrl = req.file ? req.file.path : null;
        const imagePublicId = req.file ? req.file.filename : "";

        const author = req.user.id;
        const post = await postModel.create({
            title,
            content,
            author,
            image: {
                url: imageUrl,
                public_id: imagePublicId
            }
        })
        return res.status(201).json({
            message: "post created successfully",
            post
        })

    } catch (error) {
        next(error);
    }
}

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postModel
            .find({})
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "post fetched successfully",
            posts
        })
    } catch (error) {
        next(error);
    }
}

const getMyPosts = async (req, res, next) => {
    try {
        const id = req.user.id;
        const posts = await postModel
            .find({ author: id })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            message: "Posts fetched successfully",
            posts
        })
    } catch (error) {
        next(error);
    }
}

const deleteMyPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            return next(error);
        }
        if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
            const error = new Error("Not authorized to delete this post");
            error.statusCode = 403;
            return next(error);
        }
        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);
        }

        await commentModel.deleteMany({ postId })

        await post.deleteOne();
        res.status(200).json({
            message: "post deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}

const updateMyPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            return next(error);
        }
        if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
            const error = new Error("Not authorized to update this post");
            error.statusCode = 403;
            return next(error);
        }

        const { title, content } = req.body;
        if (!title && !content) {
            const error = new Error("Title and content are required");
            error.statusCode = 400;
            return next(error);
        }
        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        res.status(200).json({
            message: "post updated succesfully"
        })
    } catch (error) {
        next(error);
    }
}

const getSinglePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;

        const post = await postModel.findById(postId).populate('author', 'username');

        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            return next(error);
        }
        const isLiked = userId
            ? post.likes.some(id => id.toString() === userId)
            : false
            ;

        res.status(200).json({
            post,
            liked: isLiked
        })
    } catch (error) {
        next(error);
    }
}

const handleLikes = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await postModel.findById(postId).select('likes');

        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            return next(error);
        }

        const alreadyLiked = post.likes.includes(userId);

        let updatedPost;
        if (!alreadyLiked) {
            updatedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $addToSet: { likes: userId },
                    $inc: { likesCount: 1 }
                },
                { new: true, select: 'likesCount' }
            );
        } else {
            updatedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $pull: { likes: userId },
                    $inc: { likesCount: -1 }
                },
                { new: true, select: 'likesCount' }
            );
        }

        const io = req.app.get('io');
        if (io) {
            io.to(postId).emit('receive_like', {
                postId: postId,
                newLikesCount: updatedPost.likesCount
            });
        }

        return res.status(200).json({
            message: alreadyLiked ? 'Post unliked' : 'Post liked',
            likesCount: updatedPost.likesCount,
            liked: !alreadyLiked
        });

    } catch (error) {
        next(error);
    }
}

const getUserStats = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const stats = await postModel.aggregate([
            {
                $match: { author: new mongoose.Types.ObjectId(userId) }
            },
            {
                $group: {
                    _id: null,
                    totalPosts: { $sum: 1 },
                    totalLikes: { $sum: "$likesCount" },
                    totalComments: { $sum: "$commentsCount" }
                }
            }
        ]);

        const result = stats[0] || { totalPosts: 0, totalComments: 0, totalLikes: 0 };

        res.json({
            totalPosts: result.totalPosts,
            totalComments: result.totalComments,
            totalLikes: result.totalLikes,
        });

    } catch (error) {
        next(error);
    }
};

const getPosts = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit) || 8;
        if (limit > 48) limit = 48;
        const cursor = req.query.cursor;
        const search = req.query.search;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        if (cursor) {
            if (!mongoose.isValidObjectId(cursor)) {
                const error = new Error("Invalid cursor format");
                error.statusCode = 400;
                return next(error);
            }
            query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
        }

        const posts = await postModel.find(query)
            .sort({ _id: -1 })
            .populate('author', 'username')
            .limit(limit + 1) //+1 for checking next page
            .lean();

        const hasNextPage = posts.length > limit;
        if (hasNextPage) {
            posts.pop();
        }

        res.json({
            posts,
            nextCursor: hasNextPage ? posts[posts.length - 1]._id : null
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, getAllPosts, getMyPosts, deleteMyPost, updateMyPost, getSinglePost, handleLikes, getUserStats, getPosts };