import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from "./inicio";

export default function Page() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio/>} />
        </Routes>
      </Router>
    </>
  );
}
