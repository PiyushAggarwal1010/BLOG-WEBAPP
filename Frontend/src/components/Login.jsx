import React, { useState } from 'react'
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen flex items-center justify-center px-4 font-sans py-12 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 w-full max-w-md transition-colors">

        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-stone-900 dark:text-white">
            Welcome Back
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">Log in to manage your posts.</p>
        </div>

        <form onSubmit={handleLogin}>
          
          <div className="mb-5">
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium placeholder-stone-400 dark:placeholder-stone-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium placeholder-stone-400 dark:placeholder-stone-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-md disabled:opacity-50 text-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-stone-500 dark:text-stone-400 text-sm text-center mt-8 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-stone-900 dark:text-white font-bold hover:underline">
            Register
          </Link>
        </p>
        
        <div className="text-center mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 transition-colors">
          <Link to="/" className="text-sm font-medium text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login