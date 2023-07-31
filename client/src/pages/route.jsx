import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from "./inicio";
import Cliente from "./cliente";
<<<<<<< HEAD
import Admin from "./admin";
import Postres from "./Postres";
import Parrilladas from "./Parrilladas";
import Promociones from "./Promociones";
=======
import AddPlatos from "./platos";
>>>>>>> fc9fa5673c8bb4799d282bd8c7c1f4932bf1410b

export default function Page() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio/>} />
          <Route path="/Cliente" element={<Cliente/>} />
<<<<<<< HEAD
          <Route path="/admin" element={<Admin/>} />
          <Route path="/postres" element={<Postres/>} />
          <Route path="/parrilladas" element={<Parrilladas/>} />
          <Route path="/promociones" element={<Promociones/>} />
=======
          <Route path="/Admin" element={<AddPlatos/>} />
>>>>>>> fc9fa5673c8bb4799d282bd8c7c1f4932bf1410b
        </Routes>
      </Router>
    </>
  );
}
