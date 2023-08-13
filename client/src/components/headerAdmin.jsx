import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal.jsx";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

export const HeaderAdmin = ({titulo,Buscar}) =>{
    const navigate = useNavigate();
    const [mostrar, setMostrar] = useState(false);

    return(
        <>
            <div className="Header"/>
            <div className="Menu">
                <div className="MenuNav">
                    <nav>
                    <ul>
                        <li className="botoncito">
                        <Link to="/">Inicio</Link>
                        </li>
                    </ul>
                    </nav>
                </div>
                <button className="login" onClick={() => {localStorage.clear();navigate("/");}} >
                    <div className="texto">Cerrar Sesión</div>
                </button> 
            </div>
            <Modal isOpen={mostrar} onClose={() => setMostrar(false)}/>
        </>
    );
}