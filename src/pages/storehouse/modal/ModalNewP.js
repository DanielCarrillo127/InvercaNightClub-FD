import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { DataContext } from '../../../api/products';


export default function Modal(props) {

    const context = useContext(DataContext)

    const [proname, setProname] = useState("");
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    const handleClickModal = () => {
        // 'product1', '3000', '3','extra', 'https://bodegaeltrebol.com/wp-content/uploads/2018/12/aa-134.png'
        addToCart()
    }
    const addToCart = () => {
        context?.addProduct(window.localStorage.USER_KEY, proname, price, quantity, category, image);
        props.onClose();
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
                    <h1>Agregar un nuevo producto</h1>
                    <div className=''>
                        <label>Nombre del producto:</label>
                        <input className="" type="text" onChange={(e) => { setProname(e.target.value); }} required />
                        <label>Precio del producto:</label>
                        <input className="" type="number" onChange={(e) => { setPrice(e.target.value); }} required />
                        <label>Ingresa la cantidad existente del producto:</label>
                        <input className="" type="number" onChange={(e) => { setQuantity(e.target.value); }} required />
                        <label>Ingrese la categoria del producto:</label>
                        <input className="" type="text" onChange={(e) => { setCategory(e.target.value); }} required />
                        <label>Ingrese la imagen del producto:</label>
                        <input className="" type="text" placeholder='link/url' onChange={(e) => { setImage(e.target.value); }} required />
                        <input className="" type="file" disabled onChange={(e) => { setImage(e.target.value); }} required />
                    </div>
                    <button className="btn--cart" onClick={() => handleClickModal()}>
                        Agregar Producto
                        </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal")
    );
}