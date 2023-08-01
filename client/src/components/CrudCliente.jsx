import "../styles/CrudCliente.css";

const CrudCliente = () =>{
    return(
        <>
            <div className="CrudCliente">
                <p>Cedula: </p>
                <input type="text"/>
                <div className="Proporciona">
                <p>No Proporciona:</p>
                <input type="checkbox"/>
                </div>
                <p>Nombre: </p>
                <input type="text" name="" id="" />
                <p>Direccion:</p>
                <input type="text" name="" id="" />
                <p>Telefono:</p>
                <input type="text" name="" id="" />
            </div>
        </>
    );
}

export default CrudCliente;