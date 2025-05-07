import React from "react";
import ProjectCard from "./ProjectCard";
function FetchedProjects({projects, setProjects, invite}) {
    return(
        <div className="flex flex-wrap gap-6">
           {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <ProjectCard key={index} project={project} allProjects={projects} setProjects={setProjects} inviteLink={invite}/>
                    ))
                   
                ) : <h1>No Projects Available</h1>}
        </div>
    )
}

export default FetchedProjects;