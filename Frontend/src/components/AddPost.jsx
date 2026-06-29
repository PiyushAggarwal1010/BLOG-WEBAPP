import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const AddPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const [isPreviewingPost, setIsPreviewingPost] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const PostBlog = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error("Title and Content are required");
            return;
        }

        setLoading(true);
        const formData = new FormData()
        formData.append("title", title);
        formData.append("content", content);

        if (image) {
            formData.append("image", image);
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                method: 'POST',
                credentials: "include",
                body: formData
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create post");
            }
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
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center px-4 font-sans py-12">
            {isPreviewingPost ? (
                <div className="bg-white dark:bg-stone-900 w-full max-w-3xl p-8 md:p-12 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">

                    <div className="flex justify-between items-center mb-8 border-b border-stone-100 dark:border-stone-700 pb-6">
                        <h2 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                            Preview Mode
                        </h2>
                        <button
                            onClick={() => setIsPreviewingPost(false)}
                            className="px-5 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-full text-sm font-medium transition-colors"
                        >
                            Back to Edit
                        </button>
                    </div>

                    <article>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-stone-900 dark:text-white leading-tight tracking-tight wrap-break-word">
                            {title || "Untitled Post"}
                        </h1>

                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-64 md:h-80 object-contain bg-stone-100 dark:bg-stone-800 rounded-xl mt-5 mb-8"
                            />
                        )}

                        <div className="prose prose-stone dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-rose-600 hover:prose-a:text-rose-500 wrap-break-word">
                            <ReactMarkdown>
                                {content || "*No content written yet...*"}
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
            ) : (
                <form
                    onSubmit={PostBlog}
                    className="bg-white dark:bg-stone-900 w-full max-w-2xl p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700"
                >
                    <div className="mb-8 text-center border-b border-stone-100 dark:border-stone-700 pb-6">
                        <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white">
                            Create New Post
                        </h2>
                        <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
                            Share your thoughts with the world.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm tracking-wide">
                            POST TITLE
                        </label>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            value={title}
                            placeholder="Enter the title here..."
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 transition-all font-semibold text-lg placeholder-stone-400 dark:placeholder-stone-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
                            Featured Image
                        </label>

                        <div className="border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 rounded-xl p-6 text-center hover:border-stone-400 dark:hover:border-stone-500 transition cursor-pointer">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="imageUpload"
                            />

                            <label htmlFor="imageUpload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                    <FaUpload className='text-stone-400 dark:text-stone-500 text-3xl' />

                                    <p className="text-stone-600 dark:text-stone-300 font-medium">
                                        Click to upload image
                                    </p>

                                    <p className="text-xs text-stone-400 dark:text-stone-500">
                                        PNG, JPG, WEBP up to 5MB
                                    </p>
                                </div>
                            </label>
                        </div>

                        {preview && (
                            <div className="mt-4 relative">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full h-48 object-cover rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setPreview(null);
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 px-3 py-1 rounded-full text-xs hover:bg-white dark:hover:bg-stone-700 shadow"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
                            Post Content
                        </label>
                        <textarea
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your story here... (Markdown Supported)"
                            value={content}
                            rows="8"
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 transition-all whitespace-pre-wrap leading-relaxed placeholder-stone-400 dark:placeholder-stone-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-full border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsPreviewingPost(true)}
                            className="px-6 py-3 rounded-full border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                            Preview
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="grow bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? "Publishing..." : "Publish Post"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default AddPost
