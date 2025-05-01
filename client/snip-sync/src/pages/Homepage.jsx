import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white font-sans">
      <nav className="w-full flex justify-between p-6 bg-blue-950 shadow-md">
        <h1 className="text-2xl font-bold">SnipSync</h1>
        <div>
          <Link to="/login" className="mr-6 text-lg hover:text-cyan-300">Login</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Organize and Sync Your Snippets Seamlessly</h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          SnipSync is your smart clipboard manager with version control and real-time collaboration.
        </p>
        <Link to="/signup">
          <button className="bg-cyan-400 hover:bg-cyan-500 text-blue-950 font-bold py-3 px-8 rounded-xl text-lg shadow-lg transition">
            Get Started
          </button>
        </Link>
      </main>
    </div>
  );
}

export default Homepage;
