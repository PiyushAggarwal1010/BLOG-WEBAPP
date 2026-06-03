import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Protected = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) return <p>Checking auth...</p>;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default Protected;