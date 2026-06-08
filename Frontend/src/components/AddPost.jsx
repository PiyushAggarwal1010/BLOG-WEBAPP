import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const PostBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!title || !content) {
                toast.error("Title and Content are required")
                return;
            }
            const postData = {
                title,
                content
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            if (!res.ok) {
                setLoading(false);
                throw new Error("Failed to create post");
            }

            console.log(res);
            toast.success("Post created!");
            navigate('/');
        } catch (error) {
            console.error('Error sending data:', error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 font-sans py-12">
            <form
                onSubmit={PostBlog}
                className="bg-white w-full max-w-2xl p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200"
            >
                <div className="mb-8 text-center border-b border-stone-100 pb-6">
                    <h2 className="text-3xl md:text-4xl font-black text-stone-900 ">
                        Create New Post
                    </h2>
                    <p className="text-stone-500 mt-2 font-medium">Share your thoughts with the world.</p>
                </div>

                <div className="mb-6">
                    <label className="block text-stone-500 font-medium mb-2 text-sm tracking-wide">
                        POST TITLE
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter the title here..."
                        className="w-full px-4 py-3 bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 transition-all font-semibold text-lg placeholder-stone-400"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-stone-500 font-medium mb-2 text-sm uppercase tracking-wide">
                        Post Content
                    </label>
                    <textarea
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your story here..."
                        rows="8"
                        className="w-full px-4 py-3 bg-stone-50 text-stone-800 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 transition-all whitespace-pre-wrap leading-relaxed placeholder-stone-400"
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-full text-stone-600 font-medium hover:bg-stone-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="grow bg-stone-900 text-white py-3 rounded-full font-medium hover:bg-stone-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPost
