import { Pencil, Trash2, UserPlus, X } from "lucide-react";
import React, { useState } from "react";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function ProjectCard({ project, allProjects, setProjects, inviteLink }) {
    const [editProjectInfo, setEditProjectInfo] = useState(false);
    const [deleteProjectInfo, setDeleteProjectInfo] = useState(false);
    const [showInviteCard, setShowInviteCard] = useState(false);
    const [inviteUrl, setInviteUrl] = useState('');

    const handleEdit = () => setEditProjectInfo(true);
    const handleClose = () => {
        setEditProjectInfo(false);
        setDeleteProjectInfo(false);
    };

    const handleAddMember = async () => {
        try {

            const response = await axios.get(`http://localhost:8000/getproject?token=${project.inviteToken}`, { withCredentials: true });
            const token = response.data.fetchedProject.inviteToken;
            const link = `http://localhost:5173/invite?token=${token}`;
            setInviteUrl(link);
            setShowInviteCard(true);
        } catch (error) {
            toast.error("Failed to get invite link");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteUrl).then(() => {
            toast.success('Link Copied');
        }).catch(() => {
            toast.error("Can't copy");
        });
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
                    {project.workingAs !== "solo" && (
                        <button
                            className="flex items-center justify-center gap-2 bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-150"
                            onClick={handleAddMember}
                            title="Add Member"
                        >
                            <UserPlus className="h-5 w-5" /> Add Member
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-800/80 rounded-lg px-3 py-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
                    </svg>
                    <span>Created by: {project.createdBy}</span>
                </div>
            </div>
            {/* Invite Card Modal */}
            <AnimatePresence>
                {showInviteCard && (
                    <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}>
                        <motion.form className="flex flex-col gap-4 bg-gray-900 py-10 px-14 rounded-lg max-w-md w-full" initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}>
                            <div className='flex justify-between'>
                                <h1 className="text-2xl font-medium text-center mb-4 text-cyan-300">Invite your team members</h1>
                                <X onClick={() => setShowInviteCard(false)} className='text-white cursor-pointer' />
                            </div>
                            <input
                                type="text"
                                value={inviteUrl}
                                readOnly
                                className="p-2 rounded bg-gray-700 text-white outline-0 focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                            />
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold cursor-pointer"
                                onClick={handleCopy}
                            >
                                Copy Link
                            </button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProjectCard;