import axios from "axios";
import React from "react";
import {Link, useNavigate} from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const handleLogout =async () => {
        try{
            let response = await axios.get('http://localhost:8000/logout', {
                withCredentials: true
            });
            console.log(response);
            navigate('/login');
        }
        catch(error)
        {

        }
    }
    return (
        <div className="w-64 bg-gray-800 text-white p-4 min-h-screen shadow-lg">
            <div className="text-center text-xl font-semibold">SnipSync</div>
            <ul className="mt-8">
                <li><Link to={'/dashboard'} className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Dashboard</Link></li>
                <li><Link to={'/myprojects'} className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">My Projects</Link></li>
                <li><Link to="/Profile" className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Profile</Link></li>
                <li><Link to={'/'} className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Teams</Link></li>
                <li><Link to={'/'} className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400">Settings</Link></li>
                <li><button className="block py-2 px-4 hover:bg-gray-700 hover:text-cyan-400" onClick={handleLogout}>Logout</button></li>
            </ul>
        </div>
  
    )
}
export default Sidebar;