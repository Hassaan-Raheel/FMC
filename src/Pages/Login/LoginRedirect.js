// LoginRedirect.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from './loginPage'; // Update the import path as needed

const LoginRedirect = () => {
    const token = sessionStorage.getItem('authToken');

    // If token exists, redirect to the dashboard
    if (token) {
        return <Navigate to="/Dashboard" replace />;
    }

    return <LoginForm />; // Render the login form if no token
};

export default LoginRedirect;