import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from './Header';
import toast from 'react-hot-toast';

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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load post");
                }
                setPost(data.post);
            } catch (error) {
                toast.error(error.message);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id,navigate])

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

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!post) return null;
    const isOwner = user?._id === post.author?._id;

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <Header />

            <div className="max-w-3xl mx-auto p-6 mt-8 bg-gray-800 rounded-2xl shadow-xl">
                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2 text-sm">Edit Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2 text-sm">Edit Content</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows="8"
                                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap"
                                required
                            />
                        </div>

                        <div className="flex gap-3 justify-end border-t border-gray-700 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditTitle(post.title); // Reset inputs back to actual post details
                                    setEditContent(post.content);
                                }}
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                            <span className="text-gray-400">By {post.author.username}</span>

                            {isOwner && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setEditContent(post.content);
                                            setEditTitle(post.title);
                                            setIsEditing(true);
                                        }}
                                        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded text-sm transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </>
                )}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg w-80">
                    <p className="mb-4 text-center">Are you sure you want to delete this post?</p>

                    <div className="flex justify-center gap-4">
                        <button
                        onClick={() => {
                            setShowConfirm(false);
                            handleDelete(); 
                        }}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                        >
                        Yes
                        </button>

                        <button
                        onClick={() => setShowConfirm(false)}
                        className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
                </div>
                )}
        </div>
    );
}

export default PostDetails
