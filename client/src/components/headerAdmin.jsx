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
            <div className="titulo">Bienvenido Admin</div>
            <div className="Menu">
                <div className="MenuNav">
                    <nav>
                    <ul>
                        <li>
                        <Link to="/">Inicio</Link>
                        </li>
                    </ul>
                    </nav>
                </div>
                <button className="login" onClick={()=>setMostrar(true)}>
                    <a className="texto" onClick={() => {localStorage.clear();navigate("/");}}>
                    <h6>Log Out</h6>{" "}
                    </a>
                </button>  
            </div>
            <Modal isOpen={mostrar} onClose={() => setMostrar(false)}/>
        </>
    );
}