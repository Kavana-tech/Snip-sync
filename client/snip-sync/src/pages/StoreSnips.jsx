import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';

function StoreSnips() {
    const { projectId } = useParams();
    const [snips, setSnips] = useState([]);

    useEffect(() => {
        const fetchSnips = async () => {
            try {
                const url = `http://localhost:8000/getsavedreusable/${projectId}`;
                const response = await axios.get(url);
                setSnips(response.data.snips || []);
            } catch (error) {
                console.log("Error fetching snips:", error);
            }
        };
        if (projectId) fetchSnips();
    }, [projectId]);

    const handleDeleteSnip = async (snipId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/deletesnip/${snipId}`);
            if (response.status === 200) {
                setSnips(prevSnips => prevSnips.filter(snip => snip._id !== snipId));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting snip:", error);
            toast.error(error.response?.data?.message || "Error deleting snip");
        }
    };

    return (
        <div>
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex">
                <Sidebar />
                <div className="min-h-screen bg-gray-900 text-white w-full">
                    <div className="w-full bg-black/30 mb-4 flex justify-between px-4 py-2">
                        <h1 className="text-2xl font-semibold p-4"> Your Reusable Snips</h1>
                    </div>
                    <div className="px-6 py-4">
                        {snips.length === 0 ? (
                            <div className="text-center text-gray-400 text-lg mt-20">
                                No reusable snips saved
                            </div>
                        ) : (
                            <div className="bg-gray-800 rounded-lg shadow-lg">
                                <div className="grid grid-cols-4 gap-4 text-gray-400 text-sm px-4 py-2 border-b border-gray-700 font-semibold">
                                    <span>Title</span>
                                    <span>Preview</span>
                                    <span>Date Saved</span>
                                    <span>Actions</span>
                                </div>
                                {snips.map((snip, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4 gap-4 items-center px-4 py-2 border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="text-white truncate">{snip.title}</span>
                                        <span className="text-gray-400 truncate max-w-xs">{snip.code.slice(0, 60)}{snip.code.length > 60 ? "..." : ""}</span>
                                        <span className="text-gray-400">
                                            {new Date(snip.createdAt || Date.now()).toLocaleString()}
                                        </span>
                                        <span className="flex justify-end">
                                            <Trash2
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteSnip(snip._id)}
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
    );
}

export default StoreSnips;