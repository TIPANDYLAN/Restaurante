import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from "./inicio";
import AddPlatos from "./platos";
import Cocina from "./cocina";

export default function Page() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio/>} />
          <Route path="/Admin" element={<AddPlatos/>} />
          <Route path="/Cocina" element={<Cocina/>} />
        </Routes>
      </Router>
    </>
  );
}
