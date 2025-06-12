import React from "react";
import { Link, useNavigate } from "react-router-dom";
function DashProjectCard({ project }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 m-6 transition-transform hover:scale-105 hover:shadow-cyan-700/40 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-900/60 text-cyan-300 text-xs font-semibold uppercase tracking-wide shadow">
                        {project.workingAs} Dev
                    </span>
                    <span className="text-gray-400 text-xs">
                        {new Date(project.createdAt).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2 capitalize hover:underline transition">{project.title}</h1>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                </div>
                <div className="flex flex-col gap-3 mb-4">
                    <button
                        title="Add your reusable codes"
                        className="bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-150"
                        onClick={() => navigate(`/storesnips/${project._id}`)}
                    >
                        Reusable Codes
                    </button>
                    <Link
                        to={`/managesnips/${project._id}`}
                        title="Add your codes for version control"
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-150 text-center"
                    >
                        Manage Snips
                    </Link>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-800/80 rounded-lg px-3 py-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                    <span>Created by: {project.createdBy}</span>
                </div>
            </div>
        </div>
    )
}

export default DashProjectCard;