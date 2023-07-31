import React from "react";
import { Header } from "../components/header.jsx";


const Cliente = () => {
    return (
        <>
            <Header titulo={"Menú de Platillos"} Buscar={true} />
            <div className='bodycl'>
                <div className='signup-container'>
                    <div className='left-container'>
                        <h1>
                            <img src='https://static.wixstatic.com/media/8828ea_dfee7b2c1ef14c5a8c6c26d37afa51c2~mv2.gif' className='fas fa-paw'/>
                        </h1>
                        <div className='puppy'>
                            <img src='https://images.vexels.com/media/users/3/212870/isolated/preview/82723f8894e3294d3e3c9d9d773cd1d3-tapa-de-la-parrilla-de-barbacoa-roja-abierta.png' alt='puppy' />
                        </div>
                    </div>
                    <div className='right-container'>
                        <header>
                            
                            <div className='set'>
                                <div className='pets-name'>
                                    <label htmlFor='pets-name'>Nombre</label>
                                    <input id='pets-name' placeholder="Nombre..." type='text' />
                                </div>
                                <div className='pets-photo'>
                                    <button id='pets-upload'>
                                        <i className='fas fa-camera-retro'></i>
                                    </button>
                                    <label htmlFor='pets-upload'>Carga una foto</label>
                                </div>
                            </div>
                            <div className='set'>
                                <div className='pets-breed'>
                                    <label htmlFor='pets-breed'>Correo</label>
                                    <input id='pets-breed' placeholder="...@hotmail.com" type='email' />
                                </div>
                                <div className='pets-birthday'>
                                    <label htmlFor='pets-birthday'>Telefono</label>
                                    <input id='pets-birthday' placeholder='(+593)...........' type='number' />
                                </div>
                            </div>
                            <br></br>
                            <div className='set'>
                                <div className='pets-gender'>
                                    <label htmlFor='pet-gender-female'>Genero</label>
                                    <div className='radio-container'>
                                        <input id='pet-gender-female' name='pet-gender' type='radio' value='female' />
                                        <label htmlFor='pet-gender-female'>Masculino</label>
                                        <input id='pet-gender-male' name='pet-gender' type='radio' value='male' />
                                        <label htmlFor='pet-gender-male'>Femenino</label>
                                    </div>
                                </div>
                            </div>
                            <br></br>
                            <div className='pets-breed'>
                                    <label htmlFor='pets-breed'>Direccion</label>
                                    <br></br>
                                    <input  id='pets-breed' placeholder="Sector/Barrio" type='text' />
                                </div>

                        </header>
                        <footer>
                            <div className='set'>
                                <button id='back'>Atras</button>
                                <button id='next'>Registrar</button>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cliente;
