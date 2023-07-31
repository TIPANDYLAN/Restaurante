import  {HeaderAdmin}  from "../components/headerAdmin";

import  CrudPlatos  from "../components/CrudPlatos.jsx";

const AddPlatos = () => {
    return(
        <>
            <HeaderAdmin titulo={"Administrar Platos"} Buscar={false}/>
            <CrudPlatos/>
        </>
    )
}

export default AddPlatos;