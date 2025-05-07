import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MyProject from "./components/MyProjects";
import Profile from "./pages/Profile";
import InvitationRedirect from "./pages/InvitationRedirect";
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
