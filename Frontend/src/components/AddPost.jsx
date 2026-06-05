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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts` , {
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <form
                onSubmit={PostBlog}
                className="bg-gray-800 w-full max-w-xl p-6 rounded-2xl shadow-lg"
            >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Create New Post
                </h2>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">
                        Enter Title
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter the title here..."
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Content */}
                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">
                        Enter Content
                    </label>
                    <textarea
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter the content here..."
                        rows="5"
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </form>
        </div>
    )
}

export default AddPost
