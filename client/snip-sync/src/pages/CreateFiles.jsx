import { FilePlus, X, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';
import { socket } from "../socket";

function CreateFiles() {
    const navigate = useNavigate();
    const { folderId } = useParams();
    const [files, setFiles] = useState([]);
    const [formCard, setFormCard] = useState(false);
    const [fileData, setFileData] = useState({
        fileName: ''
    })

    useEffect(() => {
        socket.emit("join-folder", folderId);

        socket.on("file-created", ({ folderId: incomingId, file }) => {
            if (incomingId === folderId) {
                setFiles(prev => [...prev, file]);
                toast.success(`New file "${file.fileName}" added`);
            }
        });

        return () => {
            socket.emit("leave-folder", folderId);
            socket.off("file-created");
        };
    }, [folderId]);


    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/getfiles/${folderId}`);
                setFiles(response.data.files);
                console.log(response.data.files);
            } catch (error) {
                console.log("Error fetching files:", error);
            }
        };

        fetchFiles();

    }, [folderId])

    const handleClose = () => {
        setFormCard(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFileData((prev) => ({ ...prev, [name]: value }));
    }

    const handleDeleteFile = async (fileId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/deletefile/${folderId}/${fileId}`);
            if (response.status === 200) {
                setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error(error.response.data.message);
        }
    };


    const handleCreateFile = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.post(`http://localhost:8000/addfiles/${folderId}`, fileData);
            if (response.status === 200) {
                // setFiles((prev) => [...prev, response.data.file]);
                setFileData({ fileName: '' });
                setFormCard(false);
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen bg-gray-900 text-white w-full">
                    <div className="w-full bg-black/30 mb-4 flex justify-between px-4 py-2">
                        <h1 className="text-2xl font-semibold p-4">Manage Your Snips</h1>
                        <button type="button" className="bg-cyan-900 cursor-pointer px-4 py-2 text-xl font-semibold rounded-md" onClick={() => setFormCard(true)}>
                            <div className="flex justify-center items-center text-white">Create File <FilePlus className="ml-2 font-semibold" /></div>
                        </button>
                    </div>
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
                                    transition={{ duration: 0.3 }} onSubmit={handleCreateFile}>
                                    <div className="relative">

                                        <X className="absolute justify-right right-0 cursor-pointer" onClick={handleClose} />
                                    </div>
                                    <h1 className="text-2xl font-semibold mb-4 ">Create File</h1>
                                    <label>File Name:</label>
                                    <input type="text" name="fileName" placeholder="Enter Your File Name" className="px-4 py-2 outline-0 rounded-md bg-gray-700 m-4 ml-0 w-full focus:ring-2 focus:ring-cyan-900" onChange={handleChange} />
                                    <button type="submit" className="p-2 mt-2 rounded-md text-xl font-medium bg-cyan-900 cursor-pointer">Create</button>
                                </motion.form>

                            </motion.div>
                        }
                    </AnimatePresence>
                    <div className="px-6 py-4">
                        {files.length === 0 ? (
                            <div className="text-center text-gray-400 text-lg mt-20">
                                No files created
                            </div>
                        ) : (
                            <div className="bg-gray-800 rounded-lg shadow-lg">
                                <div className="grid grid-cols-4 gap-4 text-gray-400 text-sm px-4 py-2 border-b border-gray-700 font-semibold">
                                    <span>Name</span>
                                    <span>Date Created</span>
                                </div>

                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4 gap-4 items-center px-4 py-2 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                        <span className="text-white truncate hover:underline" onClick={() => navigate("/openfile", { state: { file } })}>{file.fileName}</span>
                                        <span className="text-gray-400">
                                            {new Date(file.createdAt || Date.now()).toLocaleString()}
                                        </span>
                                        <span className="flex justify-end">
                                            <Trash2
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteFile(file._id)}
                                            />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                </div>

            </div>
        </div>
    )

}

export default CreateFiles;