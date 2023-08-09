import { Header } from "../components/header.jsx";
import  CocinaCrud  from "../components/Cocina.jsx";
import React, { useEffect } from 'react';

const Cocina = ()=> {

    useEffect(() => {
        document.title = 'Cocina - Kandela';
      }, []);

    return(
        <>
            <Header titulo={"Ordenes a Producir"}/>
            <CocinaCrud/>
        </>
    );
}

export default Cocina;