import "../styles/Modal.css";

const Modal = ({isOpen, onClose, children}) => {
    return (
        <>
            <div className="ContenedorModal" style={{display: isOpen ? 'grid' : 'none'}}>
                <div className="TarjetaModal">
                    <button className="btnCerrarModal" onClick={onClose}>X</button>
                    {children}
                </div>
            </div>
        </>
    );
}

export default Modal;