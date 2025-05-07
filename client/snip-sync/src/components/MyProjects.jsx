import React, { useState, useEffect } from "react";
import { Link, Plus, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import FetchedProjects from "./FetchedProjects";
import { toast, Toaster } from 'react-hot-toast';

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

    useEffect(() => {
        async function fetchProjects() {
            try {
                let response = await axios.get("http://localhost:8000/fetchprojects", {
                    withCredentials: true,
                })
                console.log(response.data.fetchedProjects);
                setProject(response.data.fetchedProjects || []);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchProjects();
    }, [])

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
                console.log(response);
                setProject((prevProjects) => [...prevProjects, response.data.project]);
                setProjectData({
                    title: '',
                    description: '',
                    workingAs: ''
                });
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
            setProjectData({...projectData, inviteToken: response.data});
            setInviteLink(link);
            localStorage.setItem('invite', link);
            setInviteLinkInput(true);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(()=> {
            toast.success("Link Copied");
        }).catch(error => {
            console.log(error);
            toast.error("Can't Copy Link");
        })
    }


    return (
        <div>
            <Toaster toastOptions={{style: {background: '#1F2937', color: 'white'}}}/>
            <div className="flex">
                <Sidebar />
                <div className="min-h-screen bg-gray-900 text-white w-full">
                    <div className="flex px-4 py-2 justify-between bg-black/30">
                        <h1 className="text-2xl font-semibold">Your Projects:</h1>
                        <button type="button" className="bg-blue-500 cursor-pointer px-4 py-2 text-xl font-semibold rounded-md" onClick={handleAdd}>
                            <div className="flex justify-center items-center text-white">New<Plus className="ml-2 font-semibold" /></div>
                        </button>
                    </div>
                    <FetchedProjects projects={project} setProjects={setProject} invite={localStorage.getItem('invite')}/>
                    <AnimatePresence>
                        {addCard && <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}>
                            <motion.form
                                onSubmit={handleAddProject}
                                className="flex flex-col gap-4 bg-gray-900 py-10 px-14 rounded-lg max-w-md w-full" initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                transition={{ duration: 0.3 }}>
                                <div className="relative">

                                    <X className="absolute justify-right right-0 cursor-pointer" onClick={handleClose} />
                                </div>
                                <h1 className="text-2xl font-medium text-center">Add Your Project</h1>

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
                                {inviteBtn &&
                                    <div>
                                        <button type="button" onClick={handleGenerateInviteLink} className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold cursor-pointer">
                                            Invite Team</button><br />
                                        <div className="flex gap-4 items-center justify-center">
                                            {inviteLinkInput && <input type="text" value={inviteLink || ''} className="p-2 mt-4 w-full rounded bg-gray-700 text-white outline-0 focus:ring-2 focus:ring-cyan-400 cursor-pointer" readOnly />}
                                            {inviteLinkInput && <Link className="mt-4 cursor-pointer" onClick={handleCopy}/>}
                                        </div>

                                    </div>
                                }
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold cursor-pointer" onClick={handleClose}
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