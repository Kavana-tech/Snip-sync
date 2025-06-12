import React from "react";
import ProjectCard from "./ProjectCard";
import DashProjectCard from "./DashProjectCard";

function FetchedProjects({ projects, setProjects, invite }) {
    const displayProjectCard = projects && setProjects && invite;
    const displayDashboardProjectCard = projects && (!setProjects || !invite);

    return (
        <div>
            {displayProjectCard && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
                    {projects.length > 0 ? (projects.map((project, index) => (
                        <div key={index} className="w-full">
                            <ProjectCard project={project} allProjects={projects} setProjects={setProjects}
                                inviteLink={invite}
                            />
                        </div>
                    ))
                    ) : (
                        <h1 className="text-center text-gray-400 col-span-full">No Projects Available</h1>
                    )}
                </div>
            )}
            {displayDashboardProjectCard && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <DashProjectCard key={index} project={project} />
                        ))
                    ) : (
                        <h1 className="text-center text-gray-400 col-span-full">No Projects Available</h1>
                    )}
                </div>
            )}
        </div>
    );
}

export default FetchedProjects;