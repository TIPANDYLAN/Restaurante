import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from "./inicio";
import Cliente from "./cliente";
import Admin from "./admin";
import Postres from "./Postres";
import Parrilladas from "./Parrilladas";
import Promociones from "./Promociones";

export default function Page() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio/>} />
          <Route path="/Cliente" element={<Cliente/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/postres" element={<Postres/>} />
          <Route path="/parrilladas" element={<Parrilladas/>} />
          <Route path="/promociones" element={<Promociones/>} />
        </Routes>
      </Router>
    </>
  );
}
