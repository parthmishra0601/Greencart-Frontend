// src/App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Cart from './Components/Cart';
import Dashboard from './Components/Dashboard';
import SavedLists from './Components/SavedLists';
import SustainabilityTips from './Components/SustainabilityTips';
import LoginPage from './Components/Login';
import SignupPage from './Components/SignUp';
import { CartProvider } from './Components/CartContext';

function App() {
  const location = useLocation();

  // Hide sidebar on login and signup routes
  const hideSidebarPaths = ['/login', '/signup'];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {showSidebar && <Sidebar />}

      <div className="flex-grow flex items-center justify-center">
        <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved" element={<SavedLists />} />
            <Route path="/tips" element={<SustainabilityTips />} />
          </Routes>
        </CartProvider>
      </div>
    </div>
  );
}

export default App;
