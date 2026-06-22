import React, { useEffect, useState } from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Card from './Card';
import Header from './Header';
import { useSearchParams } from 'react-router-dom';
import Loader from './Loader';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  });

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
        const [postsRes, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/posts/my-posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/posts/user/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!postsRes.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData = await postsRes.json();
        const statsData = await statsRes.json();

        updatePosts(postsData.posts);
        setStats(statsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.message || "Error while fetching the posts");
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

  if (loading) {
    return <Loader />
  }
  return (
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen text-stone-800 dark:text-stone-200 font-sans transition-colors duration-300">

      <Header />

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-colors">

          <div className="flex items-center gap-4">

            <div className="w-15 h-15 rounded-full bg-stone-300 dark:bg-stone-700 cursor-pointer flex items-center justify-center font-semibold text-2xl text-stone-800 dark:text-stone-200 transition-colors">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                {user?.username}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {user?.email}
              </p>
            </div>

          </div>

          <div className="flex gap-8 text-center">

            <div>
              <p className="text-lg font-bold text-stone-900 dark:text-white">{stats.totalPosts}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Posts</p>
            </div>

            <div>
              <p className="text-lg font-bold text-stone-900 dark:text-white">{stats.totalLikes}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Likes</p>
            </div>

            <div>
              <p className="text-lg font-bold text-stone-900 dark:text-white">{stats.totalComments}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Comments</p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.length === 0 ? (
            <p className="text-stone-500 dark:text-stone-400 col-span-full text-center py-16 text-lg bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-700 border-dashed transition-colors">
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
