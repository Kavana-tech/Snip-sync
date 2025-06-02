import React from "react";
import { Link, useNavigate } from "react-router-dom";
function DashProjectCard({ project }) {
    const navigate = useNavigate();
   
    return (
        <div>

            <div className=" min-w-[500px] w-full max-w-[500px] cursor-pointer ml-12 mr-12 mt-6 flex flex-col justify-center rounded-md items-center bg-gray-800">
                <div className="w-full bg-gray-700 text-gray-400 flex justify-between p-4 rounded-sm">
                    <p className="capitalize">{project.workingAs} Development</p>
                    <p>{new Date(project.createdAt).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</p>
                </div>
                <div className="mt-4 pb-6 text-center">
                    <h1 className="text-2xl font-medium hover:underline capitalize">{project.title}</h1>
                    <p className="mt-4">{project.description}</p>
                </div>
                <div className="flex flex-col gap-4">
                    <button title="Add your resusable codes" className="bg-gray-700 md:w-80 w-48 text-xl font-medium p-4 cursor-pointer rounded-sm hover:text-cyan-600 hover:scale-105 transition-transform duration-150"><Link>Reusable Codes</Link></button>
                    <button title="Add your codes for version control" className="bg-gray-700 md:w-80 w-48 text-xl font-medium p-4 cursor-pointer rounded-sm hover:text-cyan-600 hover:scale-105 transition-transform duration-150"><Link to={`/managesnips/${project._id}`}>Manage Snips</Link></button>
                </div>
                <div className="w-full bg-gray-700 text-gray-400 mt-4 p-4 rounded-sm">
                    <p>Created by: {project.createdBy}</p>
                </div>
            </div>
        </div>
    )
}

export default DashProjectCard;