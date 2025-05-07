import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(()=> {
      async function getUser()
      {
          let response =await axios.get("http://localhost:8000/getuser", {withCredentials:true});
          const userData = response.data.userData;
          setFormData({...formData,username: userData.username, email:userData.email})
      }
      getUser();
  }, [])

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className="p-6 bg-gray-900 min-h-screen w-full text-white">

        <h2 className="text-3xl font-bold mb-6">Profile</h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="username"
                value={formData.username || ''}
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
                value={formData.email || ''}
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
            <p className="mb-2"><strong>Username:</strong> {formData.username}</p>
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
    </div>

  );
}

export default Profile;