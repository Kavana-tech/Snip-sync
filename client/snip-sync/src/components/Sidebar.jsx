import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/homepageLogo.png'
import { Bell, Folders, Home, LayoutDashboard, LogOut, Settings, User, User2, Users } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get("http://localhost:8000/notification/unread/count", { withCredentials: true });
        setUnreadCount(res.data.count);
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchUnread();
  }, []);

  const handleLogout = async () => {
    try {
      let response = await axios.get('http://localhost:8000/logout', {
        withCredentials: true
      });
      console.log(response);
      navigate('/login');
    }
    catch (error) {

    }
  }
  return (
    // className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
    <div className="w-64 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 text-white pt-4 min-h-screen shadow-lg fixed left-0 top-0 h-screen z-40">
      <Link to={'/'}><img src={logo} className="h-16" /></Link>
      <ul className="mt-4 flex flex-col gap-10 text-[17px]">
        <li><Link to={'/'} className="block py-2 px-6 hover:bg-gray-700 hover:text-cyan-400"><div className="flex"><Home className="mr-4" />Home</div></Link></li>
        <li> <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block py-2 px-6 transition-colors duration-200 rounded-md ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
            }`
          }
        >
          <div className="flex items-center" >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </div>
        </NavLink></li>
        <li> <NavLink
          to="/myprojects"
          className={({ isActive }) =>
            `block py-2 px-6 transition-colors duration-200 rounded-md ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
            }`
          }
        >
          <div className="flex items-center">
            <Folders className="mr-4" />
            My Projects
          </div>
        </NavLink></li>
        <li><NavLink
          to="/Profile"
          className={({ isActive }) =>
            `block py-2 px-6 transition-colors duration-200 rounded-md ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
            }`
          }
        >
          <div className="flex items-center">
            <User className="mr-4" />
            Profile
          </div>
        </NavLink>
        </li>

        <li><NavLink
          to="/teams"
          className={({ isActive }) =>
            `block py-2 px-6 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
            }`
          }
        >
          <div className="flex items-center" >
            <Users className="mr-4" />
            Teams
          </div>
        </NavLink></li>

        <li><NavLink
          to="/settings"
          className={({ isActive }) =>
            `block py-2 px-6 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
            }`
          }
        >
          <div className="flex items-center">
            <Settings className="mr-4" />
            Settings
          </div>
        </NavLink></li>
        <li>
          <NavLink
            to="/notification"
            className={({ isActive }) =>
              `block py-2 px-6 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
              }`
            }
          >
            <div className="flex items-center relative">
              <Bell className="mr-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-cyan-400 text-gray-900 rounded-full px-2 py-0.5 text-xs font-bold absolute right-0">
                  {unreadCount}
                </span>
              )}
            </div>
          </NavLink>
        </li>
        <li><NavLink
          to="/admin"
          className={({ isActive }) =>
            `block py-2 px-6 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-700 text-cyan-400' : 'text-white hover:bg-gray-700 hover:text-cyan-400'
            }`
          }
        >
          <div className="flex items-center">
            <User2 className="mr-4" />
            Admin
          </div>
        </NavLink></li>
        <li><button className="block py-2 px-6 hover:bg-gray-700 hover:text-cyan-400 w-full" onClick={handleLogout}><div className="flex"><LogOut className="mr-4" />Logout</div></button></li>
      </ul>
    </div>

  )
}

export default Sidebar;

