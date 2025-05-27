import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function Teams() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      });
  }, [adding]);

  const projectObj = projects.find(p => p.title === selectedProject);
  const teamObj = projectObj?.teams.find(t => t.name === selectedTeam);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!selectedProject || !newTeamName || !newTeamMembers) return;
    setAdding(true);
    await fetch('http://localhost:8000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName: selectedProject,
        team: {
          name: newTeamName,
          members: newTeamMembers.split(',').map(m => m.trim()).filter(Boolean)
        }
      })
    });
    setNewTeamName('');
    setNewTeamMembers('');
    setAdding(false);
    setSelectedTeam(newTeamName);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 bg-gray-900 min-h-screen w-full text-white">
        <h2 className="text-3xl font-bold mb-6">Project Teams</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-400 mb-4">{error}</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-400 mb-4">No projects found.</div>
        ) : (
          <>
            {/* Project Dropdown */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Select Project:</label>
              <select
                className="w-full p-2 border rounded bg-gray-800 text-white"
                value={selectedProject}
                onChange={e => {
                  setSelectedProject(e.target.value);
                  setSelectedTeam('');
                }}
              >
                <option value="">-- Choose Project --</option>
                {projects.map((project, idx) => (
                  <option key={idx} value={project.title}>{project.title}</option>
                ))}
              </select>
            </div>

            {/* Add Team Form */}
            {selectedProject && (
              <form onSubmit={handleAddTeam} className="mb-6 bg-gray-800 p-4 rounded">
                <h4 className="font-semibold mb-2">Add New Team</h4>
                <input
                  type="text"
                  placeholder="Team Name"
                  className="p-2 rounded bg-gray-700 text-white mr-2 mb-2"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Members (comma separated)"
                  className="p-2 rounded bg-gray-700 text-white mr-2 mb-2"
                  value={newTeamMembers}
                  onChange={e => setNewTeamMembers(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  disabled={adding}
                >
                  {adding ? 'Adding...' : 'Add Team'}
                </button>
              </form>
            )}

            {/* Teams Dropdown */}
            {projectObj && (
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Select Team:</label>
                <select
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  value={selectedTeam}
                  onChange={e => setSelectedTeam(e.target.value)}
                >
                  <option value="">-- Choose Team --</option>
                  {projectObj.teams.map((team, idx) => (
                    <option key={idx} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Team Members */}
            {selectedTeam && !teamObj && (
              <div className="text-gray-400 mb-4">No team found.</div>
            )}
            {teamObj && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-bold text-blue-400 mb-2">{teamObj.name}</h3>
                <p className="text-gray-300 mb-2">Members:</p>
                {teamObj.members.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-200 mb-4">
                    {teamObj.members.map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No members in this team.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Teams;