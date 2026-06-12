import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/BlOGIFY-LOGO.png"

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user, logout, loading } = useContext(AuthContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef();

    //to close dropdown on clicking anywhere outside it
    useEffect(() => {
        const handler = (e) => {
            if (!dropdownRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [])

    if (loading) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
        return;
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            navigate(`${location.pathname}`);
            return;
        }
        navigate(`${location.pathname}/?q=${encodeURIComponent(searchQuery)}`);
    }


    return (
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row gap-4 items-center justify-between">

                <img src={logo} alt="Blog App" className='h-15 w-auto object-contain' />

                <form onSubmit={handleSearch} className="flex items-center bg-stone-100 rounded-full px-4 py-2.5 w-full sm:w-95 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-all">
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

                <nav className="flex gap-6 items-center text-md font-medium">
                    <Link to="/" className="text-stone-600 hover:text-stone-900 transition-colors">Home</Link>

                    {isLoggedIn ? (
                        <div ref={dropdownRef} className="relative" >
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 text-stone-700 hover:text-stone-900"
                            >
                                <div className="w-9 h-9 rounded-full bg-stone-300 cursor-pointer flex items-center justify-center font-semibold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            </button>
                            {open && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded-lg shadow-md py-2 z-50">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                                        onClick={() => setOpen(false)}
                                    >
                                        View Profile
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setShowConfirm(true);
                                            setOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
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
            {showConfirm && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white text-stone-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all">

                        <p className="mb-8 text-center text-stone-500 leading-relaxed">
                            Are you sure you want to Logout?
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full sm:w-auto bg-stone-100 text-stone-700 px-6 py-2.5 rounded-full font-medium hover:bg-stone-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    handleLogout();
                                }}
                                className="w-full sm:w-auto bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-700 transition-colors shadow-sm"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
