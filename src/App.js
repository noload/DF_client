// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./components/Home"
import State from "./components/State.js";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import RegistrationForm from "./components/RegistrationForm";
import AddEditStatePage from "./components/AddEditStatePage";
import CityPage from "./components/City";
import AddEditCityPage from "./components/AddEditCity";
import WarehousePage from "./components/Warehouse";
import AddEditWarehousePage from "./components/AddEditWarehouse";
const App = () => {
  return (
    <Router>
   
        <Routes>
          <Route path="/home" element={<Home></Home>}/>
          <Route path="/" element={<Login/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/register" element={<RegistrationForm/>}/>
          <Route path="/state" element={<State/>}/>
          <Route path="/add-state" element={<AddEditStatePage />} />
          <Route path="/city" element={<CityPage />} />
          <Route path="/add-edit-city" element={<AddEditCityPage />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          <Route path="/add-edit-warehouse" element={<AddEditWarehousePage />} />

        </Routes>
    </Router>
  );
};


export default App;
