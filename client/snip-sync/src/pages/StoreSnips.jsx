import { Copy, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';

function StoreSnips() {
    const { projectId } = useParams();
    const [snips, setSnips] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCode, setNewCode] = useState('');

    useEffect(() => {
        const fetchSnips = async () => {
            try {
                const url = `http://localhost:8000/getresuablesnippets/${projectId}`;
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

    const handleAddResuableSnippets = async (e) => {
        e.preventDefault();
        if (!newTitle || !newCode) {
            toast.error("Please fill in both fields");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/addresuablesnippet", {
                projectId,
                title: newTitle,
                code: newCode
            });
            if (response.status === 201) {
                setSnips(prev => [response.data.snippet, ...prev]);
                toast.success("Snippet added!");
                setShowAddForm(false);
                setNewTitle('');
                setNewCode('');
            }
        } catch (error) {
            console.error("Error adding snippet:", error);
            toast.error(error.response?.data?.message || "Failed to add snippet");
        }
    };

    const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(() => toast.error("Failed to copy!"));
};

    return (
        <div>
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen bg-gray-900 text-white w-full flex flex-col relative">
                    <div className="w-full bg-black/30 mb-4 flex justify-between px-4 py-2">
                        <h1 className="text-2xl font-semibold p-4"> Your Reusable Snips</h1>
                        <button className="bg-cyan-900 px-4 py-2 rounded-md font-medium cursor-pointer" onClick={() => setShowAddForm(true)}>Add Snippet</button>
                    </div>
                    <div className="px-6 py-4">
                        {snips.length === 0 ? (
                            <div className="text-center text-gray-400 text-lg mt-20">
                                No reusable snips saved
                            </div>
                        ) : (
                            <div className="bg-gray-800 rounded-lg shadow-lg">
                                {snips.map((snip, index) => (
                                    <div
                                        key={index}

                                    >
                                        <div className="flex justify-between bg-gray-700 p-4">
                                            <span className="text-white truncate">Title: {snip.title}</span>
                                            <Copy onClick={() => handleCopy(snip.code)} className="cursor-pointer" />
                                        </div>
                                        <div className="bg-black p-4 m-2 rounded-2xl">
                                            <span className="text-white">{snip.code}</span>
                                        </div>
                                        <div className="flex justify-between bg-gray-700 p-4">
                                            <span className="text-gray-400">
                                                {new Date(snip.createdAt || Date.now()).toLocaleString()}
                                            </span>
                                            <span >
                                                <Trash2
                                                    className="text-red-600 cursor-pointer"
                                                    onClick={() => handleDeleteSnip(snip._id)}
                                                />
                                            </span>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {showAddForm && (
                        <form
                            className="bg-gray-800 p-4 rounded-t-lg flex flex-col gap-4 max-w-2xl w-full mx-auto mb-0"
                            style={{ position: "sticky", bottom: 0, left: 0, right: 0 }}
                            onSubmit={handleAddResuableSnippets}
                        >
                            <input
                                type="text"
                                placeholder="Snippet Title"
                                className="p-2 rounded bg-gray-700 text-white outline-0"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Your reusable code"
                                className="p-2 rounded bg-gray-700 text-white outline-0 min-h-[80px]"
                                value={newCode}
                                onChange={e => setNewCode(e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <button
                                    className="bg-cyan-900 px-4 py-2 rounded-md font-medium cursor-pointer"
                                    type="submit"
                                >
                                    Add Snippet
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-600 px-4 py-2 rounded-md font-medium cursor-pointer"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

        </div>
    );
}

export default StoreSnips;