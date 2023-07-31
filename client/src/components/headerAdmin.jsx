import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal.jsx";
import "../styles/Header.css";
import Lupa from "../images/search-icon.png";
import Login from "../images/login.png"

export const HeaderAdmin = ({titulo,Buscar}) =>{

    const [mostrar, setMostrar] = useState(false);

    return(
        <>
            <div className="Header"/>
            <div className="titulo">Bienvenido Admin</div>
            <div className="Menu">
                <div className="MenuNav">
                    <nav>
                    <ul>
                        <li>
                        <Link to="/">Inicio</Link>
                        </li>
                        <li>
                        <Link to="/promociones">Clientes</Link>
                        </li>
                        <li>
                        <Link to="/parrilladas">Meseros</Link>
                        </li>
                        <li>
                        <Link to="/postres">Platos</Link>
                        </li>
                    </ul>
                    </nav>
                </div>
                <button className="login" onClick={()=>setMostrar(true)}>
                    <div className="texto">Iniciar Sesion</div>
                    <img src={Login} alt="" />
                </button>     
            </div>
            <Modal isOpen={mostrar} onClose={() => setMostrar(false)}/>
        </>
    );
}