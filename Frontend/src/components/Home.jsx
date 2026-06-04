import React, { useEffect, useState } from 'react'
import Card from './Card';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const [posts, updatePosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

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
                const res = await fetch(`http://localhost:3000/api/posts/`);
                const result = await res.json();
                updatePosts(result.posts);
            } catch (error) {
                console.log("error while fetching the posts");
            } finally {
                setLoading(false);
            }
        };
        getPosts();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <Header />

            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {posts.map((post) => (
                        <Card key={post._id} data={post} />
                    ))}
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
