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
const renderDiff = (oldText, newText) => {
    const diff = diffLines(oldText || "", newText || "");
    return diff.map((part, index) => {
        const style = {
            backgroundColor: part.added ? '#064e3b' : part.removed ? '#7f1d1d' : 'transparent',
            color: part.added || part.removed ? 'white' : 'inherit',
            padding: '4px 2px',
            margin: '0 0 6px 0',
            borderRadius: '2px',
            display: 'block', // Each diff part as a block for line-by-line
            whiteSpace: 'pre-wrap'
        };
        return (
            <span key={index} style={style}>
                {part.value}
            </span>
        );
    });
};


const OpenFile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { file } = location.state || {};
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
        if(!filterType || !filterValue)
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
                parentId: parentId || null
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
            <div className="flex">
                <Sidebar />
                <div className="min-h-screen bg-gray-900 text-white w-full">
                    <div className="w-full bg-black/30 mb-4 flex justify-between px-4 py-2">
                        <h1 className="text-2xl font-semibold p-4">{file.fileName}</h1>
                        <button className="bg-cyan-900 text-xl font-medium px-4 py-0 mt-2 rounded-sm cursor-pointer">Visualize</button>
                    </div>

                    <div className="w-full bg-black/30 mb-4 px-4 py-2  items-center gap-4 flex justify-between">
                        <div className="flex items-center text-white gap-2">
                            <span className="font-semibold">Filter</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 009 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                        </div>
                        <select
                            className="bg-gray-800 border border-gray-600 text-white  p-2 rounded-md w-2xs" value={filterType} onChange={e => {
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
                        <select className="bg-gray-800 border border-gray-600 text-white  p-2 rounded-md w-2xs"
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}>
                            <option value="">Select...</option>
                            {getFilterOptions().map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <button
                            className="bg-cyan-900 text-white px-4 py-2 rounded-sm cursor-pointer" onClick={handleSearch}

                        >
                            Search
                        </button>
                    </div>


                    {filteredSnippets.length === 0 ? (
                        <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                            <div className="border-2 border-dashed border-white max-w-[400px] flex flex-col justify-center items-center h-[200px] w-full bg-gray-800 rounded-2xl">
                                <p className="text-center">
                                    Add your Snippet and watch your code evolve with seamless version control!
                                </p>
                                <br />
                                <button
                                    className="bg-cyan-900 flex p-4 rounded-2xl cursor-pointer"
                                    onClick={() => setCreateCard(true)}
                                >
                                    Add New Snippet <Plus className="ml-2" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Snippets</h2>
                            {filteredSnippets.map((snippet, index) => {
                                const parentSnippet = snippets.find(s => s._id === snippet.parentId);
                                const siblingVersions = snippets.filter(s => s.parentId === snippet.parentId);
                                const versionNumber = snippet.parentId ? siblingVersions.findIndex(s => s._id === snippet._id) + 1 : 1;

                                return (
                                    <div key={snippet._id} className="bg-gray-800 p-4 mb-4 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-400">
                                                {snippet.snippetName}
                                                {snippet.parentId && parentSnippet
                                                    ? ` (version ${versionNumber} of ${parentSnippet.snippetName})`
                                                    : ''}
                                            </p>
                                            <div className="flex">
                                                <button title="Copy Current Code" onClick={() => handleCopySnippet(snippet.content)}><Copy className="text-gray-500 cursor-pointer" /></button>
                                                <button className="text-red-600 ml-4 cursor-pointer" onClick={() => handleDeleteSnippet(snippet._id)}>Delete</button>
                                                <button className="text-blue-400 ml-4 cursor-pointer" onClick={() => handleFork(snippet._id)}>Fork</button>
                                            </div>
                                        </div>

                                        <pre className="whitespace-pre-wrap bg-black p-6 mt-2 rounded-md">
                                            {snippet.parentId && parentSnippet
                                                ? renderDiff(parentSnippet.content, snippet.content)
                                                : snippet.content}
                                        </pre>
                                        <div className="mt-2 text-gray-400 bg-black/30 p-2 rounded-md">
                                            <p>Description: {snippet.description}</p>
                                        </div>
                                        <div className="mt-2 flex flex-wrap justify-between text-sm text-gray-400">
                                            <p>Tags: {snippet.tags && snippet.tags.length > 0 ? snippet.tags.join(', ') : 'No tags'}</p>
                                            <p>Created At: {new Date(snippet.createdAt).toLocaleString()}</p>
                                            <p className="bg-cyan-900 rounded-xl px-4 text-white">Created By: {snippet.author}</p>
                                        </div>


                                    </div>
                                );
                            })}

                        </div>
                    )}


                    <div
                        className="fixed bottom-0"
                        style={{
                            left: "220px", // matches your sidebar width
                            width: "calc(100% - 220px - 1rem)", // 1rem for right-4
                            background: "#000",
                            borderTop: "1px solid #374151",
                            zIndex: 10,
                            padding: "0.75rem 1rem"
                        }}
                    >
                        {createCard && (
                            <div className="w-full m-4">
                                <div className="flex flex-col">
                                    <div className="flex mb-4 gap-4">
                                        <input type="text" value={snippetName} placeholder="Enter the Name of Your Snippet" onChange={(e) => setSnippetName(e.target.value)} className="border-2 mt-2 border-gray-700 max-w-[300px] w-full p-2 rounded-md" />



                                        <input type="text" value={description} placeholder="Enter the description" onChange={(e) => setDescription(e.target.value)} className="border-2 mt-2 border-gray-700 w-full p-2 rounded-md" />
                                    </div>

                                    <textarea
                                        placeholder="Enter your Snippet" rows="7"
                                        className="border-2 border-gray-700 w-full p-2 rounded-md"
                                        value={snippetContent}
                                        onChange={(e) => setSnippetContent(e.target.value)}
                                    ></textarea>
                                    <TagSelectField value={tag} onChange={setTag} />
                                    <div className="flex gap-6">
                                        <button
                                            className="bg-cyan-900 p-2 mt-4 font-medium text-xl min-w-[300px] rounded-sm cursor-pointer"
                                            onClick={handleAddSnippet}
                                        >
                                            Add Snippet
                                        </button>
                                        <button className="bg-cyan-900 p-2 mt-4 font-medium text-xl min-w-[300px] rounded-sm cursor-pointer"
                                            onClick={() => setCreateCard(false)}>Cancel</button>
                                    </div>

                                </div>



                                {parentId && (
                                    <p className="text-white font-medium mt-2">
                                        Creating a new version from parent : {parentName}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenFile;
