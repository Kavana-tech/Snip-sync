import axios from "axios";
import React, { useState } from "react";
function ApproveFolderDelete({ pendingProjects, setPendingProjects, projectId }) {

   const handleApproveDelete = async (pendingDeleteId) => {
    try {
        const res = await axios.post(
            `http://localhost:8000/approve-deletefolder/${projectId}/${pendingDeleteId}`,
            {},
            { withCredentials: true }
        );
        //toast.success(res.data.message || "Folder deletion approved");
        setPendingProjects(prev => prev.filter(req => req._id !== pendingDeleteId));
        const response = await axios.delete(`http://localhost:8000/deletefolder/${projectId}/${pendingDeleteId}`, { withCredentials: true });
    } catch (error) {
        //toast.error(error.response?.data?.message || "Failed to approve deletion");
        console.error("Error approving folder delete:", error);
    }
};

    const handleRejectDelete = async (pendingDeleteId) => {
    try {
        const res = await axios.post(
            `http://localhost:8000/reject-deletefolder/${projectId}/${pendingDeleteId}`,
            {},
            { withCredentials: true }
        );
        setPendingProjects(prev => prev.filter(req => req._id !== pendingDeleteId));
    } catch (error) {
        console.error("Error rejecting folder delete:", error);
    }
};
    return (
        <>
            <div className="bg-gray-800 p-4 rounded-lg m-6">
                <h2 className="text-xl font-semibold mb-2">Pending Folder Delete Requests</h2>
                {pendingProjects.length > 0 ? (
                    pendingProjects.map(req => (
                        <div key={req._id} className="flex justify-between items-center mb-2 p-2 bg-gray-700 rounded">
                            <span>Folder ID: {req.folderId}</span>
                            <button
                                className="bg-blue-600 px-3 py-1 rounded text-white"
                                onClick={() => handleApproveDelete(req._id)}
                            >
                                Approve Delete
                            </button>
                            <button
                                className="bg-red-600 px-3 py-1 rounded text-white"
                                onClick={() => handleRejectDelete(req._id)}>Reject</button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-xl text-gray-500">No pending requests</div>
                )}
            </div>
        </>
    )

}
export default ApproveFolderDelete; 