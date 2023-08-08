import { Header } from "../components/header.jsx";
import  CocinaCrud  from "../components/Cocina.jsx";

const Cocina = ()=> {
    return(
        <>
            <Header titulo={"Ordenes a Producir"}/>
            <CocinaCrud/>
        </>
    );
}

export default Cocina;