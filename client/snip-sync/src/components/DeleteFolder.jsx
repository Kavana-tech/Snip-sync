import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';

function DeleteFolder({ deleteFolder, onClose, allFolders, setFolders }) {
    if (!deleteFolder) return null;

    const handleDeleteFolder = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/deletefolder/${deleteFolder._id}`);
            toast.success(response.data.message);

            setFolders(allFolders.filter((folder) => folder._id !== deleteFolder._id));
            onClose();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete folder.");
        }
    };

    return (
        <>
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <AnimatePresence>
                {deleteFolder && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-gray-900 p-10 rounded-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-2xl font-medium m-4">Delete This Folder</h1>
                            <p>Are you sure you want to delete this folder?</p>
                            <div className="w-full flex justify-between mt-6">
                                <button className="font-medium text-red-500 cursor-pointer" onClick={handleDeleteFolder}>Yes</button>
                                <button className="font-medium text-blue-500 cursor-pointer" onClick={onClose}>No</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default DeleteFolder;
