const postModel = require("../models/post_model");
const config = require('../config/config')
const cloudinary = require("../config/cloudinary");

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                message: "title and content is required"
            })
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
        console.error(error);
        res.status(500).json({
            message: "internal server error",
        })
    }
}

const getAllPosts = async (req, res) => {
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
        console.log(error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

const getMyPosts = async (req, res) => {
    try {
        const id = req.user.id;
        const posts = await postModel.find({ author: id }).populate('author', 'username').sort({ createdAt: -1 });
        res.status(200).json({
            message: "Posts fetched successfully",
            posts
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const deleteMyPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this post"
            })
        }
        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);
        }

        await post.deleteOne();
        res.status(200).json({
            message: "post deleted successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const updateMyPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to update this post"
            })
        }

        const { title, content } = req.body;
        if (!title && !content) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }
        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        res.status(200).json({
            message: "post updated succesfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;

        const post = await postModel.findById(postId).populate('author', 'username');

        if (!post) {
            return res.status(404).json({
                message: "post not found",
            })
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
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const handleLikes = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId
        );

        if (!alreadyLiked) {
            post.likes.push(userId);
            post.likesCount = post.likes.length;
            await post.save();
            return res.status(200).json({
                message: 'Post liked',
                likesCount: post.likesCount,
                liked: true
            });
        }
        else {
            post.likes = post.likes.filter(id => id.toString() !== userId);
            post.likesCount = post.likes.length;
            await post.save();
            return res.status(200).json({
                message: 'Post unliked',
                likesCount: post.likesCount,
                liked: false
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUserStats = async (req, res) => {
    try {
        const userId = req.user?.id;

        const totalPosts = await postModel.countDocuments({ author:userId });
        const userPosts = await postModel.find({ author:userId });

        let totalLikes = 0;
        let totalComments = 0;
        userPosts.forEach(post => {
            totalLikes += post.likesCount;
            totalComments += post.commentsCount;
        });

        res.json({
            totalPosts,
            totalComments,
            totalLikes,
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

module.exports = { createPost, getAllPosts, getMyPosts, deleteMyPost, updateMyPost, getSinglePost, handleLikes, getUserStats };