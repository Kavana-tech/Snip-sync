// Teams.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Teams() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/fetchprojects', { withCredentials: true })
      .then((res) => {
        setProjects(res.data.fetchedProjects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className='flex'>
      <Sidebar />
    <div className="p-8 bg-gray-900 min-h-screen w-full">
      <h2 className="text-3xl font-bold mb-6 text-blue-300 text-center">Project Teams</h2>

      {/* <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Create New Team</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Project Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Add member by email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Team
          </button>
        </form>
      </div> */}

      {loading ? (
        <div className="text-center text-blue-300 text-lg">Loading teams...</div>
      ) : (
        <div>
          {projects.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500">
              No teams found.
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={project._id || index} className="bg-gray-700 p-6 text-white rounded-lg shadow-sm  hover:shadow-lg transition w-full mb-4">
                <h3 className="text-xl font-bold text-blue-300 mb-1">{project.title}</h3>
                <p className="font-semibold text-gray-300 mb-2 mt-2">
                  <span className="font-semibold text-blue-300">Description:</span> {project.description || 'No description'}
                </p>
                <div className="mb-2">
                  <span className="font-semibold text-blue-300">Working As:</span> {project.workingAs}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-300">Created By:</span> {project.createdBy}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-300">Created At:</span> {new Date(project.createdAt).toLocaleString()}
                </div>
                <p className="text-white mb-2 font-medium">Team Members:</p>
                <ul className="flex flex-wrap gap-2 mb-4">
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    project.teamMembers.map((member, i) => (
                      <li
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                      >
                        {member.username || member.email}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">No members yet</li>
                  )}
                </ul>
                <div className="flex gap-4">
                  <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Invite</button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export default Teams;
