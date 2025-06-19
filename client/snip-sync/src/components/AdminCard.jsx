import React from "react";
import { ChevronRight } from "lucide-react";

function AdminCard({ title, description, onClick }) {
    return (
        <div
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-700/30 transition cursor-pointer flex items-center justify-between"
            onClick={onClick}
        >
            <div>
                <h2 className="text-xl font-semibold text-cyan-400 mb-2">{title}</h2>
                <p className="text-gray-300">{description}</p>
            </div>
            <ChevronRight size={32} className="text-cyan-400" />
        </div>
    );
}

export default AdminCard;