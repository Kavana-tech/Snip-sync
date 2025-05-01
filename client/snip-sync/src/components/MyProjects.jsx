import React from "react";
import { Plus } from "lucide-react";
function MyProject() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <div className="flex px-4 py-2 justify-between">
                <h1 className="text-2xl font-semibold">Your Projects:</h1>
                <button type="button" className="bg-blue-500 cursor-pointer px-8 py-2 text-2xl font-semibold rounded-md">
                    <div className="flex justify-center items-center">New<Plus className="ml-2 font-semibold" /></div>
                </button>
            </div>
        </div>
    );
}
export default MyProject;