import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Trash2Icon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const fetched = useRef(false);
    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:8000/notification", { withCredentials: true });
                setNotifications(res.data);

                await axios.post("http://localhost:8000/notification/mark-all-read", {}, { withCredentials: true });
            } catch (err) {
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, []);

    const handleDeleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/deletenotification/${id}`, { withCredentials: true });
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            toast.success("Notification deleted successfully");
        }
        catch (error) {
            console.error("Failed to delete notification:", error);
            toast.error("Failed to delete notification");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <div className="flex ml-64">
                <Sidebar />
                <div className="min-h-screen w-full px-8 py-8">
                    <div className="flex items-center gap-4 px-4 py-4 bg-black/40 rounded-xl shadow-lg mb-8">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-cyan-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7v10l10 5 10-5V7l-10 2.5z" fill="currentColor" />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">Notifications</h1>
                    </div>
                    <ul>
                        {notifications.length === 0 && <li className="text-gray-400">No notifications.</li>}
                        {notifications.map((n) => (
                            <li key={n._id} className={`mb-3 p-4 rounded-lg ${n.read ? "bg-gray-800" : "bg-gray-700"}`}>
                                <div className="flex justify-between">
                                    <span className="block text-white mt-1">{n.message}</span>
                                    <span><Trash2Icon className="text-white cursor-pointer hover:text-red-500 hover:scale-105 transform transition-all" onClick={() => { handleDeleteNotification(n._id) }} /></span>
                                </div>
                                <span className="block text-xs text-white mt-1">{new Date(n.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Notification;