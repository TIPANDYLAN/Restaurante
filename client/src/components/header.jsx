import React from "react";

import "../styles/Header.css";
import Lupa from "../images/search-icon.png";
import Login from "../images/login.png"

export const Header = ({titulo,Buscar}) =>{

    return(
        <>
            <div className="Header"/>
            <div className="Menu">
                <div className="titulo">{titulo}</div>
                <button className="login">
                    <div className="texto">Iniciar Sesion</div>{}
                    <img src={Login} alt="" />
                </button>
                <div className="Busqueda">
                    <button><img src={Lupa} alt="" /></button>
                    {Buscar ? <input type="text" placeholder="Buscar" className="Buscar"/> : null}
                </div>
            </div>
        </>
    );
}