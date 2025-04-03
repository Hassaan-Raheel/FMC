import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react'; // Import icons
import './AdminLogin.css'; // Ensure this path is correct for your project
import background from "/bgimage.jpg"; // Import image

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
  
    setError(""); // Clear any previous error message
  
    if (username === "Hassaan" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", username); // Store the username
  
      navigate("/dashboard");
  
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      setError("Invalid username or password");
    }
  };
  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-form-container">
        <div>
          <h2>Welcome!</h2>
          <p>The Furniture Mecca admin panel provides a powerful<br/> dashboard that offers a comprehensive overview of your site.</p>
          <form onSubmit={handleLogin}>
            
            {/* Username Field with Icon in Blue Box */}
            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon-box">
                  <User className="input-icon" size={28} /> {/* Bigger Icon */}
                </div>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field with Icon in Blue Box */}
            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon-box">
                  <Lock className="input-icon" size={28} /> {/* Bigger Icon */}
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Login</button>
          </form>

          <div className="bottom-links">
            <a href="/sign-up">New User? Sign Up</a>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>

      <div className="header-container">
        <div className="furniture-header1">FURNITURE</div>
        <div className="furniture-header2">MECCA</div>
        <div className="furniture-subheader">Lighting | Rugs | Mattresses</div>
      </div>
    </div>
  );
};

export default AdminLogin;
