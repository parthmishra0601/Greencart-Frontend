import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const navItems = [
  { label: "Home", icon: "🏠", path: "/" },
  { label: "Cart", icon: "🛒", path: "/cart" },
  { label: "Dashboard", icon: "📊", path: "/dashboard" },
  { label: "Saved Lists", icon: "💾", path: "/saved" },
  { label: "Sustainability Tips", icon: "🌿", path: "/tips" },
];

export default function Sidebar() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // In a real application, you would also clear user session data here (e.g., tokens from localStorage)
    console.log("User logged out!");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <aside className="h-screen w-64 bg-emerald-700 shadow-2xl flex flex-col text-white">
      {/* Top section */}
      <div className="p-6 flex-1 flex flex-col">
        <h1 className="text-3xl font-extrabold text-white mb-8 mt-2">GreenCart AI</h1>
        <nav className="space-y-3 flex-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="block">
              <div className="flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer text-emerald-100 hover:bg-emerald-600 hover:text-white transform hover:translate-x-1">
                <span className="text-2xl mr-4">{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-6 border-t border-emerald-600">
        <button
          onClick={handleLogout} // Attach the click handler here
          className="w-full bg-emerald-600 hover:bg-emerald-800 text-white py-3 rounded-lg transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}