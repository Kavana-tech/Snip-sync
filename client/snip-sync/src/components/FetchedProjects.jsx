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
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <div key={index} className="w-full">
                                <ProjectCard
                                    project={project}
                                    allProjects={projects}
                                    setProjects={setProjects}
                                    inviteLink={invite}
                                />
                                {/* --- Teams Display --- */}
                                {project.teams && project.teams.length > 0 && (
                                    <div className="ml-8 mt-2 mb-6 bg-gray-800 rounded p-4">
                                        <h3 className="font-semibold text-cyan-400 mb-2">Teams:</h3>
                                        <ul className="list-disc list-inside text-gray-200">
                                            {project.teams.map((team, tIdx) => (
                                                <li key={tIdx}>
                                                    <span className="font-semibold">{team.name}</span>
                                                    {team.members && team.members.length > 0 && (
                                                        <span>: {team.members.join(', ')}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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