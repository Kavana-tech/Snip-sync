import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await axios.get("http://localhost:8000/logout", { withCredentials: true });
        navigate("/logout-confirm");
      } catch (err) {
        alert("Logout failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white font-sans px-4">
      <div className="bg-gray-800 rounded-xl shadow-md p-8 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Logout</h1>
        <p className="text-gray-300 mb-6">
          Are you sure you want to log out of <span className="font-semibold text-cyan-400">SnipSync</span>?
        </p>
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition font-semibold mb-2"
          onClick={handleLogout}
        >
          Yes, Logout
        </button>
        <br />
        <Link to="/">
          <button className="mt-2 text-cyan-400 underline">Cancel</button>
        </Link>
      </div>
    </div>
  );
}

export default Logout;
