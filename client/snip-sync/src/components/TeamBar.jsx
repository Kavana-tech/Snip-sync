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
        <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "250px",
            height: "100vh",
            background: "#000",
            borderLeft: "1px solid #ddd",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.05)",
            padding: "24px 16px",
            zIndex: 1000,
            overflowY: "auto"
        }}>
            <h3 style={{ marginBottom: "16px", color: "#fff", fontSize:"20px", textAlign:'center', borderBottom:'3px solid gray'}}>Team Members</h3>
            {teamMembers.length > 0 ? (<ul style={{ listStyle: "none", padding: 0 }}>
                {teamMembers.map((member, idx) => (
                    <li key={idx} className="bg-gray-800 text-white rounded-md p-4 mt-6 shadow-2xl">
                        <div>{member.username}</div>
                        <div>{member.email}</div>
                    </li>
                ))}
            </ul>) : <h3 className="text-gray-400 font-medium text-xl mt-6">No Team members found</h3>}
        </div>
    );
}

export default TeamBar;