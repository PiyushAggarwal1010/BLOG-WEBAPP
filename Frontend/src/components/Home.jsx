import React, { useEffect, useState, useRef } from 'react'
import Card from './Card';
import Header from './Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Loader from './Loader';
import { usePosts } from '../hooks/usePosts';


const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const loadMoreRef = useRef();

    const CreateNewPost = () => {
        if (isLoggedIn) {
            navigate('/AddPost');
        } else {
            navigate('/login');
        }
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = usePosts();

    const posts = data?.pages.flatMap((page) => page.posts) || [];

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <Loader />
    }
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

            <div ref={loadMoreRef} className="w-full flex justify-center items-center py-12">
                {isFetchingNextPage ? (
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900" />
                ) : (
                    hasNextPage && <p className="text-stone-400 text-sm font-medium">Scroll down for more</p>
                )}
            </div>
        </div>
    )
}

export default Home
