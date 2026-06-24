import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from './Header';
import toast from 'react-hot-toast';
import { FaHeart } from "react-icons/fa";
import Loader from './Loader';
import ConfirmModal from './ConfirmModal';
import ReactMarkdown from "react-markdown";
import { HiSparkles } from "react-icons/hi2";

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
    const [isLiking, setIsLiking] = useState(false);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const [summary, setSummary] = useState(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                    credentials: "include"
                })
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load post");
                }
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
            setLoading(true)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to delete post");

            toast.success("Post deleted successfully");
            navigate(-1);
        } catch (error) {
            toast.error(error.message || "Could not delete post");
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title: editTitle, content: editContent })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to update post");
            }
            toast.success("Post updated!");

            setPost({ ...post, title: editTitle, content: editContent });
            setSummary(null);
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleLike = async () => {

        if (isLiking) return;

        const prevLiked = liked;
        const prevLikesCount = likesCount;

        const newLiked = !prevLiked;
        const newLikesCount = newLiked
            ? prevLikesCount + 1
            : prevLikesCount - 1;

        setLiked(newLiked);
        setLikesCount(newLikesCount);

        setIsLiking(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/like`, {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to like post");
            }
        } catch (error) {
            setLiked(prevLiked);
            setLikesCount(prevLikesCount);
            toast.error(error.message);
        } finally {
            setIsLiking(false);
        }
    }

    const addComment = async () => {
        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            setIsCommenting(true);
            const commentData = {
                postId: id,
                userId: user._id,
                content: newComment.trim()
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(commentData)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to comment on post");
            }
            setComments((prev) => [data.comm, ...prev]);
            setNewComment("");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsCommenting(false);
        }
    }

    const handleDeleteComment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/comment/${commentToDelete}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to delete comment");
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentToDelete));
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error(error.message)
        } finally {
            setCommentToDelete(null);
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comment`, {
                    method: "GET",
                    credentials: "include"
                })
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch comments");
                }
                setComments(data.comments);
            } catch (error) {
                toast.error(error.message);
            }
        };
        getComments();
    }, [id])

    const handleGenerateSummary = async () => {
        if (isGeneratingSummary) return;
        try {
            setIsGeneratingSummary(true);
            setSummaryError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ content: post.content })
            });

            if (!response.ok) throw new Error("Failed to generate summary.");

            const data = await response.json();
            setSummary(data.summary);

        } catch (error) {
            setSummaryError("Failed to generate summary.");
            console.error(error);
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    if (loading) return <Loader />;
    if (!post) return null;
    const isOwner = user?._id === post.author?._id;

    return (
        <div className="bg-stone-50 dark:bg-stone-950 min-h-screen text-stone-800 dark:text-stone-200 font-sans transition-colors duration-300">
            <Header />

            <div className="max-w-3xl mx-auto p-8 md:p-12 mt-8 md:mt-12 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <div className="mb-6">
                            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">Edit Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 transition-all font-semibold text-lg placeholder-stone-400 dark:placeholder-stone-600"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">Edit Content</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows="12"
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 transition-all whitespace-pre-wrap leading-relaxed placeholder-stone-400 dark:placeholder-stone-600"
                                required
                            />
                        </div>

                        <div className="flex gap-4 justify-end border-t border-stone-100 dark:border-stone-800 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditTitle(post.title);
                                    setEditContent(post.content);
                                }}
                                className="px-6 py-2.5 rounded-full text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 px-6 py-2.5 rounded-full font-medium transition-colors shadow-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <article>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-stone-900 dark:text-white leading-tight tracking-tight wrap-break-word">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-6 mb-5 gap-4">
                            <div className="flex flex-col">
                                <span className="text-stone-400 dark:text-stone-500 text-sm uppercase tracking-widest font-semibold">By- {post.author.username}</span>
                            </div>

                            {isOwner && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setEditContent(post.content);
                                            setEditTitle(post.title);
                                            setIsEditing(true);
                                        }}
                                        className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {post.image?.url && (
                            <img
                                src={post.image.url}
                                alt="post"
                                className="w-full h-64 md:h-80 object-contain bg-stone-100 dark:bg-stone-800 rounded-xl mt-5 mb-5 transition-colors"
                            />
                        )}

                        {/* summary */}
                        <div className="mb-6">
                            {!summary && !isGeneratingSummary && (
                                <button
                                    onClick={handleGenerateSummary}
                                    className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-stone-200 dark:border-stone-700 shadow-sm"
                                > 
                                    <HiSparkles className="text-amber-500 text-lg" />
                                    <span className="font-semibold">Summarize with AI</span>
                                </button>
                            )}

                            {isGeneratingSummary && (
                                <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400 text-sm font-medium px-4 py-2">
                                    <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
                                    <HiSparkles className="text-amber-500 text-lg" />
                                    Summarizing...
                                </div>
                            )}

                            {summaryError && (
                                <div className="text-rose-500 text-sm font-medium px-4 py-2">
                                    {summaryError}
                                </div>
                            )}

                            {summary && (
                                <div className="bg-linear-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 border border-stone-200 dark:border-stone-700 p-5 rounded-xl shadow-sm relative transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <HiSparkles className="text-amber-500 text-lg" />
                                        <h3 className="text-sm uppercase tracking-widest font-bold text-stone-800 dark:text-stone-200">
                                            AI Summary
                                        </h3>
                                    </div>
                                    <div className="prose prose-sm prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                                        <ReactMarkdown>
                                            {summary}
                                        </ReactMarkdown>
                                    </div>
                                    <button
                                        onClick={() => setSummary(null)}
                                        className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                                        title="Dismiss"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-stone dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-rose-600 dark:prose-a:text-rose-400 hover:prose-a:text-rose-500 dark:hover:prose-a:text-rose-300">
                            <ReactMarkdown>
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* likes */}
                        <div className='flex items-center gap-1 mt-4'>
                            <button
                                onClick={handleLike}
                                className={`text-xl cursor-pointer transition-all duration-200 
                                ${liked
                                        ? "text-red-500 scale-110"
                                        : "text-gray-400 dark:text-stone-600 hover:text-red-300 dark:hover:text-red-400 hover:scale-110"
                                    }`}
                            >
                                <FaHeart />
                            </button>
                            <span className="text-sm text-stone-600 dark:text-stone-400" >{likesCount}</span>
                        </div>

                        {/* Comments */}
                        <div className="mt-12 border-t border-stone-100 dark:border-stone-800 pt-8 transition-colors">

                            <div className="mb-8">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-xl resize-none focus:outline-none focus:ring-2 placeholder-stone-400 dark:placeholder-stone-500 transition-colors"
                                />

                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={addComment}
                                        disabled={isCommenting}
                                        className="bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm disabled:opacity-50">
                                        Add Comment
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold mb-6">
                                    Comments
                                </h2>

                                {comments.length === 0 ? (
                                    <p className="text-stone-400 dark:text-stone-500 text-sm">No comments yet</p>
                                ) : (
                                    <div className="space-y-6">
                                        {comments.map((c) => (
                                            <div key={c._id} className="border-b border-stone-200 dark:border-stone-800 pb-4 transition-colors">

                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                                                        {c.userId?.username || "User"}
                                                    </p>
                                                    <p className="text-xs text-stone-400 dark:text-stone-500">
                                                        {new Date(c.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="block w-full text-sm text-stone-600 dark:text-stone-300 leading-relaxed wrap-break-word whitespace-pre-wrap">
                                                        {c.content}
                                                    </p>
                                                    {user?._id === c.userId?._id && (
                                                        <div className="flex justify-end mt-2">
                                                            <button
                                                                onClick={() => setCommentToDelete(c._id)}
                                                                className="text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </article>
                )}
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                    setShowConfirm(false);
                    handleDelete();
                }}
                title="Delete Post?"
                message="Are you sure you want to permanently delete this post?"
            />

            <ConfirmModal
                isOpen={commentToDelete !== null}
                onClose={() => setCommentToDelete(null)}
                onConfirm={handleDeleteComment}
                title="Delete Comment?"
                message="Are you sure you want to permanently delete this comment?"
            />
        </div>
    );
}

export default PostDetails
