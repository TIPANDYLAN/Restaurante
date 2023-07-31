import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../styles/Login.css";
import Logo from "../images/Logo.png";

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin");
  };
  
  const [body, setBody] = useState({ username: "", password: "" });
  const [nombreLog, setClienteLog] = useState("");
  const [contraseñaLog, setContraseñaLog] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const log = () => {
    Axios.post("http://127.0.0.1:4000/api/login", {
      USUARIO_EMP: nombreLog,
      CONTRASENA_EMP: contraseñaLog,
    })
    .then((response) => {
      console.log(response.data); // Agrega este console.log para depurar
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        const USUARIO_EMP = nombreLog;
        setLoginStatus("Bienvenido: " + USUARIO_EMP);
        localStorage.setItem("auth", "yes");
        localStorage.setItem("nombreUsuario", USUARIO_EMP);
        navigate("/admin");
      }
    })
    .catch((error) => {
      setLoginStatus("Error en la solicitud de inicio de sesión");
    });
  };

  return (
    <>
      <div className="loginForm">
        <div className="logo" />
        <div className="titulo">Bienvenido</div>
        <p>Inicia sesión con tu usuario y contraseña</p>
        <div className="Form">
          <p>Usuario</p>
          <input
            type="text"
            placeholder="Usuario..."
            onChange={(e) => {
              setClienteLog(e.target.value);
            }}
            />
        </div>
        <div className="Form">
          <p>Contraseña</p>
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => {
              setContraseñaLog(e.target.value);
            }}
            />
          <button onClick={log}>Iniciar Sesión</button>
          <div className="Registrarse">
            <p>
              No tienes una cuenta ? <a>Regístrate</a>
            </p>
            <p>{loginStatus}</p>
          </div>
        </div>
      </div>
    </>
  );
};
