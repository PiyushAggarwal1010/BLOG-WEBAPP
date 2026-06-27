import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader />;

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the protected admin page
    return <Outlet />;
};

export default AdminRoute;