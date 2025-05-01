
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">SnipSync</h1>
        <nav className="flex flex-col space-y-4">
          <Link to="/snippets" className="hover:text-cyan-300">My Snippets</Link>
          <Link to="/profile" className="hover:text-cyan-300">Profile</Link>
          <Link to="/settings" className="hover:text-cyan-300">Settings</Link>
          <Link to="/logout" className="text-red-400 hover:text-red-600">Logout</Link>
        </nav>
      </aside>

     
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Welcome to Your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Snippets</h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Collaborations</h3>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Favorites</h3>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-blue-900">Recent Snippets</h3>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded shadow-md">
              <h4 className="font-bold">React Login Form</h4>
              <p className="text-gray-600 text-sm">Last updated 1 hour ago</p>
            </li>
            <li className="bg-white p-4 rounded shadow-md">
              <h4 className="font-bold">Python API Fetch</h4>
              <p className="text-gray-600 text-sm">Last updated yesterday</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
