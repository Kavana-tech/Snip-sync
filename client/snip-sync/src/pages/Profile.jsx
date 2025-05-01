import React, { useState } from 'react';

function Profile() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here we can make an API call to save the updated data
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 w-full rounded bg-gray-800 text-white border"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 w-full rounded bg-gray-800 text-white border"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p className="mb-2"><strong>Name:</strong> {formData.name}</p>
          <p className="mb-4"><strong>Email:</strong> {formData.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;