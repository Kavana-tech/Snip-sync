import React from 'react';
import { Search } from 'lucide-react';
import {Link}  from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-slate-950 bg-opacity-60 backdrop-blur-md shadow-md">
        <h1 className="text-2xl font-bold text-cyan-400">SnipSync</h1>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-white hover:text-cyan-400 transition">Login</Link>
          <Search className="w-5 h-5 text-white hover:text-cyan-400 cursor-pointer" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Organize and Sync Your Snippets Seamlessly
          </span>
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8">
          SnipSync is your smart clipboard manager with version control and real-time collaboration.
        </p>
        <Link to="/signup">
        <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition transform hover:scale-105">
          Get Started →
        </button>
       </Link>
      </section>

      {/* Video Demo Section 
      <section className="flex flex-col items-center px-6 py-12 bg-slate-900">
        <h3 className="text-3xl font-bold text-white mb-6">Watch SnipSync in Action</h3>
        <div className="w-full max-w-3xl aspect-video">
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="SnipSync Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    */}

      {/* Snippet Preview Section 
      <section className="bg-slate-800 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-10">Preview Your Snippets</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-900 rounded-xl p-4 text-left shadow-md border border-slate-700 overflow-hidden"
              >
                <h4 className="text-cyan-400 font-semibold text-lg mb-2">Snippet {idx + 1}</h4>
                <pre className="bg-slate-950 p-3 rounded-md text-sm overflow-x-auto text-slate-300">
{`function greet(name) {
  return "Hello, " + name + "!";
}`}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Feature Highlights */}
      <section className="bg-slate-900 py-16 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10 text-white">Why SnipSync?</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-semibold text-cyan-400 mb-2">Real-time Collaboration</h4>
              <p className="text-slate-300">Share snippets and sync instantly with your team across devices.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-semibold text-cyan-400 mb-2">Version Control</h4>
              <p className="text-slate-300">Keep track of every change and never lose your snippets again.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-semibold text-cyan-400 mb-2">Smart Clipboard</h4>
              <p className="text-slate-300">Automatically save and organize snippets as you work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 text-center text-sm">
        © 2025 SnipSync. All rights reserved.
      </footer>
    </div>
  );
}