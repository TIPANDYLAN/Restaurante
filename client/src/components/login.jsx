import React from "react";
import "../styles/Login.css";

import Logo from "../images/Logo.png";

export const Login = () =>{
    return(
        <>
            <div className="loginForm">
                <div className="logo"/>
                <div className="titulo">
                    Bienvenido
                </div>
                <p>Inicia sesión con tu usuario y contraseña</p>
                <div className="Form">
                    <p>Usuario</p>
                    <input type="text"/>
                </div>
                <div className="Form">
                    <p>Contraseña</p>
                    <input type="text"/>
                <button>Iniciar Sesión</button>
                <div className="Registrarse">
                    <p>No tienes una cuenta ? <a>Regístrate</a></p>
                </div>
                </div>
            </div>
        </>
    );
}