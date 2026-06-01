import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // ✅ no token → go login
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
          navigate("/");
        }else{
          setLoading(false)
        }

      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Checking auth...</p>;
  return (
    <div>
      <h1>this is dashboard</h1>
    </div>
  )
}

export default Dashboard
