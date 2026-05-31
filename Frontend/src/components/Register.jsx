import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  function handleNameChange(val) {
    setUsername(val);
  }
  function handleEmailChange(val) {
    setEmail(val);
  }
  function handlePassChange(val) {
    setPassword(val);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const newUser = {
        username,
        email,
        password
      };

      const response = await fetch(`http://localhost:3000/api/auth/register`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(newUser)
      })

      const res=await(response.json())
      if (!response.ok) {
        toast.error(res.message);
        return;
      }
      toast.success('Successfully registered!');
      console.log(res);
      navigate('/dashboard')
      
    } catch (error) {
      toast.error('registration error')
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Username
            </label>
            <input onChange={(e) => handleNameChange(e.target.value)}
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Email
            </label>
            <input onChange={(e) => handleEmailChange(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Password
            </label>
            <input onChange={(e) => handlePassChange(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
