import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Teams() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:8000/fetchprojects", {withCredentials:true});
        setProjects(res.data.fetchedProjects || []);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="flex ml-64">
        <Sidebar />
        <div className="min-h-screen w-full px-8 py-8">
          <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
            </svg>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Teams Dashboard</h1>
          </div>
          {loading ? (
            <div className="text-gray-400 text-center">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-gray-400 text-center">No projects found.</div>
          ) : (
            <div className="flex flex-col items-center gap-8">
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  className="bg-gray-950/30 rounded-xl text-white shadow-lg p-6 w-full"
                >
                  <div className="text-xl font-semibold text-blue-300 mb-2">{proj.title}</div>
                  <div className="text-gray-300 mb-1">
                    <span className="font-medium">Project ID:</span> {proj._id}
                  </div>
                  <div className="text-gray-300 mb-4">
                    <span className="font-medium">Creator:</span> {proj.creatorEmail}
                  </div>
                  <div className="font-bold mb-2 text-gray-200">Team Members:</div>
                  <ul>
                    {proj.teamMembers && proj.teamMembers.length > 0 ? (
                      proj.teamMembers.map((member, idx) => (
                        <li
                          key={idx}
                          className="flex items-center bg-gray-700 rounded-md px-4 py-2 mb-2"
                        >
                          <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-blue-300 font-bold mr-3 text-lg">
                            {member.username ? member.username[0].toUpperCase() : "?"}
                          </span>
                          <span>
                            {member.username || "Unknown"}{" "}
                            <span className="text-blue-300 text-sm">({member.email})</span>
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No team members.</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        </div>
        );
        
}

        export default Teams;