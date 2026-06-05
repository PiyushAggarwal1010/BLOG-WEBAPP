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
  const { checkAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const newUser = {
        username,
        email,
        password
      };
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(newUser)
      })

      const res = await (response.json())
      if (!response.ok) {
        toast.error(res.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.token);
      await checkAuth();

      toast.success('Successfully registered!');
      console.log(res);
      navigate('/')

    } catch (error) {
      toast.error('registration error')
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Username
            </label>
            <input onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 cursor-pointer hover:underline">
            Login
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

export default Register
