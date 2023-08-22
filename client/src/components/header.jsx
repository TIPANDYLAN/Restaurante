import React from "react";
import { useState } from "react";

import Modal from "./Modal.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import LoginPicture from "../images/login.png"
import { Login } from "./login.jsx";

export const Header = ({titulo}) =>{
    const navigate = useNavigate();
    const [mostrar, setMostrar] = useState(false);
    const isAuthenticated = localStorage.getItem("auth") === "yes";
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const cargoUsuario = localStorage.getItem("Cargo")

    return(
        <>
            <div className="Header"/>
            <div className="Menu">
                <div className="titulo">{titulo}</div>
                {isAuthenticated ? (
                    <div className="Usuario">
                    <p>{nombreUsuario} | {cargoUsuario}</p>
                    <button
                      className="login"
                      onClick={() => {
                        localStorage.clear();
                        navigate("/");
                      }}
                    >
                      <div className="texto">Cerrar Sesión</div>
                    </button>
                  </div>
                ) : (
                <button className="login" onClick={() => setMostrar(true)}>
                    <div className="texto">Iniciar Sesion</div>
                    <img src={LoginPicture} alt="" />
                </button>
                )}
            </div>
            <Modal isOpen={mostrar} onClose={() => setMostrar(false)}>
                <Login/>
            </Modal>
        </>
    );
}