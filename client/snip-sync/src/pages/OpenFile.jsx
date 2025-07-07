import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Copy, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import { diffLines } from 'diff';
import { socket } from "../socket";
import TagSelectField from "../components/TagSelectField";
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TeamBar from "../components/TeamBar";


const OpenFile = () => {
    //const navigate = useNavigate();
    const location = useLocation();
    const file = location.state?.file || {};
    const projectId = location.state?.projectId;
    const [createCard, setCreateCard] = useState(false);
    const [snippetContent, setSnippetContent] = useState("");
    const [snippets, setSnippets] = useState([]);
    const [parentId, setParentId] = useState(null);
    const [tag, setTag] = useState([]);
    const [snippetName, setSnippetName] = useState('');
    const [description, setDescription] = useState('');
    const [parentName, setParentName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filteredSnippets, setFilteredSnippets] = useState([])
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {

        socket.emit("join-file", file._id);

        const onSnippetAdded = ({ fileId, snippet }) => {
            if (fileId === file._id) {
                setSnippets(prev => {
                    const exists = prev.find(s => s._id === res.data.snippet._id);
                    if (exists) return prev;
                    return [...prev, res.data.snippet];
                });
                toast.success(`New snippet "${snippet.snippetName}" added`);
            }
        };

        const onSnippetDeleted = ({ fileId, snippetId }) => {
            if (fileId === file._id) {
                setSnippets(prev => prev.filter(s => s._id !== snippetId));
                toast.success("A snippet was deleted");
            }
        };

        socket.on("snippet-added", onSnippetAdded);
        socket.on("snippet-deleted", onSnippetDeleted);

        return () => {
            socket.emit("leave-file", file._id);
            socket.off("snippet-added", onSnippetAdded);
            socket.off("snippet-deleted", onSnippetDeleted);
        };
    }, [file._id]);

    useEffect(() => {
        if (!filterType || !filterValue)
            setFilteredSnippets(snippets);
    }, [snippets, filterType, filterValue])

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/snippets/${file._id}`);
                setSnippets(res.data.snippets);
            } catch (err) {
                console.error("Error fetching snippets:", err);
            }
        };
        fetchSnippets();
    }, [file._id]);

    const getFilterOptions = () => {
        if (filterType === 'tag') {
            const tags = snippets.flatMap(s => s.tags || []);
            return [...new Set(tags)];
        }
        if (filterType === "author") {
            return [...new Set(snippets.map(s => s.author))];
        }
        if (filterType === "name") {
            return [...new Set(snippets.map(s => s.snippetName))];
        }
        if (filterType === "date") {
            return [...new Set(snippets.map(s => new Date(s.createdAt).toISOString().slice(0, 10)))];
        }
        return [];
    }

    const handleAddSnippet = async () => {
        try {
            const res = await axios.post("http://localhost:8000/addsnippet", {
                fileId: file._id,
                content: snippetContent,
                snippetName,
                tags: tag,
                description,
                parentId: parentId || null,
                language
            }, { withCredentials: true });

            toast.success("Snippet added successfully!");
            setSnippetContent("");
            setParentId(null);
            setTag([]);
            setSnippetName('');
            setDescription('');
            setCreateCard(false);
            setSnippets([...snippets, res.data.snippet]);
        } catch (error) {
            console.error("Error adding snippet:", error);
            toast.error("Failed to add snippet");
        }
    };

    const getParentName = async (parentId) => {
        const parent = await axios.get(`http://localhost:8000/getparentname/${parentId}`);
        setParentName(parent.data.parentName);
    }


    const handleFork = (id) => {
        setParentId(id);
        setCreateCard(true);
        getParentName(id);
        const parentSnippet = snippets.find(s => s._id === id);
        setSnippetContent(parentSnippet.content || '');
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    const handleDeleteSnippet = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/deletesnippet/${id}`);
            toast.success("Snippet deleted successfully!");
            setSnippets(snippets.filter(snippet => snippet._id !== id));
        } catch (error) {
            console.error("Error deleting snippet:", error);
            toast.error("Failed to delete snippet");
        }
    };

    const handleCopySnippet = (copiedSnip) => {
        navigator.clipboard.writeText(copiedSnip).then(() => {
            toast.success("Link Copied");
        }).catch(error => {
            console.log(error);
            toast.error("Can't Copy Link");
        })
    }

    const handleSearch = () => {
        if (!filterType || !filterValue) {
            setFilteredSnippets(snippets);
            return;
        }
        let filtered = [];
        if (filterType === "tag") {
            filtered = snippets.filter(s => (s.tags || []).includes(filterValue));
        } else if (filterType === "author") {
            filtered = snippets.filter(s => s.author === filterValue);
        } else if (filterType === "name") {
            filtered = snippets.filter(s => s.snippetName === filterValue);
        } else if (filterType === "date") {
            filtered = snippets.filter(s => new Date(s.createdAt).toISOString().slice(0, 10) === filterValue);
        }
        setFilteredSnippets(filtered);
    }


    return (
        <div>
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex ml-64 mr-60">
                <Sidebar />
                <TeamBar projId={projectId} />
                <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white px-8 py-8">
                    <div className="flex items-center justify-between px-6 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <div className="flex gap-2 items-center">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                                <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                            </svg>
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">{file.fileName}</h1>
                        </div>
                    </div>

                    <div className="w-full bg-black/30 mb-4 px-4 py-2 flex flex-col md:flex-row items-center gap-4 justify-between rounded-xl shadow">
                        <div className="flex items-center text-white gap-2">
                            <span className="font-semibold">Filter</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 009 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md w-full md:w-44"
                                value={filterType}
                                onChange={e => {
                                    setFilterType(e.target.value);
                                    setFilterValue('');
                                }}
                            >
                                <option value="">Filter by...</option>
                                <option value="name">Snippet Name</option>
                                <option value="tag">Tag</option>
                                <option value="author">Author</option>
                                <option value="date">Created Date</option>
                            </select>
                            <select
                                className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md w-full md:w-44"
                                value={filterValue}
                                onChange={e => setFilterValue(e.target.value)}
                            >
                                <option value="">Select...</option>
                                {getFilterOptions().map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <button
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md font-semibold shadow transition"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </div>


                    {filteredSnippets.length === 0 ? (
                        <div className=" flex flex-col justify-between items-center w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 border border-gray-700 mb-6">
                            <div className="border-2 border-dashed border-cyan-600 max-w-[400px] flex flex-col justify-center items-center h-[220px] w-full bg-gray-800 rounded-2xl shadow-lg">
                                <p className="text-center text-gray-300">
                                    Add your Snippet and watch your code evolve with seamless version control!
                                </p>
                                <br />
                                <button
                                    className="bg-cyan-600 hover:bg-cyan-500 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow transition"
                                    onClick={() => setCreateCard(true)}
                                >
                                    <Plus className="w-5 h-5" /> Add New Snippet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            {filteredSnippets.map((snippet, index) => {
                                const parentSnippet = snippets.find(s => s._id === snippet.parentId);
                                const siblingVersions = snippets.filter(s => s.parentId === snippet.parentId);
                                const versionNumber = snippet.parentId ? siblingVersions.findIndex(s => s._id === snippet._id) + 1 : 1;

                                return (
                                    <div key={snippet._id} className=" flex flex-col justify-between w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 border border-gray-700 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-lg font-semibold text-cyan-400">
                                                {snippet.snippetName}
                                                {snippet.parentId && parentSnippet
                                                    ? ` (version ${versionNumber} of ${ parentSnippet.snippetName ? parentSnippet.snippetName : 'Root Node'})`
                                                    : 'Root Node'}
                                            </p>
                                            <div className="flex gap-2">
                                                <button title="Copy Current Code" onClick={() => handleCopySnippet(snippet.content)}>
                                                    <Copy className="text-gray-400 hover:text-cyan-400 transition cursor-pointer" />
                                                </button>
                                                <button title="Delete" onClick={() => handleDeleteSnippet(snippet._id)}>
                                                    <span className="text-red-500 hover:text-red-300 font-semibold transition">Delete</span>
                                                </button>
                                                <button title="Fork" onClick={() => handleFork(snippet._id)}>
                                                    <span className="text-blue-400 hover:text-blue-200 font-semibold transition">Fork</span>
                                                </button>
                                            </div>
                                        </div>
                                        {snippet.parentId && parentSnippet ? (

                                            <div className="bg-black/80 rounded-md p-2 mt-2 mb-2" style={{ fontFamily: 'monospace', fontSize: '0.95rem', minHeight: 120, maxHeight: 320, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                                                {diffLines(parentSnippet.content || "", snippet.content || "").map((part, idx) => (
                                                    <SyntaxHighlighter
                                                        key={idx}
                                                        language={snippet.language || "javascript"}
                                                        style={oneDark}
                                                        customStyle={{
                                                            background: part.added
                                                                ? "#064e3b"
                                                                : part.removed
                                                                    ? "#7f1d1d"
                                                                    : "rgba(17,24,39,0.8)",
                                                            color: part.added || part.removed ? "white" : undefined,
                                                            borderRadius: "0.5rem",
                                                            fontSize: "0.95rem",
                                                            padding: "0.2rem 1rem",
                                                            margin: 0,
                                                            minHeight: "1.2em",
                                                            overflowX: "auto",
                                                        }}
                                                        showLineNumbers={false}
                                                    >
                                                        {part.value}
                                                    </SyntaxHighlighter>
                                                ))}
                                            </div>
                                        ) : (
                                            <SyntaxHighlighter
                                                language={snippet.language || "javascript"}
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
                                                {snippet.content}
                                            </SyntaxHighlighter>
                                        )}
                                        <div className="mt-2 text-gray-400 bg-black/30 p-2 rounded-md text-sm">
                                            <p>Description: {snippet.description}</p>
                                        </div>
                                        <div className="mt-2 flex flex-wrap justify-between text-xs text-gray-400 gap-2">
                                            <p>Tags: {snippet.tags && snippet.tags.length > 0 ? snippet.tags.join(', ') : 'No tags'}</p>
                                            <p>Created: {new Date(snippet.createdAt).toLocaleString()}</p>
                                            <p className="bg-cyan-900 rounded-xl px-3 py-1 text-white">By: {snippet.author}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                    <AnimatePresence>
                        {createCard && (
                            <motion.div
                                className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="w-full ml-10"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl py-2 px-6 border border-cyan-700 max-w-3xl mx-auto mt-12 max-h-[95vh]">
                                        <div className="flex mb-4 gap-4">
                                            <input type="text" value={snippetName} placeholder="Enter the Name of Your Snippet" onChange={(e) => setSnippetName(e.target.value)} className="border-2 mt-2 border-gray-700 max-w-[300px] w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400" />
                                            <input type="text" value={description} placeholder="Enter the description" onChange={(e) => setDescription(e.target.value)} className="border-2 mt-2 border-gray-700 w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400" />
                                        </div>
                                        <textarea
                                            placeholder="Enter your Snippet" rows="7"
                                            className="border-2 border-gray-700 w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
                                            value={snippetContent}
                                            onChange={(e) => setSnippetContent(e.target.value)}
                                        ></textarea>
                                        <TagSelectField value={tag} onChange={setTag} />
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
                                                onClick={handleAddSnippet}
                                            >
                                                Add Snippet
                                            </button>
                                            <button className="bg-gray-700 hover:bg-gray-600 p-2 mt-4 font-medium text-lg min-w-[180px] rounded-md text-white shadow transition"
                                                onClick={() => setCreateCard(false)}>Cancel</button>
                                        </div>
                                        {parentId ? (
                                            <p className="text-white font-medium mt-2">
                                                Creating a new version from parent : {parentName === null || parentName === "" ? "Root Node" : parentName}
                                            </p>
                                        ): '"Creating a new version from parent :"Root Node""'}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default OpenFile;
