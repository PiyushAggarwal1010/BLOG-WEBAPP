import React, { useEffect, useState } from 'react'
import Card from './Card';
import Header from './Header';

const Home = () => {
    const [posts, updatePosts] = useState([]);

    useEffect(() => {
        try {
            const getPosts = async () => {
                const data = await fetch(`http://localhost:3000/api/posts/`);
                const result = await data.json();
                updatePosts(result.posts);
                return;
            };
            getPosts();
        } catch (error) {
            console.log("error while fetching the posts")
        }
    }, [])

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
        </div>
    )
}

export default Home
