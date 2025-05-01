import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Sidebar from "./pages/Sidebar";
import AddTeam from "./pages/AddTeam";
import MyProject from "./components/MyProjects";
import Profile from "./pages/profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/sidebar" element={<Sidebar />}></Route>
        <Route path="/addteam" element={<AddTeam />}></Route>
        <Route path="/profile"  element={<Profile/>}></Route>
        <Route path="/myprojects" element={<MyProject />}></Route>
        <Route path="/profile"  element={<Profile/>}></Route>
        <Route path="/settings" element={<Settings/>}></Route>
        <Route path="/logout"    element={<Logout/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/teams"     element={<Teams/>}></Route>

 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
