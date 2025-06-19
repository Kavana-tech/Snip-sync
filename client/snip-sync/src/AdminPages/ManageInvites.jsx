import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Check, CheckCircle, Minus, MinusCircle, PlusCircle } from "lucide-react";

function ManageInvites() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const res = await axios.get("http://localhost:8000/admin/manageinvites", { withCredentials: true });
                setProjects(res.data.projects);
            } catch (err) {
                setProjects([]);
            }
        };
        fetchInvites();
    }, []);

    const handleApprove = async (projectId, email) => {
        try {
            await axios.post(
                "http://localhost:8000/admin/manageinvites/approve",
                { projectId, email },
                { withCredentials: true }
            );
            // Remove from UI
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            pendingJoinRequests: project.pendingJoinRequests.filter(req => req.email !== email),
                            teamMembers: [...project.teamMembers, { email }]
                        }
                        : project
                )
            );
        } catch (err) {
            alert("Failed to approve request");
        }
    };

    const handleReject = async (projectId, email) => {
        try {
            await axios.post(
                "http://localhost:8000/admin/manageinvites/reject",
                { projectId, email },
                { withCredentials: true }
            );
            // Remove from UI
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId
                        ? {
                            ...project,
                            pendingJoinRequests: project.pendingJoinRequests.filter(req => req.email !== email)
                        }
                        : project
                )
            );
        } catch (err) {
            alert("Failed to reject request");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen w-full px-8 py-8">
                    <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Manage Invites</h1>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Pending Join Requests</h2>
                        {projects.length === 0 ? (
                            <p className="text-gray-400">No projects found.</p>
                        ) : (
                            projects.map(project => (
                                <div key={project._id} className="mb-8">
                                    <h3 className="text-lg text-white font-bold mb-2">{project.title}</h3>
                                    {project.pendingJoinRequests.length === 0 ? (
                                        <p className="text-gray-400 ml-4">No pending requests.</p>
                                    ) : (
                                        <ul>
                                            {project.pendingJoinRequests.map(req => (
                                                <li key={req.email} className="mb-2 ml-4 p-2 bg-gray-800 rounded">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <span className="font-bold text-white">{req.username || req.email}</span>
                                                            <span className="ml-2 text-gray-400">requested to join</span>
                                                            <span className="ml-2 text-cyan-400">{project.title}</span>
                                                            <span className="ml-2 text-xs text-gray-500">{new Date(req.requestedAt).toLocaleString()}</span>
                                                        </div>
                                                        <div>
                                                            <button type="button" className=" text-sm text-cyan-400 hover:scale-105 transition-transform cursor-pointer" title="Accept"><CheckCircle
                                                                size={30}
                                                                onClick={() => handleApprove(project._id, req.email)}
                                                            /></button>
                                                            <button type="button" className="ml-8 text-sm text-white hover:scale-105 transition-transform cursor-pointer" title="Reject"><MinusCircle
                                                                size={30}
                                                                onClick={() => handleReject(project._id, req.email)}
                                                            /></button>

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

export default ManageInvites;