import { Header } from "../components/header.jsx";
import  Fact  from "../components/Caja.jsx";
import React, { useEffect } from 'react';

const Caja = ()=> {

    useEffect(() => {
        document.title = 'Facturación - Kandela';
      }, []);

    return(
        <>
            <Header titulo={"Facturacion"}/>
            <Fact/>
        </>
    );
}

export default Caja;