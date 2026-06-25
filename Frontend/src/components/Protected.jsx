import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Loader from './Loader'

const Protected = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default Protected;