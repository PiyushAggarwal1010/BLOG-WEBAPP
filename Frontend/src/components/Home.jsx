import React, { useEffect, useState } from 'react'
import Card from './Card';
import Header from './Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Loader from './Loader';
import { usePosts } from '../hooks/usePosts';
import { useInView } from 'react-intersection-observer';

const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const { ref, inView } = useInView({
        rootMargin: "100px",
    });

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
    } = usePosts(searchQuery);

    const posts = data?.pages.flatMap((page) => page.posts) || [];

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="bg-stone-50 dark:bg-stone-950 min-h-screen text-stone-800 dark:text-stone-200 font-sans transition-colors">
            <Header />

            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                {searchQuery && (
                    <h2 className="text-xl text-stone-600 dark:text-stone-400 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800 transition-colors">
                        Showing results for: <span className="text-stone-900 dark:text-white font-semibold">"{searchQuery}"</span>
                    </h2>
                )}
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Card key={post._id} data={post} />
                            ))
                        ) : (
                            <p className="text-stone-500 dark:text-stone-400 col-span-full text-center py-16 text-lg">
                                No posts found.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={CreateNewPost}
                className="fixed bottom-8 right-8 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-full font-medium shadow-lg hover:bg-stone-800 dark:hover:bg-stone-200 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
                <span className="text-xl leading-none mb-0.5">+</span> Add Post
            </button>

            {!isLoading && hasNextPage && (
                <div ref={ref} className="w-full flex justify-center items-center py-12">
                    {isFetchingNextPage ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 dark:border-stone-700 border-t-stone-900 dark:border-t-white" />
                    ) : (
                        <p className="text-stone-400 dark:text-stone-500 text-sm font-medium">Scroll down for more</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home
