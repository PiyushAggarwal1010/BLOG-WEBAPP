import React, {useState} from 'react'
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  function handleEmailChange(val) {
    setEmail(val);
  }
  function handlePassChange(val) {
    setPassword(val);
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const user = {
        email,
        password
      }
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(user)
      })
      
      const res=await(response.json())
      if (!response.ok) {
        toast.error(res.message);
        return;
      }
      toast.success('login succesfull!');
      console.log(res);
      localStorage.setItem("token", res.token);
      navigate('/dashboard')
    } catch (error) {
      toast.error("login error")
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
            <input onChange={(e) => handleEmailChange(e.target.value)}
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 cursor-pointer hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login