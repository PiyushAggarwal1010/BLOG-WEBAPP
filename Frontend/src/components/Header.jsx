import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn,user,logout,loading}=useContext(AuthContext);

    if (loading) return null;

    const handleLogout=()=>{
        logout();
        navigate('/');
        return;
    }
    
    return (
        <div>
            <div className="bg-gray-900 text-white px-7 py-4 flex items-center justify-between border-2">
                <h1 className="text-xl font-bold">My Blog App</h1>

                <div className="flex gap-4 items-center">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    {isLoggedIn ?
                        <div>
                            <Link to="/dashboard" className="hover:text-gray-300 mx-2">My Profile</Link>

                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 mx-2 rounded hover:bg-red-700">
                                Logout
                            </button>
                        </div>
                        :
                        <div>
                            <Link to="/login" className="hover:text-gray-300 mx-2">Login</Link>
                            <Link to="/register" className="hover:text-gray-300 mx-2">Sign In</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header
