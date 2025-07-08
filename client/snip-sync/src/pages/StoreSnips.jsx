import { Copy, Trash2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

function StoreSnips() {
    const { projectId } = useParams();
    const [snips, setSnips] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCode, setNewCode] = useState('');
    const [language, setLanguage] = useState('javascript');

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
                code: newCode,
                language // include language
            });
            if (response.status === 201) {
                setSnips(prev => [response.data.snippet, ...prev]);
                toast.success("Snippet added!");
                setShowAddForm(false);
                setNewTitle('');
                setNewCode('');
                setLanguage('javascript');
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
                <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white px-8 py-8">
                    <div className="flex items-center justify-between px-6 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <div className="flex gap-2 items-center">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                                <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                            </svg>
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Your Reusable Snips</h1>
                        </div>
                        <button
                            className="bg-cyan-600 hover:bg-cyan-500 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow transition"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus className="w-5 h-5" /> Add Snippet
                        </button>
                    </div>
                    <div className="p-4">
                        {snips.length === 0 ? (
                            <div className="flex flex-col justify-between items-center w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 border border-gray-700 mb-6">
                                <div className="border-2 border-dashed border-cyan-600 max-w-[400px] flex flex-col justify-center items-center h-[220px] w-full bg-gray-800 rounded-2xl shadow-lg">
                                    <p className="text-center text-gray-300">
                                        No reusable snips saved. Add your reusable code snippets here!
                                    </p>
                                    <br />
                                    <button
                                        className="bg-cyan-600 hover:bg-cyan-500 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow transition"
                                        onClick={() => setShowAddForm(true)}
                                    >
                                        <Plus className="w-5 h-5" /> Add New Snippet
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {snips.map((snip, index) => (
                                    <div
                                        key={snip._id}
                                        className="flex flex-col justify-between w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 border border-gray-700 mb-6"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-lg font-semibold text-cyan-400 truncate">Title: {snip.title}</span>
                                            <div className="flex gap-2">
                                                <button title="Copy Code" onClick={() => handleCopy(snip.code)}>
                                                    <Copy className="text-gray-400 hover:text-cyan-400 transition cursor-pointer" />
                                                </button>
                                                <button title="Delete" onClick={() => handleDeleteSnip(snip._id)}>
                                                    <Trash2 className="text-red-500 hover:text-red-300 transition cursor-pointer" />
                                                </button>
                                            </div>
                                        </div>
                                        <SyntaxHighlighter
                                            language={snip.language || "javascript"}
                                            style={oneDark}
                                            customStyle={{
                                                background: 'rgba(17,24,39,0.8)',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.95rem',
                                                padding: '1rem',
                                                marginTop: '0.5rem',
                                                minHeight: '120px',
                                                maxHeight: '320px',
                                                overflowX: 'auto'
                                            }}
                                            showLineNumbers
                                        >
                                            {snip.code}
                                        </SyntaxHighlighter>
                                        <div className="mt-2 flex flex-wrap justify-between text-xs text-gray-400 gap-2">
                                            <span>Created: {new Date(snip.createdAt || Date.now()).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.form
                                    className="flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl py-2 px-6 border border-cyan-700 max-w-3xl mx-auto mt-12 max-h-[95vh] w-full"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleAddResuableSnippets}
                                >
                                    <div className="flex mb-4 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Snippet Title"
                                            className="border-2 mt-2 border-gray-700 max-w-[300px] w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
                                            value={newTitle}
                                            onChange={e => setNewTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Your reusable code"
                                        className="border-2 border-gray-700 w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400 min-h-[120px]"
                                        value={newCode}
                                        onChange={e => setNewCode(e.target.value)}
                                        required
                                        rows={7}
                                    />
                                    <label className="mt-6 mb-4">Select Language:</label>
                                    <select
                                        value={language}
                                        onChange={e => setLanguage(e.target.value)}
                                        className="border-2 border-gray-700 w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="c">C</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="go">Go</option>
                                        <option value="ruby">Ruby</option>
                                        <option value="php">PHP</option>
                                        <option value="swift">Swift</option>
                                        <option value="kotlin">Kotlin</option>
                                        <option value="rust">Rust</option>
                                        <option value="bash">Bash</option>
                                        <option value="json">JSON</option>
                                        <option value="css">CSS</option>
                                        <option value="html">HTML</option>
                                        <option value="markdown">Markdown</option>
                                    </select>
                                    <div className="flex gap-6">
                                        <button
                                            className="bg-cyan-600 hover:bg-cyan-500 p-2 mt-4 font-medium text-lg min-w-[180px] rounded-md text-white shadow transition"
                                            type="submit"
                                        >
                                            Add Snippet
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-gray-700 hover:bg-gray-600 p-2 mt-4 font-medium text-lg min-w-[180px] rounded-md text-white shadow transition"
                                            onClick={() => setShowAddForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default StoreSnips;