import React, { useState, useEffect } from "react";
import { Link, Plus, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import FetchedProjects from "./FetchedProjects";
import { toast, Toaster } from 'react-hot-toast';
import { useRef } from "react";

function MyProject() {
    const [addCard, setAddCard] = useState(false);
    const [inviteBtn, setInviteBtn] = useState(false);
    const [inviteLinkInput, setInviteLinkInput] = useState(false);
    const [project, setProject] = useState([]);
    const [errors, setErrors] = useState({});
    const [inviteLink, setInviteLink] = useState('');

    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        workingAs: '',
        inviteToken: ''
    })

    const validate = () => {
        let validationErrors = {}
        if (!projectData.title) {
            validationErrors.title = "Project Title required";
        }
        if (!projectData.workingAs) {
            validationErrors.workingAs = "Select how you are working";
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }

    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        async function fetchProjects() {
            const toastId = toast.loading("Loading projects...", { position: "top-center", duration: Infinity });

            try {
                let response = await axios.get("http://localhost:8000/fetchprojects", { withCredentials: true });
                setProject(response.data.fetchedProjects || []);
                toast.dismiss(toastId);
                toast.success("Projects loaded!", { position: "top-center" });
            } catch (error) {
                console.log(error);
            }
        }

        fetchProjects();
    }, []);

    const handleAdd = () => {
        setAddCard(true);
    }

    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please check the details");
        }
        else {
            try {
                let response = await axios.post("http://localhost:8000/addproject", projectData, {
                    withCredentials: true
                });
                setProject((prevProjects) => [...prevProjects, response.data.project]);
                setProjectData({
                    title: '',
                    description: '',
                    workingAs: '',
                    inviteLink: ''
                });
                setAddCard(false);
                toast.success(response.data.message);
            }
            catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));

        if (name === "workingAs" && value === "team") {
            setInviteBtn(true);
        } else if (name === "workingAs") {
            setInviteBtn(false);
        }
    };

    const handleClose = () => {
        setAddCard(false);
    }

    const handleGenerateInviteLink = async () => {
        try {
            let response = await axios.post("http://localhost:8000/generateinvite", {}, { withCredentials: true });
            let link = `http://localhost:5173/invite?token=${response.data}`
            setProjectData({ ...projectData, inviteToken: response.data });
            setInviteLink(link);
            localStorage.setItem('invite', link);
            setInviteLinkInput(true);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            toast.success("Link Copied");
        }).catch(error => {
            console.log(error);
            toast.error("Can't Copy Link");
        })
    }

    return (
        <div>
            <Toaster toastOptions={{ duration: 500, style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white px-8 py-8">
                    <div className="flex items-center justify-between px-6 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <div className="flex gap-2 items-center">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                                <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                            </svg>
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Your Projects</h1>
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-2 bg-cyan-600 px-5 py-2 text-lg font-semibold rounded-lg shadow-md text-white"
                            onClick={handleAdd}
                        >
                            <Plus className="w-5 h-5" /> New Project
                        </button>
                    </div>
                    <FetchedProjects projects={project} setProjects={setProject} invite={localStorage.getItem('invite')} />
                    <AnimatePresence>
                        {addCard && <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}>
                            <motion.form
                                onSubmit={handleAddProject}
                                className="flex flex-col gap-4 bg-gray-900 py-10 px-10 rounded-2xl max-w-md w-full shadow-2xl border border-cyan-700"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                transition={{ duration: 0.3 }}>
                                <div className="relative">
                                    <X className="absolute right-0 top-0 cursor-pointer text-gray-400 hover:text-red-400 transition" onClick={handleClose} />
                                </div>
                                <h1 className="text-2xl font-bold text-center mb-2 text-cyan-400">Add Your Project</h1>
                                <input
                                    type="text"
                                    placeholder="Enter Project Title"
                                    name="title"
                                    value={projectData.title}
                                    onChange={handleChange}
                                    className="p-3 rounded bg-gray-800 text-white outline-0 focus:ring-2 focus:ring-cyan-400"
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                                <textarea
                                    placeholder="Describe your project"
                                    name="description"
                                    value={projectData.description}
                                    onChange={handleChange}
                                    className="p-3 rounded bg-gray-800 text-white outline-0 focus:ring-2 focus:ring-cyan-400"
                                ></textarea>
                                <label className="font-semibold">Working As:</label>
                                <select name="workingAs" value={projectData.workingAs} onChange={handleChange} className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400">
                                    <option value="">Select Category</option>
                                    <option value="solo">Solo Developer</option>
                                    <option value="team">Team</option>
                                </select>
                                {errors.workingAs && <p className="text-red-500 text-sm">{errors.workingAs}</p>}
                                {inviteBtn &&
                                    <div>
                                        <button type="button" onClick={handleGenerateInviteLink} className="bg-cyan-600 hover:bg-cyan-500 p-2 rounded font-semibold cursor-pointer transition">
                                            Invite Team
                                        </button>
                                        <div className="flex gap-2 items-center justify-center mt-2">
                                            {inviteLinkInput && <input type="text" value={inviteLink || ''} className="p-2 w-full rounded bg-gray-800 text-white outline-0 focus:ring-2 focus:ring-cyan-400 cursor-pointer" readOnly />}
                                            {inviteLinkInput && <span className="text-cyan-400 cursor-pointer font-semibold" onClick={handleCopy}>Copy</span>}
                                        </div>
                                    </div>
                                }
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-500 p-3 rounded font-semibold cursor-pointer transition text-lg"
                                >
                                    Add Project
                                </button>
                            </motion.form>
                        </motion.div>}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
export default MyProject;