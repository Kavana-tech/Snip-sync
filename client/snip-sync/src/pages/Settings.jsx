import React from 'react';

function Settings() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-md p-8 space-y-10">
        <h1 className="text-3xl font-bold">Settings</h1>

        
        <section>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded">
              Save Profile
            </button>
          </div>
        </section>

        
        <section>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded">
              Update Password
            </button>
          </div>
        </section>

        
        <section>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-cyan-500 h-5 w-5" />
              <span>Email me about new features</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-cyan-500 h-5 w-5" />
              <span>Notify me when someone shares a snippet</span>
            </label>
          </div>
        </section>

        
        <section>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-cyan-500 h-5 w-5" />
            <span>Enable Dark Mode</span>
          </label>
        </section>

        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;
