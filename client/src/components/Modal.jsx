import "../styles/Modal.css";
import { Login } from "./login";

import fotoParrilla from "../images/Parrilla.webp";

const Modal = ({isOpen, onClose}) => {
    return (
        <>
            <div className="ContenedorModal" style={{display: isOpen ? 'grid' : 'none'}}>
                <div className="TarjetaModal">
                    <button className="btnCerrarModal" onClick={onClose}>X</button>
                    <div className="gridModal">
                        <Login/>
                        <div className="imagen"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;