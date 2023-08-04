import "../styles/CrudCliente.css";

const CrudCliente = () =>{

    document.getElementById('numberInput').addEventListener('input', function () {
        var value = this.value;
        var numericValue = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        var trimmedValue = numericValue.slice(0, 10); // Limitar a 10 dígitos numéricos
        if (trimmedValue !== numericValue) {
          this.value = trimmedValue; // Actualizar el valor del campo si se recortó
        }
      });

    return(
        <>
            
        </>
    );
}

export default CrudCliente;