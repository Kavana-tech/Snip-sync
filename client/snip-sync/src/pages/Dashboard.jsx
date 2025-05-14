import axios from "axios";
import React, { useEffect, useState } from "react";
import FetchedProjects from "../components/FetchedProjects";
import Sidebar from "../components/Sidebar";
function Dashboard() {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    async function getProjects() {
      let response = await axios.get("http://localhost:8000/fetchprojects", {
        withCredentials: true
      });
      setProjects(response.data.fetchedProjects);
    }
    getProjects();
  }, [])
  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen bg-gray-900 text-white w-full">
        <div className="flex px-4 py-2 bg-black/30">
          <h1 className="text-2xl font-semibold p-4">Current Works: </h1>
        </div>
        <FetchedProjects projects={projects}/>
      </div>
    </div>

  )
}
export default Dashboard;