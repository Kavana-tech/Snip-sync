import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast'


function ProjectCard({ project, allProjects, setProjects, inviteLink }) {
    const [editProjectInfo, setEditProjectInfo] = useState(false);
    const [deleteProjectInfo, setDeleteProjectInfo] = useState(false);
    const [newLink, setNewLink] = useState('');
    const [inviteCard, setInviteCard] = useState(false);
    const handleEdit = () => {
        setEditProjectInfo(true);
    }
    const handleClose = () => {
        setEditProjectInfo(false);
        setDeleteProjectInfo(false);
    }

    const handleAddMember = () => {
        try {
            let res = axios.get(`http://localhost:8000/addmember/${project._id}`, { withCredentials: true });
            let link = `http://localhost:8000/${res.data.inviteToken}`;
            setNewLink(link);
            setInviteCard(true);
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message || 'Error while adding member')
        }
    }

    return (
        <div>
            <Toaster toastOptions={{ duration: 500, style: { background: '#1F2937', color: 'white' } }} />
            <div>

                {editProjectInfo && (
                    <EditProject
                        editProject={project} onClose={handleClose} setProjects={setProjects} invite={inviteLink}
                    />

                )}
                {deleteProjectInfo && <DeleteProject deleteProject={project} onClose={handleClose} allProjects={allProjects} setProjects={setProjects} />}
                <div className=" min-w-[550px] w-full max-w-[550px]  ml-12 mr-12 mt-6 flex flex-col justify-center rounded-md bg-gray-800">
                    <div className="w-full bg-gray-700 text-gray-400 flex justify-between p-4 top-0 rounded-sm">
                        <p className="capitalize">{project.workingAs} Development</p>
                        <p>{new Date(project.createdAt).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}</p>
                    </div>
                    <div className="flex min-w- justify-end w-full">
                        <button title="Edit" className="text-blue-500 cursor-pointer" onClick={handleEdit}><Pencil className="h-4 w-4 mt-4 mr-6" /></button>
                    </div>
                    <div className="mt-4 pb-6 text-center">

                        <h1 className="text-2xl font-medium hover:underline capitalize">{project.title}</h1>

                        <p className="mt-4 truncate">{project.description}</p>
                    </div>
                    <div className="flex justify-between w-full text-[18px] p-4">
                        <button className="font-medium bg-cyan-900 p-2 rounded-md cursor-pointer" onClick={handleAddMember}>
                            Add Member
                        </button>

                        <button title="Delete" className="text-red-500 flex gap-1 items-center cursor-pointer" onClick={() => setDeleteProjectInfo(true)}>Delete<Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="w-full bg-gray-700 text-gray-400 mt-4 p-4 rounded-sm">
                        <p>Created by: {project.createdBy}</p>
                    </div>

                </div>
                {/* <div>
                    <h1>Add New Team Member</h1>
                    <input type="text" value={newLink} readOnly/>
                </div> */}
            </div>
        </div>
    )
}

export default ProjectCard;