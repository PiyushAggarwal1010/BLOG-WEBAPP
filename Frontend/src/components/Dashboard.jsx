import React, { useEffect, useState } from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Card from './Card';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [posts, updatePosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/my-posts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

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
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold m-6 ">
          Welcome, {user?.username}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.length === 0 ? (
            <p className="text-gray-400">
              You haven't created any posts yet.
            </p>
          ) : (
            posts.map((post) => (
              <Card key={post._id} data={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
