import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import FetchedProjects from "../components/FetchedProjects";
import Sidebar from "../components/Sidebar";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const [projects, setProjects] = useState([])
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true;
    async function getProjects() {
      const toastId = toast.loading("Loading projects...", { position: "top-center", duration: Infinity });
      try {
        let response = await axios.get("http://localhost:8000/dashboard/fetchprojects", {
          withCredentials: true
        });
        setProjects(response.data.fetchedProjects);
        toast.dismiss(toastId);
        toast.success("Projects loaded!");
      }

      catch (error) {
        console.log(error);
      }
    }
    getProjects();
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <Toaster toastOptions={{duration:500, style: { background: '#1F2937', color: 'white' }}} />
      <div className="flex ml-64">
        <Sidebar />

        <div className="min-h-screen w-full px-8 py-8">
          <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor"/>
            </svg>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Your Projects</h1>
          </div>
          <FetchedProjects projects={projects} />
        </div>
      </div>
    </div>
  )
}
export default Dashboard;