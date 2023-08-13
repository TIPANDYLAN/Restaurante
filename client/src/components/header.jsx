import React from "react";
import { useState } from "react";

import Modal from "./Modal.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import Lupa from "../images/search-icon.png";
import LoginPicture from "../images/login.png"
import { Login } from "./login.jsx";

export const Header = ({titulo,Buscar}) =>{
    const navigate = useNavigate();
    const [mostrar, setMostrar] = useState(false);
    const isAuthenticated = localStorage.getItem("auth") === "yes";

    return(
        <>
            <div className="Header"/>
            <div className="Menu">
                <div className="titulo">{titulo}</div>
                {isAuthenticated ? (
                <button className="login" onClick={() => {localStorage.clear();navigate("/");}} >
                    <div className="texto">Cerrar Sesión</div>
                </button>
                ) : (
                <button className="login" onClick={() => setMostrar(true)}>
                    <div className="texto">Iniciar Sesion</div>
                    <img src={LoginPicture} alt="" />
                </button>
                )}
                <div className="Busqueda">
                    {Buscar ? <><button><img src={Lupa} alt="" /></button><input type="text" placeholder="Buscar" className="Buscar"/></> : null}
                </div>
            </div>
            <Modal isOpen={mostrar} onClose={() => setMostrar(false)}>
                <Login/>
            </Modal>
        </>
    );
}