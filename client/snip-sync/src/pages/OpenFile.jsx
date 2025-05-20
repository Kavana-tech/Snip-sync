import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Copy, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import { diffWords } from 'diff';
import { socket } from "../socket";

const renderDiff = (oldText, newText) => {
    const diff = diffWords(oldText || "", newText || "");
    return diff.map((part, index) => {
        const style = {
            backgroundColor: part.added ? '#064e3b' : part.removed ? '#7f1d1d' : 'transparent',
            color: part.added || part.removed ? 'white' : 'inherit',
            padding: '0 2px',
            borderRadius: '2px',
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

    const handleAddSnippet = async () => {
        try {
            const res = await axios.post("http://localhost:8000/addsnippet", {
                fileId: file._id,
                content: snippetContent,
                snippetName,
                tags: tag,
                parentId: parentId || null
            }, { withCredentials: true });

            toast.success("Snippet added successfully!");
            setSnippetContent("");
            setParentId(null);
            setTag('');
            setSnippetName('');
            setCreateCard(false);
            setSnippets([...snippets, res.data.snippet]);
        } catch (error) {
            console.error("Error adding snippet:", error);
            toast.error("Failed to add snippet");
        }
    };


    const handleFork = (id) => {
        setParentId(id);
        setCreateCard(true);
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

                    <div className="w-full bg-black/30 mb-4 px-4 py-2 flex items-center gap-4">
                        <div className="flex items-center text-white gap-2">
                            <span className="font-semibold">Filter</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                        </div>
                        <select
                            className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                           
                            
                        >
                            <option value="">Select filter by</option>
                            <option value="name">Snippet Name</option>
                            <option value="tag">Tag</option>
                            <option value="date">Created Date</option>
                        </select>
                        <input
                            type="text"
                            className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                            placeholder="Enter search term"
                            
                        />
                        <button
                            className="bg-cyan-900 text-white px-4 py-2 rounded-sm"
                            
                        >
                            Search
                        </button>
                    </div>


                    {snippets.length === 0 ? (
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
                            {snippets.map((snippet, index) => {
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
                                                <button className="text-blue-600 ml-4 cursor-pointer" onClick={() => handleFork(snippet._id)}>Fork</button>
                                            </div>
                                        </div>

                                        <pre className="whitespace-pre-wrap bg-black p-2 mt-2">
                                            {snippet.parentId && parentSnippet
                                                ? renderDiff(parentSnippet.content, snippet.content)
                                                : snippet.content}
                                        </pre>
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


                    <div className="fixed bottom-0 left-[250px] w-full bg-gray-800 border-t border-gray-700 flex px-4 py-3 z-10">
                        {createCard && (
                            <div className="w-full m-4">
                                <div className="flex flex-col">
                                    <div className="flex mb-4 gap-4">
                                        <input type="text" value={snippetName} placeholder="Enter the Name of Your Snippet" onChange={(e) => setSnippetName(e.target.value)} className="border-2 mt-2 border-gray-700 max-w-[300px] w-full p-2 rounded-md" />
                                        <input type="text" value={tag} placeholder="Enter the tag" onChange={(e) => setTag(e.target.value)} className="border-2 mt-2 border-gray-700 max-w-[300px] w-full p-2 rounded-md" />
                                    </div>

                                    <textarea
                                        placeholder="Enter your Snippet"
                                        className="border-2 border-gray-700 max-w-[900px] w-full p-2 rounded-md"
                                        value={snippetContent}
                                        onChange={(e) => setSnippetContent(e.target.value)}
                                    ></textarea>
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
                                        Creating a new version from parent snippet ID: {parentId}
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
