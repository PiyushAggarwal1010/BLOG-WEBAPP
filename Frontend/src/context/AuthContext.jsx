import React, { createContext } from 'react'
import { useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/api/auth/getMe`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }
            const data = await res.json();
            setUser(data.user);
            setIsLoggedIn(true);
            setLoading(false);
            return;
        } catch (error) {
            console.log(error);
            setIsLoggedIn(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const res = await response.json();

        if (!response.ok) {
            throw new Error(res.message);
        }

        localStorage.setItem("token", res.token);

        setUser(res.user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, loading, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
