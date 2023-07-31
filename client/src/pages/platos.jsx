import { Header } from "../components/header.jsx";
import React, { useState, useEffect } from "react";
import  CrudPlatos  from "../components/CrudPlatos.jsx";

const AddPlatos = () => {
    return(
        <>
            <Header titulo={"Administrar Platos"} Buscar={false}/>
            <CrudPlatos/>
        </>
    )
}

export default AddPlatos;