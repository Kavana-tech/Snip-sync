import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";

function ProjectCard({ project ,allProjects, setProjects, inviteLink}) {
    const [editProjectInfo, setEditProjectInfo] = useState(false);
    const [deleteProjectInfo, setDeleteProjectInfo] = useState(false);
    const handleEdit = () => {
        setEditProjectInfo(true);
    }
    const handleClose = () => {
        setEditProjectInfo(false);
        setDeleteProjectInfo(false);
    }
 
    return (
        <div>
            {editProjectInfo && (
                <EditProject
                    editProject={project} onClose={handleClose} setProjects={setProjects} invite={inviteLink}
                />

            )}
            {deleteProjectInfo && <DeleteProject deleteProject={project} onClose={handleClose} allProjects={allProjects} setProjects={setProjects}/>}
            <div className=" min-w-[300px] w-full max-w-[400px] cursor-pointer ml-12 mr-12 mt-6 p-6  flex flex-col justify-center rounded-md items-center bg-gray-800 hover:outline-2 hover:outline-cyan-400 transition-all duration-150 ease-in-out">
                <h1 className="text-2xl font-medium">{project.title}</h1>
                <p className="mt-4">{project.description}</p>
                <div className="flex justify-between w-full mt-4">
                    <button className="text-blue-500 flex gap-1 items-center cursor-pointer" onClick={handleEdit}>Edit<Pencil className="h-4 w-4" /></button>
                    <button className="text-red-500 flex gap-1 items-center cursor-pointer" onClick={()=>setDeleteProjectInfo(true)}>Delete<Trash2 className="h-4 w-4" /></button>
                </div>

            </div>
        </div>
    )
}

export default ProjectCard;