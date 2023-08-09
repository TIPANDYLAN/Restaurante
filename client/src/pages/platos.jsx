import  {HeaderAdmin}  from "../components/headerAdmin";
import React, { useEffect } from 'react';

import  CrudPlatos  from "../components/CrudPlatos.jsx";

const AddPlatos = () => {

    useEffect(() => {
        document.title = 'Administrador - Kandela';
      }, []);

    return(
        <>
            <HeaderAdmin titulo={"Administrar Platos"} Buscar={false}/>
            <CrudPlatos/>
        </>
    )
}

export default AddPlatos;