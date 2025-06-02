import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { Link, X } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';

function EditProject({ editProject, onClose, setProjects, invite }) {
    const [inviteBtn, setInviteBtn] = useState(true);
    const [errors, setErrors] = useState({});
    const [editCard, setEditCard] = useState(true);
    const [inviteLink, setInviteLink] = useState(`http://localhost:5173/invite?token=${editProject.inviteToken}`);
    const [projectData, setProjectData] = useState({
        title: editProject.title,
        description: editProject.description,
        workingAs: editProject.workingAs,
        inviteToken: ''
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));

        if (name === "workingAs" && value === "team") {
            setInviteBtn(true);
        } else if (name === "workingAs" && value === "solo") {
            setInviteBtn(false);
        }
    };


    const handleEditProject = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.post(`http://localhost:8000/editproject/${editProject._id}`, projectData);
            setProjects((prevProjects) =>
                prevProjects.map((proj) =>
                    proj._id === editProject._id ? { ...proj, ...projectData } : proj
                )
            );
            console.log(response);
            toast.success(response.data.message);
            handleClose();
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    const handleClose = () => {
        setEditCard(false);
        setTimeout(onClose, 300);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            toast.success("Link Copied");
        }).catch(error => {
            console.log(error);
            toast.error("Can't Copy Link");
        })
    }
    const handleGenerateInviteLink = async () => {
        try {
            let response = await axios.post("http://localhost:8000/generateinvite", { projectId: editProject._id}, { withCredentials: true });
            let link = `http://localhost:5173/invite?token=${response.data}`
            setProjectData({ ...projectData, inviteToken: response.data });
            setInviteLink(link);
            localStorage.setItem('invite', link);
            //setInviteLinkInput(true);
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>

            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex">

                <AnimatePresence>

                    {editCard && <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}>

                        <motion.form
                            onSubmit={handleEditProject}
                            className="flex flex-col gap-4 bg-gray-900 py-10 px-14 rounded-lg max-w-md w-full" initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ duration: 0.3 }}>
                            <div className="relative">

                                <X className="absolute justify-right right-0 cursor-pointer" onClick={handleClose} />
                            </div>
                            <h1 className="text-2xl font-medium text-center">Edit Your Project Details</h1>

                            <input
                                type="text"
                                placeholder="Enter Project Title"
                                name="title"
                                value={projectData.title}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white outline-0 focus:ring-2 focus:ring-cyan-400"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                            <textarea
                                type="text"
                                placeholder="Describe your project"
                                name="description"
                                value={projectData.description}
                                onChange={handleChange}
                                className="p-2 rounded bg-gray-700 text-white outline-0 focus:ring-2 focus:ring-cyan-400"
                            ></textarea>
                            <label>Working As:</label>
                            <select name="workingAs" value={projectData.workingAs} onChange={handleChange} className="p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400">
                                <option value="">Select Category</option>
                                <option value="solo">Solo Developer</option>
                                <option value="team">Team</option>
                            </select>
                            {errors.workingAs && <p className="text-red-500 text-sm">{errors.workingAs}</p>}
                            {projectData.workingAs === 'team' &&
                                <div>
                                    <button type="button" className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold cursor-pointer" onClick={handleGenerateInviteLink}>
                                        Invite Team</button><br />
                                    <div className="flex gap-4 items-center justify-center">
                                        <input type="text" value={inviteLink} className="p-2 mt-4 w-full rounded bg-gray-700 text-white outline-0 focus:ring-2 focus:ring-cyan-400 cursor-pointer" readOnly />
                                        <Link className="mt-4 cursor-pointer" onClick={handleCopy} />
                                    </div>
                                </div>
                            }
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold cursor-pointer" onClick={handleClose}
                            >
                                Save Changes
                            </button>
                        </motion.form>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </div>
    );
}
export default EditProject;