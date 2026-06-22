import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await register(username,email,password);

      toast.success('Successfully registered!');
      navigate('/')
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
            <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Create Account
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">Join us to start publishing your stories.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-5">
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
              Username
            </label>
            <input onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-white font-medium placeholder-stone-400 dark:placeholder-stone-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium placeholder-stone-400 dark:placeholder-stone-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-stone-500 dark:text-stone-400 font-medium mb-2 text-sm uppercase tracking-wide">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium placeholder-stone-400 dark:placeholder-stone-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-md disabled:opacity-50 text-lg"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-stone-500 dark:text-stone-400 text-sm text-center mt-8 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-stone-900 dark:text-white font-bold hover:underline">
            Login
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

export default Register
