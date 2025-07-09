import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { CheckCircle, MinusCircle } from "lucide-react";

function ManageDeletions() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingDeletions = async () => {
            try {
                const res = await axios.get("http://localhost:8000/fetchprojects", { withCredentials: true });
                setProjects(res.data.fetchedProjects || []);
            } catch (err) {
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingDeletions();
    }, []);

    const handleApprove = async (projectId, pendingDeleteId) => {
        try {
            await axios.post(
                `http://localhost:8000/approve-deletefolder/${projectId}/${pendingDeleteId}`,
                {},
                { withCredentials: true }
            );
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            pendingDeleteFolders: project.pendingDeleteFolders.filter(
                                req => req._id !== pendingDeleteId
                            )
                        }
                        : project
                )
            );
        } catch (err) {
            alert("Failed to approve deletion.");
        }
    };

    const handleReject = async (projectId, pendingDeleteId) => {
        try {
            await axios.post(
                `http://localhost:8000/reject-deletefolder/${projectId}/${pendingDeleteId}`,
                {},
                { withCredentials: true }
            );
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            pendingDeleteFolders: project.pendingDeleteFolders.filter(
                                req => req._id !== pendingDeleteId
                            )
                        }
                        : project
                )
            );
        } catch (err) {
            alert("Failed to reject deletion.");
        }
    };

    const handleApproveSnippet = async (projectId, pendingDeleteId) => {
        try {
            await axios.post(
                `http://localhost:8000/approve-deletesnippet/${projectId}/${pendingDeleteId}`,
                {},
                { withCredentials: true }
            );
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            pendingDeleteSnippets: project.pendingDeleteSnippets.filter(
                                req => req._id !== pendingDeleteId
                            )
                        }
                        : project
                )
            );
        } catch (err) {
            alert("Failed to approve snippet deletion.");
        }
    };

    const handleRejectSnippet = async (projectId, pendingDeleteId) => {
        try {
            await axios.post(
                `http://localhost:8000/reject-deletesnippet/${projectId}/${pendingDeleteId}`,
                {},
                { withCredentials: true }
            );
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            pendingDeleteSnippets: project.pendingDeleteSnippets.filter(
                                req => req._id !== pendingDeleteId
                            )
                        }
                        : project
                )
            );
        } catch (err) {
            alert("Failed to reject snippet deletion.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen w-full px-8 py-8">
                    <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Manage Deletions</h1>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                        {/* Folder Deletion Section */}
                        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Pending Folder Deletion Requests</h2>
                        {loading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : projects.length === 0 ? (
                            <p className="text-gray-400">No projects found.</p>
                        ) : (
                            projects.map(project => (
                                <div key={project._id} className="mb-8">
                                    <h3 className="text-lg text-cyan-400 font-bold mb-2">{project.title || "Untitled Project"}</h3>
                                    {(!project.pendingDeleteFolders || project.pendingDeleteFolders.length === 0) ? (
                                        <p className="text-gray-400 ml-4">No pending deletion requests.</p>
                                    ) : (
                                        <ul>
                                            {project.pendingDeleteFolders.map(req => (
                                                <li key={req._id} className="mb-2 ml-4 p-2 bg-gray-800 rounded">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="font-bold text-white">{req.requester || "Unknown"}</span>
                                                            <span className="ml-2 text-gray-400">requested to delete folder</span>
                                                            <span className="ml-2 text-cyan-400">{req.folderName}</span>
                                                        </div>
                                                        <div>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-cyan-400 hover:scale-105 transition-transform cursor-pointer"
                                                                title="Accept"
                                                                onClick={() => handleApprove(project._id, req._id)}
                                                            >
                                                                <CheckCircle size={30} />
                                                            </button>
                                                            <button type="button" className="ml-8 text-sm text-white hover:scale-105 transition-transform cursor-pointer" title="Reject">
                                                                <MinusCircle
                                                                    size={30}
                                                                    onClick={() => handleReject(project._id, req._id)}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Snippet Deletion Section */}
                        <h2 className="text-xl font-semibold text-cyan-400 mb-4 mt-8">Pending Snippet Deletion Requests</h2>
                        {loading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : projects.length === 0 ? (
                            <p className="text-gray-400">No projects found.</p>
                        ) : (
                            projects.map(project => (
                                <div key={project._id + "-snippets"} className="mb-8">
                                    <h3 className="text-lg text-cyan-400 font-bold mb-2">{project.title || "Untitled Project"}</h3>
                                    {(!project.pendingDeleteSnippets || project.pendingDeleteSnippets.length === 0) ? (
                                        <p className="text-gray-400 ml-4">No pending snippet deletion requests.</p>
                                    ) : (
                                        <ul>
                                            {project.pendingDeleteSnippets.map(req => (
                                                <li key={req._id} className="mb-2 ml-4 p-2 bg-gray-800 rounded">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="font-bold text-white">{req.requester || "Unknown"}</span>
                                                            <span className="ml-2 text-gray-400">requested to delete snippet</span>
                                                            <span className="ml-2 text-cyan-400">{req.snippetTitle}</span>
                                                        </div>
                                                        <div>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-cyan-400 hover:scale-105 transition-transform cursor-pointer"
                                                                title="Accept"
                                                                onClick={() => handleApproveSnippet(project._id, req._id)}
                                                            >
                                                                <CheckCircle size={30} />
                                                            </button>
                                                            <button type="button" className="ml-8 text-sm text-white hover:scale-105 transition-transform cursor-pointer" title="Reject">
                                                                <MinusCircle
                                                                    size={30}
                                                                    onClick={() => handleRejectSnippet(project._id, req._id)}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageDeletions;