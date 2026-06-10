import React, { useEffect, useState } from 'react'
import Card from './Card';
import Header from './Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Home = () => {
    const [posts, updatePosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const CreateNewPost = () => {
        if (isLoggedIn) {
            navigate('/AddPost');
        } else {
            navigate('/login');
        }
    }

    useEffect(() => {
        const getPosts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/`);
                const result = await res.json();
                updatePosts(result.posts);
            } catch (error) {
                toast.error("Error while fetching the posts")
            } finally {
                setLoading(false);
            }
        };
        getPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-stone-50 min-h-screen text-stone-800 font-sans">
            <Header />

            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                {searchQuery && (
                    <h2 className="text-xl text-stone-600 mb-8 pb-4 border-b border-stone-200">
                        Showing results for: <span className="text-stone-900 font-semibold">"{searchQuery}"</span>
                    </h2>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Card key={post._id} data={post} />
                        ))
                    ) : (
                        <p className="text-stone-500 col-span-full text-center py-16 text-lg">
                            No posts found.
                        </p>
                    )}
                </div>
            </div>

            <button
                onClick={CreateNewPost}
                className="fixed bottom-8 right-8 bg-stone-900 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-stone-800 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
                <span className="text-xl leading-none mb-0.5">+</span> Add Post
            </button>
        </div>
    )
}

export default Home
