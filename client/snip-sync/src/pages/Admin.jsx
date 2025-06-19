import React from "react";
import Sidebar from "../components/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminCard from "../components/AdminCard";

function Admin() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen w-full px-8 py-8">
                    <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Admin Dashboard</h1>
                    </div>
                    <div className="grid grid-cols-1 gap-6 w-full">
                        <AdminCard
                            title="Manage Invites"
                            description="View and control project invitations sent to users."
                            onClick={() => navigate("/admin/manageinvites")}
                        />
                        <AdminCard
                            title="Manage Deletions"
                            description="Approve or reject folder and file deletion requests."
                            onClick={() => navigate("/admin/managedeletions")}
                        />
                        <AdminCard
                            title="Manage Team Members"
                            description="Add, remove, or update team members in projects."
                            onClick={() => navigate("/teams")}
                        />
                        <AdminCard
                            title="Manage Projects"
                            description="Create, update, or delete projects and view details."
                            onClick={() => navigate("/myprojects")}
                        />
                        <AdminCard
                            title="View Activity Logs"
                            description="Monitor recent activities and changes in the system."
                            onClick={() => navigate("/")}
                        />
                        {/* <AdminCard
                            title="System Settings"
                            description="Configure application-wide settings and preferences."
                            onClick={() => navigate("/")}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Admin;