import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/BLOGIFY-LOGO.png"
import dark_logo from "../assets/BLOGIFY-LOGO-DARK.png"
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from '../context/ThemeContext';
import { FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal';

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user, logout, loading } = useContext(AuthContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("q") || ''
    );

    const debouncedSearch = useDebounce(searchQuery, 300);

    const { theme, toggleTheme } = useTheme();

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

    const handleLogout = () => {
        logout();
        navigate('/login');
        return;
    }

    useEffect(() => {
        const currentQuery = searchParams.get("q") || "";
        if (debouncedSearch === currentQuery) return;

        const params = new URLSearchParams(searchParams);

        if (!debouncedSearch.trim()) {
            params.delete("q");
        } else {
            params.set("q", debouncedSearch);
        }

        setSearchParams(params, { replace: true });
    }, [debouncedSearch, searchParams]);

    if (loading) return null;

    return (
        <header className="bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row gap-4 items-center justify-between">

                <img src={theme==="light" ? logo : dark_logo} alt="Blog App" className='h-15 w-auto object-contain' />

                <div className="flex items-center bg-stone-100 dark:bg-stone-900 rounded-full px-4 py-2.5 w-full sm:w-95 border border-transparent focus-within:border-stone-300 dark:focus-within:border-stone-600 focus-within:bg-white dark:focus-within:bg-stone-950 transition-all">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-stone-800 dark:text-white placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none w-full transition-colors"
                    />

                    <FaSearch className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 pl-2 cursor-pointer transition-colors text-2xl" />
                </div>

                <nav className="flex gap-6 items-center text-md font-medium">

                    <button
                        onClick={toggleTheme}
                        className="w-14 h-8 flex items-center bg-stone-300 dark:bg-stone-700 rounded-full p-1 transition-all duration-300"
                    >
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-stone-900 shadow-md transform transition-all duration-300
                                        ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
                                    `}
                        >
                            {theme === "dark"
                                ? <FaMoon className="text-indigo-400 text-lg" />
                                : <FaSun className="text-amber-400 text-lg" />
                            }
                        </div>
                    </button>

                    <Link to="/" className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors">Home</Link>

                    {isLoggedIn ? (
                        <div ref={dropdownRef} className="relative" >
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 text-stone-700 hover:text-stone-900"
                            >
                                <div className="w-9 h-9 rounded-full bg-stone-300 dark:bg-stone-700 cursor-pointer flex items-center justify-center font-semibold text-stone-700 dark:text-stone-200 transition-colors">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            </button>
                            {open && (
                                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-md py-2 z-50 transition-colors">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        View Profile
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setShowConfirm(true);
                                            setOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-5 py-2 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                    setShowConfirm(false);
                    handleLogout();
                }}
                title="Confirm Logout"
                message="Are you sure you want to Logout?"
            />
        </header>
    )
}

export default Header
