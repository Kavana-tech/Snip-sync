import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import FetchedProjects from "../components/FetchedProjects";
import Sidebar from "../components/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    async function getProjects() {
      const toastId = toast.loading("Loading projects...", { position: "top-center", duration: Infinity });
      try {
        let response = await axios.get("http://localhost:8000/fetchprojects", {
          withCredentials: true
        });
        setProjects(response.data.fetchedProjects);
        setLoading(false);
        toast.dismiss(toastId);
        toast.success("Projects loaded!");
      } catch (error) {
        setError("Failed to load projects.");
        setLoading(false);
        toast.dismiss();
        toast.error("Failed to load projects.");
      }
    }
    getProjects();
  }, []);

  // Filter projects by search
  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Toaster toastOptions={{duration:500, style: { background: '#1F2937', color: 'white' }}} />
      <div className="flex ml-64">
        <Sidebar />

        <div className="min-h-screen w-full" style={{ color: "#f8fafc" }}>
          {/* Top Bar */}
          <div className="flex px-4 py-2" style={{ background: "rgba(15,23,42,0.95)", alignItems: "center", gap: "1rem" }}>
            <h1 className="text-2xl font-semibold p-4 flex-1">Currently Working On:</h1>
            {/* Search Bar */}
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-3 py-1 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2"
                style={{
                  minWidth: 200,
                  background: "#0f172a",
                  color: "#f8fafc",
                  borderColor: "#1e293b"
                }}
                aria-label="Search Projects"
              />
            </div>
            {/* Notification Icon */}
            <button className="mx-2 p-2 rounded-full" style={{ background: "#0f172a" }} aria-label="Notifications">
              <FaBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2" style={{ background: "#3b82f6", borderRadius: "9999px" }}></span>
            </button>
            {/* Profile Icon */}
            <button
              className="p-2 rounded-full"
              style={{ background: "#0f172a" }}
              aria-label="Profile"
              onClick={() => window.location.href = "/profile"}
            >
              <FaUserCircle className="text-2xl" />
            </button>
            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 px-3 py-1 rounded transition-colors"
              style={{ background: "#3b82f6", color: "#f8fafc" }}
              aria-label="Refresh Projects"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "#94a3b8" }}>Loading...</div>
          ) : error ? (
            <div className="p-8 text-center" style={{ color: "#f87171" }}>{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center" style={{ color: "#94a3b8" }}>No projects found. Start by creating a new project!</div>
          ) : (
            <FetchedProjects projects={filteredProjects} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;