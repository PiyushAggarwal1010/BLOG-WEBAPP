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
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 cursor-pointer hover:underline">
            Register
          </Link>
        </p>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login