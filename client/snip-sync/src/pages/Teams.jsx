// Teams.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Teams() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteCard, setShowInviteCard] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8000/fetchprojects', { withCredentials: true })
      .then((res) => {
        setProjects(res.data.fetchedProjects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInviteClick = async (inviteToken) => {
    try {
      // Fetch the project to get its stored inviteToken
      const response = await axios.get(`http://localhost:8000/getproject?token=${inviteToken}`, { withCredentials: true });
      const token = response.data.fetchedProject.inviteToken;
      const link = `http://localhost:5173/invite?token=${token}`;
      setInviteLink(link);
      setShowInviteCard(true);
    } catch (error) {
      console.error(error);
      // Optionally show a toast error
    }
  };
  const handleRemoveMember = async (projectId, memberEmail) => {
  try {
    await axios.post('http://localhost:8000/removeteammember', {
      projectId,
      memberEmail
    }, { withCredentials: true });

    setProjects(prev =>
      prev.map(project =>
        project._id === projectId
          ? { ...project, teamMembers: project.teamMembers.filter(m => m.email !== memberEmail) }
          : project
      )
    );
  } catch (error) {
    console.error("Failed to remove member:", error);
  }
};

  return (
    <div className='flex ml-64'>
      <Sidebar />
      <div className="p-8 bg-gray-900 min-h-screen w-full">
        <h2 className="text-3xl font-bold mb-6 text-blue-300 text-center">Project Teams</h2>

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
                          className="relative group bg-blue-100 text-blue-800 px-8 py-1 rounded-full text-sm font-semibold shadow-sm flex items-center"
                        >
                          {member.username || member.email}
                          <button
                            className=" text-xl text-blue-500 hover:text-blue-700 opacity-0 font-bold group-hover:opacity-100 transition-opacity absolute right-2 top-0"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            title="Remove member"
                            onClick={() => handleRemoveMember(project._id, member.email)}
                          >
                            &times;
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">No members yet</li>
                    )}
                  </ul>
                  <div className="flex gap-4">
                    <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={() => handleInviteClick(project.inviteToken)}>Invite</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {showInviteCard && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <form className="flex flex-col gap-4 bg-gray-900 py-10 px-14 rounded-lg max-w-md w-full">
            <h1 className="text-2xl font-medium text-center mb-4">Invite your team members</h1>
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="p-2 rounded bg-gray-700 text-white outline-0 focus:ring-2 focus:ring-cyan-400 cursor-pointer"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
              }}
            >
              Copy Link
            </button>
            <button
              type="button"
              className="absolute top-4 right-4 text-white"
              onClick={() => setShowInviteCard(false)}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Teams;