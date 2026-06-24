import React, { createContext } from 'react'
import { useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/getMe`, {
                credentials: "include"
            });
            if (!res.ok) {
                setIsLoggedIn(false);
                setUser(null);
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const res = await response.json();

        if (!response.ok) {
            throw new Error(res.message);
        }

        setUser(res.user); 
        setIsLoggedIn(true);
    };

    const register = async (username, email, password) => {
        const newUser = {
            username,
            email,
            password
        };
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
            body: JSON.stringify(newUser)
        })

        const res = await (response.json())
        if (!response.ok) {
            throw new Error(res.message);
        }

        setUser(res.user); 
        setIsLoggedIn(true);
    }

    const logout =async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, checkAuth, loading, logout, login, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
