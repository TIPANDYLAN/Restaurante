import { Header } from "../components/header.jsx";
import React, { useState, useEffect } from "react";
import  Orden  from "../components/Orden.jsx";
import "../styles/Inicio.css";


const Inicio = () => {
  return (
    <>
      <Header titulo={"Menú de Platillos"} Buscar={true} />
      <div className="grid-container">
        
        <Orden />
      </div>
     
    </>
  );
};

export default Inicio;
