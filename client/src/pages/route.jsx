import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from "./inicio";
import Cliente from "./cliente";

export default function Page() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio/>} />
          <Route path="/Cliente" element={<Cliente/>} />
        </Routes>
      </Router>
    </>
  );
}
