import React, { useState, useEffect } from 'react';
import { fetchData } from '../js/fetchDataUrl';
import axios from 'axios';

const ComboBox = ({ initialText, mode, onSelectChange, opcionActual, cantidadPlatos, idPlato, idOrden }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(opcionActual ? opcionActual : 0);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    if (mode === 'ingredientes') {
      ObtenerIngredientes();
    } else if (mode === 'mesas') {
      fetchData('settings')
        .then(data => {
          setSettings(data);
        })
        .catch(error => {
          console.error('Error fetching settings:', error);
        });
    }
    setSelectedOption(opcionActual);
  }, [mode, opcionActual]);

  useEffect(() => {
    if (mode === 'mesas' && settings.length > 0) {
        const tableOptions = Array.from(
            { length: settings[0].NUM_MESAS_SE },
            (_, index) => index + 1
        );
      setOptions(tableOptions);
    } else if (mode === 'domicilio' && cantidadPlatos !== 0) {
        const tableOptions = Array.from(
            { length: cantidadPlatos},
            (_, index) => index + 1
            );
      setOptions(tableOptions);
    }
  }, [mode, settings, cantidadPlatos]);

  const ObtenerIngredientes = async () => {
    try{
      axios
      .get("http://localhost:4000/api/ingredientes")
      .then((response) => {
        setOptions(response.data);
      })
    }catch (error){
      console.error("Error al obtener los Ingredientes:", error);
    }
  }

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    onSelectChange(event.target.value, idPlato, idOrden);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="0">{initialText}</option>
        {options.map((option, index) => (
            <option key={index} value={option.id || option.NOMBRE_I}>
            {mode === 'ingredientes' ? option.NOMBRE_I : option}
            </option>
        ))}
        </select>
    </div>
  );
};

export default ComboBox;
