import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import { DataContext } from '../../../api/products';
import { storage } from "../../../firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "@firebase/storage";

export default function Modal(props) {

    const context = useContext(DataContext)

    const [proname, setProname] = useState("");
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [imageRef, setImageRef] = useState("");
    const [progress, setProgress] = useState(0);

    const handleClickModal = () => {
        uploudImage();
    }

    const addToCart = () => {
        context?.addProduct(window.localStorage.USER_KEY, proname, price, quantity, category, imageRef);
        setProgress(0);
        props.onClose();
    };

    const handleChange = e => {
        if (e.target.files[0]) {
            // console.log(e.target.files[0])
            setImage(e.target.files[0]);
        }
      };

    const uploudImage = () => {
        const storageRef = ref(storage,`/files/${proname}`);
        const uploadTask = uploadBytesResumable(storageRef,image);
        uploadTask.on("state_changed",(snapshot) => {
            const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(prog);
        }, (err)=>console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then(url => {
                    setImageRef(url);
                    console.log(imageRef)
                    if(imageRef !== ""){
                        setTimeout(addToCart, 3000);
                    }
                })    
            }
        );
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
                        <input className="" type="file" accept=".jpg,.png,.jpeg" onChange={handleChange} required />
                        <h5>Cargando: {progress}% </h5>
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