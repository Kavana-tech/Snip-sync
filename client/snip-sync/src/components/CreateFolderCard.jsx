import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import DeleteFolder from "./DeleteFolder";
import { useNavigate } from "react-router-dom";

function CreateFolderCard({ allFolders, setFormCard, setAllFolders, projectId }) {
    const [folderToDelete, setFolderToDelete] = useState(null);
    const navigate = useNavigate();

    const handleClose = () => {
        setFolderToDelete(null);
    };

    return (
        <>
            {allFolders.length === 0 ? (
                <div className="flex justify-center items-center h-[calc(100vh-18rem)]">
                    <div className="border-2 border-dashed border-white max-w-[400px] flex flex-col justify-center items-center h-[200px] w-full bg-gray-800 rounded-2xl">
                        <p>Create your folder</p><br />
                        <button
                            className="bg-cyan-900 flex p-4 rounded-2xl cursor-pointer"
                            onClick={() => setFormCard(true)}
                        >
                            Create New Folder <Plus className="ml-2" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allFolders.map((folder) => (
                        <div
                            key={folder._id}
                            className="h-full min-h-[180px] flex flex-col justify-between w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 border border-gray-700 transition-transform hover:scale-105 hover:shadow-cyan-700/40"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2
                                    className="text-xl font-semibold hover:underline cursor-pointer text-white"
                                    onClick={() => navigate(`/files/${folder._id}`, {state: {projectId}})}
                                >
                                    {folder.folderName}
                                </h2>
                                <Trash2
                                    className="text-red-600 cursor-pointer hover:text-red-400 transition"
                                    onClick={() => setFolderToDelete(folder)}
                                />
                            </div>
                            <p className="text-sm text-gray-300 mb-4">{folder.files?.length || 0} files</p>
                            <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-800/80 rounded-lg px-3 py-2 mb-2">
                                <span>Created by: {folder.createdBy}</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                {new Date(folder.createdAt).toLocaleString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DeleteFolder
                deleteFolder={folderToDelete}
                onClose={handleClose}
                allFolders={allFolders}
                setFolders={setAllFolders}
                projectId={projectId}
            />

        </>
    );
}

export default CreateFolderCard;
