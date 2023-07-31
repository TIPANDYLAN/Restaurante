import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal.jsx";
import "../styles/Header.css";
import Lupa from "../images/search-icon.png";
import Login from "../images/login.png"

export const Header = ({titulo,Buscar}) =>{

    const [mostrar, setMostrar] = useState(false);

    return(
        <>
            <div className="Header"/>
            <div className="Menu">
                <div className="titulo">{titulo}</div>
                <button className="login" onClick={()=>setMostrar(true)}>
                    <div className="texto">Iniciar Sesion</div>
                    <img src={Login} alt="" />
                </button>
                <div className="Busqueda">
                    {Buscar ? <><button><img src={Lupa} alt="" /></button><input type="text" placeholder="Buscar" className="Buscar"/></> : null}
                </div>
                
            </div>
            <Modal isOpen={mostrar} onClose={() => setMostrar(false)}/>
        </>
    );
}