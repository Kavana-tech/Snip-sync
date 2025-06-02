import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    theme: "system",
    profileVisibility: "public",
    emailNotifications: true,
    snippetAlerts: true,
  });

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would send the settings to your backend (POST request)
    console.log("Settings saved:", settings);
    alert("Settings updated successfully!");
  };

  return (
    <div className="flex ml-64">
      <Sidebar />
      <div className="p-6 w-full min-h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Settings</h2>

        {/* Account & Security */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Account & Security</h3>
          <label className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onChange={handleToggle}
            />
            Enable Two-Factor Authentication (2FA)
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="loginAlerts"
              checked={settings.loginAlerts}
              onChange={handleToggle}
            />
            Email me when a new device logs in
          </label>
        </div>

        {/* Profile Customization */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Profile Customization</h3>
          <div className="mb-3">
            <label className="block mb-1">Theme Preference</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleSelect}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Profile Visibility</label>
            <select
              name="profileVisibility"
              value={settings.profileVisibility}
              onChange={handleSelect}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Notifications</h3>
          <label className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleToggle}
            />
            Receive Email Notifications
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="snippetAlerts"
              checked={settings.snippetAlerts}
              onChange={handleToggle}
            />
            Notify me about snippet activity
          </label>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
