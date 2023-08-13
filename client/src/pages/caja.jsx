import { Header } from "../components/header.jsx";
import React, { useEffect } from 'react';

const Caja = ()=> {

    useEffect(() => {
        document.title = 'Caja - Kandela';
      }, []);

    return(
        <>
            <Header titulo={"Bienvenido a Caja"}/>

        </>
    );
}

export default Caja;