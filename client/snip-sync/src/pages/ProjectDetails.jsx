import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function ProjectDetails() {
    const {projectId} = useParams();
    return (
        <div className="flex">
            <Sidebar />
            <div className="min-h-screen bg-gray-900 text-white w-full">
                <div className="w-full bg-black/30 mb-4 flex px-4 py-2">
                    <h1 className="text-2xl font-semibold p-4">Select Your Interest</h1>
                </div>

                <div className="w-full flex flex-wrap justify-around">
                    <button title="Add your resusable codes" className="bg-gray-800 md:w-80 w-48 text-xl font-medium p-4 cursor-pointer rounded-sm"><Link>Reusable Codes</Link></button>
                    <button title="Add your codes for version control" className="bg-gray-800 md:w-80 w-48 text-xl font-medium p-4 cursor-pointer rounded-sm"><Link to={`/managesnips/${projectId}`}>Manage Snips</Link></button>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails;