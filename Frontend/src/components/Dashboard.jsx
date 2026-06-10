import React, { useEffect, useState } from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Card from './Card';
import Header from './Header';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [posts, updatePosts] = useState([]);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

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

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="bg-stone-50 min-h-screen text-stone-800 font-sans">

      <Header />

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-10 pb-6 border-b border-stone-200">
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight pb-1.5">
            Welcome, {user?.username}
          </h1>
          <p className="text-stone-500 mt-2 text-lg">Manage your published posts below.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.length === 0 ? (
            <p className="text-stone-500 col-span-full text-center py-16 text-lg bg-white rounded-2xl border-2 border-stone-300 border-dashed">
              No Posts Found.
            </p>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post._id} data={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
