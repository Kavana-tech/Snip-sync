// Teams.jsx
import React from 'react';

function Teams() {
  const teams = [
    {
      name: 'Frontend Team',
      project: 'SnipSync UI',
      members: ['Alice', 'Bob', 'Charlie'],
    },
    {
      name: 'Backend Squad',
      project: 'SnipSync API',
      members: ['David', 'Eve'],
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">Project Teams</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Team</h3>
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
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {teams.map((team, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-800 mb-1">{team.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Project: <span className="font-medium">{team.project}</span></p>
            <p className="text-gray-600 mb-2">Members:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              {team.members.map((member, i) => (
                <li key={i}>{member}</li>
              ))}
            </ul>
            <div className="flex gap-4">
              <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Invite</button>
              <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
