import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user, logout, loading } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('')
    if (loading) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
        return;
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            navigate('/');
            return;
        }

        navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }

    return (
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Link to="/" className="text-2xl font-black text-stone-900 tracking-tight hover:text-stone-700 transition-colors">
                    My Blog App
                </Link>

                <form onSubmit={handleSearch} className="flex items-center bg-stone-100 rounded-full px-4 py-2 w-full sm:w-80 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-all">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-stone-800 placeholder-stone-500 focus:outline-none w-full"
                    />
                    <button type="submit" onClick={handleSearch} className="text-stone-400 hover:text-stone-700 pl-2 cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </form>

                <nav className="flex gap-6 items-center text-sm font-medium">
                    <Link to="/" className="text-stone-600 hover:text-stone-900 transition-colors">Home</Link>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="text-stone-600 hover:text-stone-900 transition-colors">My Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-stone-600 hover:text-stone-900 transition-colors">Login</Link>
                            <Link to="/register" className="bg-stone-900 text-white px-5 py-2 rounded-full hover:bg-stone-800 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
