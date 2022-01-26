import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { DataContext } from '../../../api/products';


export default function ModalDelUser(props) {

    const context = useContext(DataContext);

    const [cedula, setCedula] = useState();

    const handleClickModal = () => {
        DeleteUser()
    }
    const DeleteUser = () => {
        if (window.confirm("Estas seguro que deseas eliminar este cliente?") === true) {
            context?.DelUser(window.localStorage.USER_KEY, cedula);
            props.onClose(); 
        }
    };

    if (!props.isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="Modal">
            <div className="Modal__container">
                <button className="Modal__close-button" onClick={props.onClose}>
                    x
                </button>
                <div >
                    <div>
                        <h1>Agregar un Nuevo Cliente</h1>
                        <label>ingrese el cedula del cliente:</label>
                        <input className="" type="text" onChange={(e) => { setCedula(e.target.value); }} required />                        
                    </div>
                    <button className="btn--cart" onClick={() => handleClickModal()}>
                        Eliminar Cliente
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modaldeluser")
    );
}