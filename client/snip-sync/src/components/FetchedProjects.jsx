import React from "react";
import ProjectCard from "./ProjectCard";
import DashProjectCard from "./DashProjectCard";

function FetchedProjects({ projects, setProjects, invite }) {
    const displayProjectCard = projects && setProjects && invite;
    const displayDashboardProjectCard = projects && (!setProjects || !invite);

    return (
        <div>
            {displayProjectCard && (
                <div className="grid grid-cols-2 gap-6">
                    {projects.length > 0 ? (projects.map((project, index) => (
                        <div key={index} className="w-full">
                            <ProjectCard project={project} allProjects={projects} setProjects={setProjects}
                                inviteLink={invite}
                            />

                        </div>
                    ))
                    ) : (
                        <h1>No Projects Available</h1>
                    )}
                </div>
            )}
            {displayDashboardProjectCard && (
                <div className="flex flex-wrap gap-6">
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <DashProjectCard key={index} project={project} />
                        ))
                    ) : (
                        <h1>No Projects Available</h1>
                    )}
                </div>
            )}
        </div>
    );
}

export default FetchedProjects;