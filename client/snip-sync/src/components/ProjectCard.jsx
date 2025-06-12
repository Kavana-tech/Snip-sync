import { Pencil, Trash2, UserPlus } from "lucide-react";
import React, { useState } from "react";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import { toast, Toaster } from 'react-hot-toast';

function ProjectCard({ project, allProjects, setProjects, inviteLink }) {
    const [editProjectInfo, setEditProjectInfo] = useState(false);
    const [deleteProjectInfo, setDeleteProjectInfo] = useState(false);
    const [newLink, setNewLink] = useState('');
    const [inviteCard, setInviteCard] = useState(false);

    const handleEdit = () => setEditProjectInfo(true);
    const handleClose = () => {
        setEditProjectInfo(false);
        setDeleteProjectInfo(false);
    };

    const handleAddMember = () => {
        // Implement add member logic here if needed
        toast("Add member feature coming soon!");
    };

    return (
        <div className="flex justify-center">
            <Toaster toastOptions={{ duration: 500, style: { background: '#1F2937', color: 'white' } }} />
            {editProjectInfo && (
                <EditProject
                    editProject={project}
                    onClose={handleClose}
                    setProjects={setProjects}
                    invite={inviteLink}
                />
            )}
            {deleteProjectInfo && (
                <DeleteProject
                    deleteProject={project}
                    onClose={handleClose}
                    allProjects={allProjects}
                    setProjects={setProjects}
                />
            )}
            <div className="w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 m-4 transition-transform hover:scale-105 hover:shadow-cyan-700/40 border border-gray-700">
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
                <div className="flex justify-end gap-2 mb-2">
                    <button
                        title="Edit"
                        className="text-cyan-400 hover:text-cyan-200 transition"
                        onClick={handleEdit}
                    >
                        <Pencil className="h-5 w-5" />
                    </button>
                    <button
                        title="Delete"
                        className="text-red-500 hover:text-red-300 transition"
                        onClick={() => setDeleteProjectInfo(true)}
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2 capitalize hover:underline transition">{project.title}</h1>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                </div>
                <div className="flex flex-col gap-3 mb-4">
                    <button
                        className="flex items-center justify-center gap-2 bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-150"
                        onClick={handleAddMember}
                        title="Add Member"
                    >
                        <UserPlus className="h-5 w-5" /> Add Member
                    </button>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-800/80 rounded-lg px-3 py-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                    <span>Created by: {project.createdBy}</span>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;