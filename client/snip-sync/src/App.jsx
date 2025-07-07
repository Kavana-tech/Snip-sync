import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MyProject from "./components/MyProjects";
import Profile from "./pages/Profile";
import InvitationRedirect from "./pages/InvitationRedirect";
import Settings from "./pages/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import ManageSnip from "./pages/ManageSnips";
import CreateFiles from "./pages/CreateFiles";
import OpenFile from "./pages/OpenFile";
import Teams from "./pages/Teams";
import StoreSnips from "./pages/StoreSnips";
import Admin from "./pages/Admin";
import ManageInvites from "./AdminPages/ManageInvites";
import ManageDeletions from "./AdminPages/ManageDeletions";
import Notification from "./pages/Notification";
import ManageTeams from "./AdminPages/ManageTeam";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile"  element={<Profile/>}></Route>
        <Route path="/myprojects" element={<MyProject />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/invite" element={<InvitationRedirect />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="projectdetails/:projectId" element={<ProjectDetails />}></Route>
        <Route path="/managesnips/:projectId" element={<ManageSnip/>}></Route>
        <Route path="/files/:folderId" element={<CreateFiles />}></Route>
        <Route path="/openfile" element={<OpenFile />}></Route>
        <Route path="/teams" element={<Teams />}></Route>
        <Route path="/admin/manageteams" element={<ManageTeams />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/admin/manageinvites" element={<ManageInvites />}></Route>
        <Route path="/admin/managedeletions" element={<ManageDeletions />}></Route>
        <Route path="admin/manageprojects" element={<Admin />}></Route>
        <Route path="/notification" element={<Notification />}></Route>
       <Route path="/storesnips/:projectId" element={<StoreSnips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
