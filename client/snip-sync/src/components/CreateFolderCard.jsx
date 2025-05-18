import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import DeleteFolder from "./DeleteFolder";
import { useNavigate } from "react-router-dom";

function CreateFolderCard({ allFolders, setFormCard, setAllFolders }) {
    const [folderToDelete, setFolderToDelete] = useState(null);
    const navigate = useNavigate();

    const handleClose = () => {
        setFolderToDelete(null);
    };

    return (
        <>
            {allFolders.length === 0 ? (
                <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
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
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allFolders.map((folder) => (
                        <div
                            key={folder._id}
                            className="bg-gray-800 p-4 rounded-xl shadow-md border border-white/10 cursor-pointer transform transition-transform duration-200 hover:scale-105" 
                        >
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold hover:underline" onClick={()=>navigate(`/files/${folder._id}`)}>{folder.folderName}</h2>
                                <Trash2
                                    className="text-red-600 cursor-pointer"
                                    onClick={() => setFolderToDelete(folder)}
                                />
                            </div>
                            <p className="text-sm text-gray-400 mt-2">{folder.files?.length || 0} files</p>
                        </div>
                    ))}
                </div>
            )}
            {folderToDelete && (
                <DeleteFolder
                    deleteFolder={folderToDelete}
                    onClose={handleClose}
                    allFolders={allFolders}
                    setFolders={setAllFolders}
                />
            )}
        </>
    );
}

export default CreateFolderCard;
