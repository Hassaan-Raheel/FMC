import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';
import routes from '../../Routes/Routes';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

function Layout() {
  return (
    <div className="Layout">
      <div className="abc">
        <Sidebar />
      </div>
      <div className="def">
        <Header />
        <div className="ContentWrapper">
          <Routes>
            {routes.map((route) => (
              route.protected ? (
                <Route 
                  key={route.path} 
                  path={route.path} 
                  element={<ProtectedRoute><route.component /></ProtectedRoute>} 
                />
              ) : (
                <Route 
                  key={route.path} 
                  path={route.path} 
                  element={<route.component />} 
                />
              )
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;