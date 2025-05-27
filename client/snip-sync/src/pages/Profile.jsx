import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { FaUserCircle, FaCamera } from 'react-icons/fa';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    jobTitle: '',
    linkedin: '',
    github: '',
    website: '',
  });

  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function getUser() {
      let response = await axios.get("http://localhost:8000/getuser", { withCredentials: true });
      const userData = response.data.userData;
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || '',
        location: userData.location || '',
        jobTitle: userData.jobTitle || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        website: userData.website || '',
      });
      setImage(userData.profilePic || '');
    }
    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const form = new FormData();
      form.append("image", file);
      try {
        let res = await axios.post("http://localhost:8000/upload", form, { withCredentials: true });
        setImage(res.data.url);
      } catch (err) {
        alert("Image upload failed");
      }
      setPreview('');
    }
  };

  const deleteImage = async () => {
    await axios.post("http://localhost:8000/deleteprofilepic", {}, { withCredentials: true });
    setImage("");
    setPreview('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/updateprofile", { ...formData, profilePic: image }, { withCredentials: true });
      alert("Profile updated!");
      setIsEditing(false);
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className="p-6 bg-gray-900 min-h-screen w-full text-white">
        <h2 className="text-3xl font-bold mb-6">Profile</h2>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative group w-24 h-24">
            {preview ? (
              <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400" />
            ) : image ? (
              <img src={image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-white" />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-700 text-white text-4xl">
                <FaUserCircle />
              </div>
            )}
            {/* Camera icon overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center group-hover:scale-110"
              style={{ border: '2px solid white' }}
              aria-label="Upload Photo"
            >
              <FaCamera className="text-white text-lg" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImage}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="space-y-2">
            {(image || preview) && (
              <button onClick={deleteImage} className="bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700 transition-colors duration-150">
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { name: 'username', type: 'text', label: 'Username' },
              { name: 'email', type: 'email', label: 'Email' },
              { name: 'location', type: 'text', label: 'Location' },
              { name: 'jobTitle', type: 'text', label: 'Job Title' },
              { name: 'bio', type: 'textarea', label: 'Bio' },
              { name: 'linkedin', type: 'url', label: 'LinkedIn' },
              { name: 'github', type: 'url', label: 'GitHub' },
              { name: 'website', type: 'url', label: 'Website' },
            ].map(({ name, type, label }) => (
              <div key={name}>
                <label className="block text-sm mb-1">{label}</label>
                {type === 'textarea' ? (
                  <textarea name={name} value={formData[name]} onChange={handleChange} className="p-2 w-full rounded bg-gray-800 text-white border" rows={3} />
                ) : (
                  <input type={type} name={name} value={formData[name]} onChange={handleChange} className="p-2 w-full rounded bg-gray-800 text-white border" />
                )}
              </div>
            ))}
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => { setIsEditing(false); setPreview(''); }} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p><strong>Username:</strong> {formData.username}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
            {formData.jobTitle && <p><strong>Job Title:</strong> {formData.jobTitle}</p>}
            {formData.bio && <p><strong>Bio:</strong> {formData.bio}</p>}
            {formData.linkedin && <p><strong>LinkedIn:</strong> <a href={formData.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline">{formData.linkedin}</a></p>}
            {formData.github && <p><strong>GitHub:</strong> <a href={formData.github} target="_blank" rel="noreferrer" className="text-blue-400 underline">{formData.github}</a></p>}
            {formData.website && <p><strong>Website:</strong> <a href={formData.website} target="_blank" rel="noreferrer" className="text-blue-400 underline">{formData.website}</a></p>}

            <button onClick={() => setIsEditing(true)} className="bg-blue-600 px-4 py-2 mt-4 rounded hover:bg-blue-700">Edit Profile</button>
          </div>
        )}

        {/* Change Password */}
        <div className="mt-10">
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700">
            {showPasswordForm ? "Cancel Password Change" : "Change Password"}
          </button>

          {showPasswordForm && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.post('http://localhost:8000/change-password', passwords, { withCredentials: true });
                alert("Password changed successfully!");
                setShowPasswordForm(false);
              } catch (err) {
                alert(err.response?.data?.message || "Error changing password");
              }
            }} className="mt-4 space-y-4">
              <input type="password" placeholder="Current Password" onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="p-2 w-full rounded bg-gray-800 border" required />
              <input type="password" placeholder="New Password" onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="p-2 w-full rounded bg-gray-800 border" required />
              <button type="submit" className="bg-green-600 px-4 py-2 rounded">Update Password</button>
            </form>
          )}
        </div>

        {/* Delete Profile */}
        <div className="mt-10">
          <button onClick={() => setShowDeleteConfirm(true)} className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700">
            Delete Profile
          </button>

          {showDeleteConfirm && (
            <div className="bg-gray-800 p-4 mt-4 rounded text-white">
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="flex gap-4 mt-4">
                <button onClick={async () => {
                  await axios.delete("http://localhost:8000/delete-profile", { withCredentials: true });
                  alert("Account deleted.");
                  window.location.href = "/";
                }} className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded">
                  Confirm Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-600 px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;