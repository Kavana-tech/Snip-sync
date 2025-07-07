import React, { useEffect, useState } from "react";

function TeamBar({ projId }) {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`http://localhost:8000/getaproject/${projId}`);
                const data = await res.json();
                setTeamMembers(data.foundProject.teamMembers || []);
            } catch (err) {
                setTeamMembers([]);
            }
        }
        if (projId) fetchProject();
    }, [projId]);

    return (
        <div className="fixed top-0 right-0 w-64 h-screen bg-gray-900 border-l border-gray-700 shadow-2xl p-6 z-50 overflow-y-auto flex flex-col">
            <h3 className="mb-6 text-white text-2xl font-bold text-center border-b-4 border-blue-500 pb-2 tracking-wide">
                Team Members
            </h3>
            {teamMembers.length > 0 ? (
                <ul className="space-y-4">
                    {teamMembers.map((member, idx) => (
                        <li
                            key={idx}
                            className=" bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-700 transition"
                        >
                             <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-blue-300 font-bold mr-3 text-md">
                            {member.username ? member.username[0].toUpperCase() : "?"}
                          </span>
                            <div>
                                <div className="font-semibold text-white">{member.username || "Unknown"}</div>
                                <div className="text-blue-300 text-sm">{member.email}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <h3 className="text-gray-400 font-medium text-lg mt-8 text-center">
                    No Team members found
                </h3>
            )}
        </div>
    );
}

export default TeamBar;