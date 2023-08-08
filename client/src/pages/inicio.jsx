import { Header } from "../components/header.jsx";
import  Orden  from "../components/Orden.jsx";
import  Cocina  from "../components/Cocina.jsx";
import "../styles/Inicio.css";

const Inicio = () => {
  return (
    <>
      <Header titulo={"Menú de Platillos"} Buscar={true} />
      <div className="grid-container">
        <Orden />
      </div>
    </>
  );
};
export default Inicio;
