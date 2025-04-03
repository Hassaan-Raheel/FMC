import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout/Layout.js';
import LoginForm from './Pages/Login/loginPage.js';
import LoginRedirect from './Pages/Login/LoginRedirect.js';
import useTokenVerification from './Pages/Login/TokenValidation.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // const token = sessionStorage.getItem('token');
  useTokenVerification(); // Initialize the token verification
  
  return (
    <Router>
      {/* Add ToastContainer once at the root level */}
      <ToastContainer 
          position="top-right" 
          autoClose={false} 
          hideProgressBar={false} 
          closeOnClick 
          pauseOnHover 
          draggable 
          pauseOnFocusLoss 
      />
      <Routes>
        {/* Separate login route without Layout */}
        {/* <Route path="/" element={token ? <Navigate to="/Dashboard" /> : <LoginForm />}  /> */}
        <Route path="/" element={<LoginRedirect />} />

        {/* All other routes wrapped inside Layout */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
