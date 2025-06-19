import React from "react";
function ManageProjects(){
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
            <div className="flex ml-64">
                <div className="min-h-screen w-full px-8 py-8">
                    <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Manage Projects</h1>
                    </div>
                    {/* Content for managing projects goes here */}
                </div>
            </div>
        </div>
    );
}

export default ManageProjects;
