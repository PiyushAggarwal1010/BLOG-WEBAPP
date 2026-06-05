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
        if(isLoggedIn){
            navigate('/AddPost');
        }else{
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
        <div className="bg-gray-900 min-h-screen text-white">
            <Header />

            <div className="p-6 max-w-7xl mx-auto">
                {searchQuery && (
                    <h2 className="text-xl text-gray-300 mb-6">
                        Showing results for: <span className="text-white font-bold">"{searchQuery}"</span>
                    </h2>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Card key={post._id} data={post} />
                        ))
                    ) : (
                        <p className="text-gray-400 col-span-full text-center py-10">
                            No posts found matching your search.
                        </p>
                    )}
                </div>
            </div>

            <button
                onClick={CreateNewPost}
                className="fixed bottom-6 right-6 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                + Add Post
            </button>
        </div>
    )
}

export default Home
