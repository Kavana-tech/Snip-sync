import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AddTeam from "./pages/AddTeam";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Homepage" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/addteam" element={<AddTeam />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
