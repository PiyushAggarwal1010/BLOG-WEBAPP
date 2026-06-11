import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from './Header';
import toast from 'react-hot-toast';
import { FaHeart } from "react-icons/fa";

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load post");
                }
                console.log(data)
                setPost(data.post);
                setLiked(data.liked);
                setLikesCount(data.post?.likesCount || 0);
            } catch (error) {
                toast.error(error.message);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, navigate])

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to delete post");

            toast.success("Post deleted successfully");
            navigate(-1);
        } catch (error) {
            toast.error(error.message || "Could not delete post");
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: editTitle, content: editContent })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to update post");
            }
            toast.success("Post updated!");

            setPost({ ...post, title: editTitle, content: editContent });
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to like post");
            const data = await res.json();

            setLiked(data.liked);
            setLikesCount(data.likesCount);
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!post) return null;
    const isOwner = user?._id === post.author?._id;

    return (
        <div className="bg-stone-50 min-h-screen text-stone-800 font-sans">
            <Header />

            <div className="max-w-3xl mx-auto p-8 md:p-12 mt-8 md:mt-12 bg-white rounded-2xl shadow-sm border border-stone-200">
                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <div className="mb-6">
                            <label className="block text-stone-500 font-medium mb-2 text-sm uppercase tracking-wide">Edit Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 transition-all font-semibold text-lg"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-stone-500 font-medium mb-2 text-sm uppercase tracking-wide">Edit Content</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows="12"
                                className="w-full px-4 py-3 bg-stone-50 text-stone-800 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 transition-all whitespace-pre-wrap leading-relaxed"
                                required
                            />
                        </div>

                        <div className="flex gap-4 justify-end border-t border-stone-100 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditTitle(post.title);
                                    setEditContent(post.content);
                                }}
                                className="px-6 py-2.5 rounded-full text-stone-600 font-medium hover:bg-stone-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <article>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-stone-900 leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap justify-between items-center border-b border-stone-100 pb-6 mb-8 gap-4">
                            <div className="flex flex-col">
                                <span className="text-stone-400 text-sm uppercase tracking-widest font-semibold">Author</span>
                                <span className="text-stone-800 font-medium">{post.author.username}</span>
                            </div>

                            {isOwner && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setEditContent(post.content);
                                            setEditTitle(post.title);
                                            setIsEditing(true);
                                        }}
                                        className="bg-stone-100 text-stone-700 hover:bg-stone-200 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="text-stone-700 leading-loose whitespace-pre-wrap text-lg md:text-xl wrap-break-word font-serif">
                            {post.content}
                        </div>
                        <div className='flex items-center gap-1 mt-4'>
                            <button
                                onClick={handleLike}
                                className={`text-xl cursor-pointer transition-all duration-200 
                                ${liked
                                        ? "text-red-500 scale-110"
                                        : "text-gray-400 hover:text-red-300 hover:scale-110"
                                    }`}
                            >
                                <FaHeart />
                            </button>
                            <span className="text-sm text-stone-600" >{likesCount}</span>
                        </div>

                    </article>
                )}
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white text-stone-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all">
                        <h3 className="text-xl font-bold mb-2 text-stone-900 text-center">Delete Post?</h3>
                        <p className="mb-8 text-center text-stone-500 leading-relaxed">
                            Are you sure you want to permanently delete this post?
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full sm:w-auto bg-stone-100 text-stone-700 px-6 py-2.5 rounded-full font-medium hover:bg-stone-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    handleDelete();
                                }}
                                className="w-full sm:w-auto bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-700 transition-colors shadow-sm"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostDetails
