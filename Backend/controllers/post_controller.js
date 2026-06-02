const postModel = require("../models/post_model");
const config = require('../config/config')

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                message: "title and content is required"
            })
        }
        const author = req.user.id;
        const post = await postModel.create({
            title,
            content,
            author,
        })
        res.status(201).json({
            message: "post created succesfully",
            post
        })

    } catch (error) {
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

        res.status(200).json({
            message: "post fetched succesfully",
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
        const posts = await postModel.find({ author: id }).sort({ createdAt: -1 });
        if (posts.length === 0) {
            return res.status(404).json({
                message: "No posts found"
            })
        }
        res.status(200).json({
            message: "Posts fetched succesfully",
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
        await post.deleteOne();
        res.status(200).json({
            message: "post deleted succesfully"
        })
    } catch (error) {
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
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = { createPost, getAllPosts, getMyPosts, deleteMyPost, updateMyPost };