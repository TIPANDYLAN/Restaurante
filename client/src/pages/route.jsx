import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoutes from "../components/PrivateRoutes";
import Inicio from "./inicio";
import AddPlatos from "./platos";
import Cocina from "./cocina";
import Caja from "./caja";

export default function Page() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route
          element={<PrivateRoutes allowedRoles={["admin"]} />}
          path="/Admin"
        >
          <Route element={<AddPlatos />} index />
        </Route>
        <Route
          element={<PrivateRoutes allowedRoles={["chef"]} />}
          path="/Cocina"
        >
          <Route element={<Cocina />} index />
        </Route>
        <Route
          element={<PrivateRoutes allowedRoles={["mesero"]} />}
          path="/Mesero"
        >
          <Route element={<Inicio />} index />
        </Route>
        <Route
          element={<PrivateRoutes allowedRoles={["caja"]} />}
          path="/Caja"
        >
          <Route element={<Caja />} index />
        </Route>
      </Routes>
    </Router>
  );
}
