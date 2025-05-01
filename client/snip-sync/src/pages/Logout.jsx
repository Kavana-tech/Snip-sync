import React from 'react';
import { Link } from 'react-router-dom';

function Logout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white font-sans px-4">
      <div className="bg-gray-800 rounded-xl shadow-md p-8 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">You’ve been logged out</h1>
        <p className="text-gray-300 mb-6">
          Thank you for using <span className="font-semibold text-cyan-400">SnipSync</span>.
        </p>
        <Link to="/login">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition font-semibold">
            Login Again
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Logout;
