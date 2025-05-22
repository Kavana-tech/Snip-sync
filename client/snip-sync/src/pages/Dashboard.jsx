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
        let response = await axios.get("http://localhost:8000/fetchprojects", {
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
    <div>
      <Toaster toastOptions={{duration:500, style: { background: '#1F2937', color: 'white' }}} />
      <div className="flex">
        <Sidebar />

        <div className="min-h-screen bg-gray-900 text-white w-full">
          <div className="flex px-4 py-2 bg-black/30">
            <h1 className="text-2xl font-semibold p-4">Currently Working On: </h1>
          </div>
          <FetchedProjects projects={projects} />
        </div>
      </div>

    </div>

  )
}
export default Dashboard;