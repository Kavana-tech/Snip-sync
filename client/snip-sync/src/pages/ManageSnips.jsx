import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FolderPlus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import CreateFolderCard from "../components/CreateFolderCard";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import TeamBar from "../components/TeamBar";

function ManageSnips() {
    const { projectId } = useParams();
    const [formCard, setFormCard] = useState(false);
    const [allFolders, setAllFolders] = useState([]);
    const [folderData, setFolderData] = useState({
        folderName: '',
        files: [],
    })

    // const [pendingDeletes, setPendingDeletes] = useState([]);
    const fetched = useRef(false);

    // useEffect(() => {
    //     async function findCreator(){
    //         try {
    //             const response = await axios.get(`http://localhost:8000/findcreator/${projectId}`, { withCredentials: true });
    //             setCreator(response.data.creator);
    //         } catch (error) {
    //             console.error("Error fetching project creator:", error);
    //             toast.error(error.response?.data?.message || "Failed to fetch project creator.");
    //         }
    //     }
    //     findCreator();
    // }, [projectId]);

    // useEffect(() => {
    //     if (fetched.current) return;
    //     fetched.current = true;
    //     async function fetchPendingDeletes() {
    //         try {
    //             const response = await axios.get(`http://localhost:8000/fetchpendingdeletefolders/${projectId}`, { withCredentials: true });
    //             setPendingDeletes(response.data.pendingProjects);
    //         }
    //         catch (error) {
    //             console.error("Error fetching pending delete folders:", error);
    //             toast.error(error.response?.data?.message || "Failed to fetch pending delete folders.");
    //         }
    //     }
    //     fetchPendingDeletes();
    // }, [projectId])


    const hasFetched = useRef(false);
    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true;
        async function getFolders() {
            const toastId = toast.loading("Loading folders...", { position: "top-center", duration: Infinity });
            try {
                let response = await axios.get(`http://localhost:8000/getfolders/${projectId}`, {withCredentials: true});
                console.log(response);
                setAllFolders(response.data);
                toast.dismiss(toastId);
                toast.success("Folders loaded!", { position: "top-center" });
            }
            catch (error) {
                console.log(error);
            }
        }
        getFolders();
    }, [])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFolderData((prev) => ({ ...prev, [name]: value }));
    }
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/createfolder/${projectId}`, folderData, { withCredentials: true });
            if (response.status === 200) {
                setAllFolders((prev) => [...prev, response.data.createdFolder]);
                setFolderData({ folderName: '', files: [] });
                setFormCard(false);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Something went wrong");
            } else {
                toast.error("Network error");
            }
        }
    }


    const handleClose = () => {
        setFormCard(false);
    }
    return (
        <div>
            <Toaster toastOptions={{ duration: 500, style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex ml-64 mr-60">
                <Sidebar />
                <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white px-8 py-8">
                    <div className="flex items-center justify-between px-6 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <div className="flex gap-2 items-center">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                                <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                            </svg>
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Your Folders</h1>
                        </div>
                        <button type="button" className="bg-cyan-900 cursor-pointer px-4 py-2 text-xl font-semibold rounded-md" onClick={() => setFormCard(true)}>
                            <div className="flex justify-center items-center text-white">Create Folder <FolderPlus className="ml-2 font-semibold" /></div>
                        </button>
                    </div>

                    <CreateFolderCard allFolders={allFolders} setFormCard={setFormCard} setAllFolders={setAllFolders} projectId={projectId} />
                    <TeamBar projId={projectId}/>

                    <AnimatePresence>
                        {formCard &&
                            <motion.div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}>

                                <motion.form className="flex flex-col justify-center bg-gray-900 p-14 rounded-2xl"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ duration: 0.3 }} onSubmit={handleCreateFolder}>
                                    <div className="relative">

                                        <X className="absolute justify-right right-0 cursor-pointer" onClick={handleClose} />
                                    </div>
                                    <h1 className="text-2xl font-semibold mb-4 ">Create Folder</h1>
                                    <label>Folder Name:</label>
                                    <input type="text" name="folderName" placeholder="Enter Your Folder Name" className="px-4 py-2 outline-0 rounded-md bg-gray-700 m-4 ml-0 w-full focus:ring-2 focus:ring-cyan-900" onChange={handleChange} />
                                    <button type="submit" className="p-2 mt-2 rounded-md text-xl font-medium bg-cyan-900 cursor-pointer">Create</button>
                                </motion.form>

                            </motion.div>
                        }
                    </AnimatePresence>
                    
                </div>
            </div>
        </div>
    )
}

export default ManageSnips;