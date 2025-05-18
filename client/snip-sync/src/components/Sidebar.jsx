import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const teamsData = {
  "Project 1": ["Team A", "Team B"],
  "Project 2": ["Team A", "Team C"],
  "Project 3": ["Team B"],
};

function Sidebar() {
  const navigate = useNavigate();
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/logout", { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleProjectDropdown = (project) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [project]: !prev[project],
    }));
  };

  return (
    <div className="w-64 bg-slate-800 text-white p-4 min-h-screen shadow-lg">
      <div className="text-center text-xl font-semibold text-cyan-400 mb-4">
        SnipSync
      </div>

      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Dashboard</Link>
        </li>
        <li>
          <Link to="/myprojects" className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">My Projects</Link>
        </li>
        <li>
          <Link to="/Profile" className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Profile</Link>
        </li>

        {/* Teams Dropdown */}
        <li>
          <div
            onClick={() => setShowTeamsDropdown(!showTeamsDropdown)}
            className="cursor-pointer py-2 px-4 font-semibold hover:bg-gray-700 hover:text-cyan-400"
          >
            Teams {showTeamsDropdown ? "▲" : "▼"}
          </div>

          {showTeamsDropdown && (
            <ul className="ml-4 space-y-1 text-sm text-slate-300">
              {Object.entries(teamsData).map(([project, teams]) => (
                <li key={project}>
                  <div
                    onClick={() => toggleProjectDropdown(project)}
                    className="cursor-pointer py-1 hover:text-cyan-300"
                  >
                    {project} {expandedProjects[project] ? "▲" : "▼"}
                  </div>
                  {expandedProjects[project] && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {teams.map((team, index) => (
                        <li key={index} className="hover:text-cyan-400">
                          {team}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <Link to="/settings" className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Settings</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
