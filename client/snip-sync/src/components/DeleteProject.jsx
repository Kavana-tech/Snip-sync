import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';

function DeleteProject({ deleteProject, onClose, allProjects, setProjects }) {
    const [card, setCard] = useState(true);
    const handleDeleteProject = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/deleteproject/${deleteProject._id}`);
            setProjects(allProjects.filter((proj) => proj._id !== deleteProject._id));
            console.log(response);
            toast.success(response.data.message);
            setCard(false);
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    const handleClose = () => {
        setCard(false);
        setTimeout(onClose, 300);
    }
    return (
        <div>
            <Toaster toastOptions={{style: {background: '#1F2937', color: 'white'}}}/>
            <div>
                <AnimatePresence>
                    {card && <motion.div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center" initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}>
                        <motion.div className="bg-gray-900 p-10" initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}>
                            <h1 className="text-2xl font-medium m-4">Delete Your Project</h1>
                            <p>Do you want to delete this project?</p>
                            <div className="w-full flex justify-between mt-6">
                                <button className="font-medium text-red-500 cursor-pointer" onClick={handleDeleteProject}>Yes</button>
                                <button className="font-medium text-blue-500 cursor-pointer" onClick={handleClose}>No</button>
                            </div>
                        </motion.div>
                    </motion.div>}
                </AnimatePresence>
            </div>

        </div>

    )
}

export default DeleteProject;